import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { InvitesStateInterface } from './state';

const getters: GetterTree<InvitesStateInterface, StateInterface> = {
  getInvites (context) {
    return context.invites
  }
};

export default getters;
