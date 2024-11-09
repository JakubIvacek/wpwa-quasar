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

    // Detach user from the channel
    await user.related('channels').detach([channel_id]);
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
