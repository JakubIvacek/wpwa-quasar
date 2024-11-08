import Channel from "App/Models/Channel";
import {ChannelRepositoryContract, SerializedChannel} from "@ioc:Repositories/ChannelRepository";
import {ChannelType} from "App/Enums/ChannelType";
import User from "App/Models/User";


export default class ChannelRepository implements ChannelRepositoryContract {
  public async getAll(): Promise<SerializedChannel[]> {
    const channels = await Channel.all();
    return channels.map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
      creator_id: channel.creator_id,
    }));
  }

  public async create(name: string, type: ChannelType, user_id: number): Promise<SerializedChannel> {
    const channel = await Channel.create({ name, type, creator_id: user_id });

    return {
      id: channel.id,
      name: channel.name,
      type: channel.type,
      creator_id: channel.creator_id,
    };
  } catch (error) {
    console.error('Error creating channel:', error);
    throw new Error('Unable to create channel');
  }

  public async join(user_id: number, channel_id: number): Promise<SerializedChannel> {
    const user = await User.findOrFail(user_id);
    const channel = await Channel.findOrFail(channel_id);
    await user.related('channels').attach([channel_id])
    return {
      id: channel.id,
      name: channel.name,
      type: channel.type,
      creator_id: channel.creator_id
    }
  }
}
