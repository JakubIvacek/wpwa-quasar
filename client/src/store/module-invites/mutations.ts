import { MutationTree } from 'vuex';
import { InvitesStateInterface} from './state';
import {SerializedChannel} from "src/contracts/Channel";

const mutation: MutationTree<InvitesStateInterface> = {
  FETCH_SUCCESS (state, invites: SerializedChannel[]) {
    state.invites = invites
  },
  NEW_INVITE (state, channel: SerializedChannel) {
    state.invites.push(channel)
  },
  DELETE_INVITE (state, invite: SerializedChannel) {
    state.invites = state.invites.filter((i) => i.name !== invite.name)
  }
};

export default mutation;
