import { MutationTree } from 'vuex';
import { InvitesStateInterface} from './state';
import {SerializedChannel} from "src/contracts/Channel";

const mutation: MutationTree<InvitesStateInterface> = {
  FETCH_SUCCESS (state, invites: SerializedChannel[]) {
    state.invites = invites
  },
  NEW_INVITE (state, channel: SerializedChannel) {
    state.invites.push(channel)
  }
};

export default mutation;
