import type {InvitesRepositoryContract, SerializedInvite,} from "@ioc:Repositories/InvitesRepository"
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
  }): Promise<SerializedInvite> {
    try {
      const receiver = await User.findByOrFail('email', receiverName);
      const channel = await Channel.findOrFail(channelId);

      const invite = await Invite.create({
        senderId: senderId,
        receiverId: receiver.id,
        channelId: channelId,
      });

      return {
        senderId: invite.senderId,
        receiverName: receiver.email,// TODO zmenit na nickname
        channelName: channel.name,
        channelId: invite.channelId,
      } as SerializedInvite;
    } catch (error) {
      console.error('Error creating invite:', error);
      throw error;
    }
  }
}
