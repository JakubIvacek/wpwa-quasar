import type { InvitesRepositoryContract } from "@ioc:Repositories/InvitesRepository"
import {SerializedChannel} from "@ioc:Repositories/ChannelRepository";
import Invite from "App/Models/Invite";
import User from "App/Models/User";
import Channel from "App/Models/Channel";


export default class InvitesRepository implements InvitesRepositoryContract {

  public async loadInvites(userName: string): Promise<SerializedChannel[]> {
    try {
      const user = await User.findByOrFail('nickname', userName);

      const invites = await Invite.query()
        .where('receiver_id', user.id)
        .preload('channel');

      return invites.map(invite => invite.channel);
    } catch (error) {
      console.error('Error fetching invited channels:', error);
      throw error;
    }
  }

  public async addInvite({senderId, receiverName, channelName}: {
    senderId: number;
    receiverName: string;
    channelName: string
  }): Promise<SerializedChannel> {
    try {
      const receiver = await User.findByOrFail('nickname', receiverName);
      const channel = await Channel.findByOrFail('name', channelName);

      await Invite.create({
        senderId: senderId,
        receiverId: receiver.id,
        channelId: channel.id,
      });

      return {
        id: channel.id,
        name: channel.name,
        type: channel.type,
        creator_id: channel.creator_id
      } as SerializedChannel;
    } catch (error) {
      console.error('Error creating invite:', error);
      throw error;
    }
  }
}
