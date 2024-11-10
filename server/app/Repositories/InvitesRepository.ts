import type { InvitesRepositoryContract } from "@ioc:Repositories/InvitesRepository"
import {SerializedChannel} from "@ioc:Repositories/ChannelRepository";
import Invite from "App/Models/Invite";
import User from "App/Models/User";
import Channel from "App/Models/Channel";


export default class InvitesRepository implements InvitesRepositoryContract {

  public async loadInvites(userName: string): Promise<SerializedChannel[]> {
    try {
      const user = await User.findByOrFail('email', userName);

      const invites = await Invite.query()
        .where('receiver_id', user.id)
        .preload('channel');

      return invites.map(invite => invite.channel);
    } catch (error) {
      console.error('Error fetching invited channels:', error);
      throw error;
    }
  }

  public async addInvite({senderId, receiverName, channelId}: {
    senderId: number;
    receiverName: string;
    channelId: number
  }): Promise<SerializedChannel> {
    try {
      const receiver = await User.findByOrFail('email', receiverName);// TODO zmenit na nickname
      const channel = await Channel.findOrFail(channelId);

      await Invite.create({
        senderId: senderId,
        receiverId: receiver.id,
        channelId: channelId,
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
