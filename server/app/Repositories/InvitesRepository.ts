import type { InvitesRepositoryContract } from "@ioc:Repositories/InvitesRepository"
import {SerializedChannel} from "@ioc:Repositories/ChannelRepository";
import Invite from "App/Models/Invite";
import User from "App/Models/User";
import Channel from "App/Models/Channel";
import Kick from "App/Models/Kick";


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
      let kicked_by_creator: Kick| null = await Kick.query().
      where('kickedId', receiver.id).
      where('channelId', channel.id).where('userId', channel.creator_id).first()
      let kicks: Kick[] | Kick | null = await Kick.query().
      where('kickedId', receiver.id).
      where('channelId', channel.id)
      if(kicked_by_creator && senderId != channel.creator_id) {
        console.log('Banned by creator');
        throw new Error("banned by creator")
      }else if (kicks && kicks.length >= 3 && senderId != channel.creator_id) {
        console.log('Kicked by users');
        throw new Error("banned by users")
      }else{
        await Invite.create({
          senderId: senderId,
          receiverId: receiver.id,
          channelId: channel.id,
        });
      }
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

  public async acceptInvite({receiverName, channelName}: {
    receiverName: string;
    channelName: string
  }): Promise<void> {
    try {
      const receiver = await User.findByOrFail('nickname', receiverName);
      const channel = await Channel.findByOrFail('name', channelName);

      // Delete invite from Invite table
      await Invite.query()
        .where('receiver_id', receiver.id)
        .where('channel_id', channel.id)
        .delete();

      // Add user to channel
      await channel.related('users').attach([receiver.id]);

    } catch (error) {
      console.error('Error accepting invite:', error);
      throw error;
    }
  }

  public async declineInvite({receiverName, channelName}: {
    receiverName: string;
    channelName: string
  }): Promise<void> {
    try {
      const receiver = await User.findByOrFail('nickname', receiverName);
      const channel = await Channel.findByOrFail('name', channelName);

      // Delete invite from Invite table
      await Invite.query()
        .where('receiver_id', receiver.id)
        .where('channel_id', channel.id)
        .delete();

    } catch (error) {
      console.error('Error declining invite:', error);
      throw error;
    }
  }
}
