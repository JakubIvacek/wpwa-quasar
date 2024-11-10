import Channel from "App/Models/Channel";
import {ChannelRepositoryContract, SerializedChannel} from "@ioc:Repositories/ChannelRepository";
import {ChannelType} from "App/Enums/ChannelType";
import User from "App/Models/User";
import {Error} from "memfs/lib/internal/errors";


export default class ChannelRepository implements ChannelRepositoryContract {
  public async getAll(): Promise<SerializedChannel[]> {
    const channels = await Channel.all();
    return channels.map(
      (channel) => channel.serialize() as SerializedChannel
    );
  }
  public async create (name: string, channelType: ChannelType, creatorId: number): Promise<SerializedChannel> {
    try {
      // Creating the new channel
      const channel_new = await Channel.create({
        name: name,
        type: channelType,
        creator_id: creatorId
      });

      // Return the serialized channel
      return channel_new.serialize() as SerializedChannel;
    } catch (error) {
      // Handle the error properly
      console.error('Error creating channel:', error);
      throw new Error('Unable to create channel');
    }
  }
  public async leave(user_id: number, channel_id: number) {
    const user = await User.findOrFail(user_id);

    // Check if the user is in the channel
    const isInChannel = await user.related('channels').query().where('channel_id', channel_id).first();

    if (!isInChannel) {
      throw new Error('User is not in the specified channel');
    }

    // Check if the user is the channel creator
    if (isInChannel.creator_id === user_id) {
      user.related('channels').detach([channel_id]);
      const channel = await Channel.findOrFail(channel_id);
      await channel.delete();
      return;
    }

    // Detach user from the channel if not the creator
    await user.related('channels').detach([channel_id]);
  }
  public async quit(user_id: number, channel_id: number) {
    const user = await User.findOrFail(user_id);

    // Check if the user is in the channel
    const isInChannel = await user.related('channels').query().where('channel_id', channel_id).first();

    if (!isInChannel) {
      throw new Error('User is not in the specified channel');
    }
    // delete channel
    user.related('channels').detach([channel_id]);
    const channel = await Channel.findOrFail(channel_id);
    await channel.delete();
    return;
  }

  public async revoke(user_name: string, channel_name: string) {
    let channel :  Channel | SerializedChannel | null = await Channel.findBy('name', channel_name);
    let revoked_user : User | null = await User.findBy('nickname', user_name);
    if(revoked_user && channel){
      revoked_user.related('channels').detach([channel.id])
    }
    return;
  }

  public async kick(user_name: string, channel_name: string, active_user_id: number) {
    let channel :  Channel | SerializedChannel | null = await Channel.findBy('name', channel_name);
    let kicked_user : User | null = await User.findBy('nickname', user_name);
    if(kicked_user && channel &&
      channel.creator_id != kicked_user.id //so we cant kick creator from channel
    ){
      if (channel.creator_id == active_user_id){ // if kicked by creator kick immediately
        kicked_user.related('channels').detach([channel.id])
      }else{                                     // if not +1 to kick count if 3 kick
        const userChannel = await kicked_user
          .related('channels')
          .query()
          .where('channel_id', channel.id)
          .first();
        if (userChannel) {
          // Increment `kick_count`
          await kicked_user
            .related('channels')
            .pivotQuery()
            .where('channel_id', channel.id)
            .increment('kick_count', 1)
          const updatedUserChannel = await kicked_user
            .related('channels')
            .query()
            .wherePivot('channel_id', channel.id)
            .first()

          if (updatedUserChannel && updatedUserChannel.$extras.kick_count >= 3) {
            // Detach the user from the channel if `kick_count` is 3 or more
            await kicked_user.related('channels').detach([channel.id])
            return
          }
          return
        } else {
          throw new Error("User is not in this channel.")
        }
      }
    }
    return;
  }

  public async join(user_id: number, channel_id: number): Promise<SerializedChannel> {
      const user = await User.findOrFail(user_id);
      const channel = await Channel.findOrFail(channel_id);

      // When user is already in the channel error is thrown
      await user.related('channels').attach([channel_id])

    return {
      id: channel.id,
      name: channel.name,
      type: channel.type,
      creator_id: channel.creator_id
    } as SerializedChannel;
  }

  public async getUserChannels(userId: number): Promise<SerializedChannel[]> {

    // Check if the user exists
    await User.findOrFail(userId);

    try {
      const channels = await Channel.query()
        .join('channel_users', 'channels.id', 'channel_users.channel_id')
        .where('channel_users.user_id', userId)
        .select('channels.*');

      return channels.map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
        creator_id: channel.creator_id,
      } as SerializedChannel))
    }catch (error) {
      console.error('Error getting user channels:', error);
      throw new Error('Unable to get user channels');
    }

  }
}
