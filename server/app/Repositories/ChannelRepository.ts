import Channel from "App/Models/Channel";
import {ChannelRepositoryContract, SerializedChannel} from "@ioc:Repositories/ChannelRepository";

export default class ChannelRepository implements ChannelRepositoryContract {
  public async getAll(channelName: string): Promise<SerializedChannel[]> {

  }

  public async create(){
  }
}
