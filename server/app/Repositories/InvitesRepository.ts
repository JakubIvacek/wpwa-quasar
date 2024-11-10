import type {InvitesRepositoryContract,} from "@ioc:Repositories/InvitesRepository"
import {SerializedChannel} from "@ioc:Repositories/ChannelRepository";
import Invite from "App/Models/Invite";
import User from "App/Models/User";


export default class InvitesRepository implements InvitesRepositoryContract {
  public async loadInvites(userEmail: string): Promise<SerializedChannel[]> {
    try {
      const user = await User.findByOrFail('email', userEmail);

      const invites = await Invite.query()
        .where('receiver_id', user.id)
        .preload('channel');

      return invites.map(invite => invite.channel);
    } catch (error) {
      console.error('Error fetching invited channels:', error);
      throw error;
    }
  }
}
