import Channel from "App/Models/Channel";
import {ChannelRepositoryContract, SerializedChannel} from "@ioc:Repositories/ChannelRepository";
import {ChannelType} from "App/Enums/ChannelType";
import User from "App/Models/User";


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

  public async join(user_id: number, channel_id: number): Promise<SerializedChannel> {
    const user = await User.findOrFail(user_id);
    const channel = await Channel.findOrFail(channel_id);
    const isConnected = await user.related('channels').query().where('channel_id', channel_id).first()
    if (!isConnected) {
      await user.related('channels').attach([channel_id])
    }
    return channel.serialize() as SerializedChannel
  }
}
