import Channel from "App/Models/Channel";
import {ChannelRepositoryContract, ChannelUser, SerializedChannel} from "@ioc:Repositories/ChannelRepository";
import {ChannelType} from "App/Enums/ChannelType";
import User from "App/Models/User";
import { DateTime } from 'luxon';
import {Error} from "memfs/lib/internal/errors";
import Kick from "App/Models/Kick";
import Message from "App/Models/Message";
import Ws from "@ioc:Ruby184/Socket.IO/Ws";
// import Message from "App/Models/Message";

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
      const namespace = Ws.io.of(`/channels/${channel.name}`);
      namespace.emit('channel-removed', {
        channelName: channel.name,
      });
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
    const namespace = Ws.io.of(`/channels/${channel.name}`);
    namespace.emit('channel-removed', {
      channelName: channel.name,
    });
    await channel.delete();
    return;
  }

  public async revoke(user_name: string, channel_name: string) {
    let channel :  Channel | SerializedChannel | null = await Channel.findBy('name', channel_name);
    let revoked_user : User | null = await User.findBy('nickname', user_name);
    if(revoked_user && channel && channel.type == ChannelType.PRIVATE){
      const namespace = Ws.io.of(`/channels/${channel_name}`);
      namespace.emit('user-kicked', {
        userName: user_name,
        channelName: channel_name,
        kickedBy: 0,
      });
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
        await Kick.create({
          kickedId: kicked_user.id,
          userId: active_user_id,
          channelId: channel.id
        })
        const namespace = Ws.io.of(`/channels/${channel_name}`);
        namespace.emit('user-kicked', {
          userName: user_name,
          channelName: channel_name,
          kickedBy: active_user_id,
        });
        kicked_user.related('channels').detach([channel.id])
      }else{                                     // if not +1 to kick count if 3 kick
        const userChannel = await kicked_user
          .related('channels')
          .query()
          .where('channel_id', channel.id)
          .first();
        if (userChannel) {
          //check if already not kicked by this user
          let kick: Kick| null = await Kick.query().
            where('kickedId', kicked_user.id).
            where('channelId', channel.id).where('userId', active_user_id).first()
          if( kick ) {
            //throw new Error("User already kicked by this user.")
          }else {
            // add kick
            await Kick.create({
              kickedId: kicked_user.id,
              userId: active_user_id,
              channelId: channel.id
            })
            // check if 3 kicks then delete
            let kicked: Kick[] | null = await Kick.query().
            where('kickedId', kicked_user.id).
            where('channelId', channel.id)
            //console.log(kicked)
            if (kicked && kicked.length >= 3){
              const namespace = Ws.io.of(`/channels/${channel_name}`);
              namespace.emit('user-kicked', {
                userName: user_name,
                channelName: channel_name,
                kickedBy: active_user_id,
              });
              kicked_user.related('channels').detach([channel.id])
            }
          }
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
      let kicked_by_creator: Kick| null = await Kick.query().
      where('kickedId', user_id).
      where('channelId', channel.id).where('userId', channel.creator_id).first()
      let kicks: Kick[] | Kick | null = await Kick.query().
      where('kickedId', user_id).
      where('channelId', channel.id)
    let messagesNewest = await Message.query()
      .where("channelId", channel_id)
      .orderBy("createdAt", "desc")  // Order by the most recent message
      .first()
    if(messagesNewest){
      const createdAt = messagesNewest.createdAt
      const thirtyDaysAgo = DateTime.now().minus({ days: 30 });

      if (createdAt < thirtyDaysAgo) {
        console.log("Last Message is older than 30 days");
        await Channel.query()
          .where('id', channel.id)
          .delete();
        throw new Error('Channel is not active');
      } else {
        console.log("Last Message is within the last 30 days");
      }
    }else{
      console.log("no message in channel")
    }


    if(kicked_by_creator) {
        throw new Error('Banned by creator');
      }else if (kicks && kicks.length >= 3) {
        throw new Error('Kicked by users');
      }else{
        // When user is already in the channel error is thrown
        await user.related('channels').attach([channel_id])
      }

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

  public async getChannelUsers(channel_name: string): Promise<ChannelUser[]> {
    const channel = await Channel.findBy('name', channel_name);
    if (!channel) {
      throw new Error('Channel not found');
    }

    const users = await channel.related('users').query();
    return users.map((user) => ({
      id: user.id,
      name: user.nickname,
      status: user.status
    } as ChannelUser));
  }
}
