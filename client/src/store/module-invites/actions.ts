import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { InvitesStateInterface } from './state';
import InvitesService from "src/services/InvitesService";

const actions: ActionTree<InvitesStateInterface, StateInterface> = {
  async fetchInvites ({ commit }, userName: string) {
    try {
      const invites = await InvitesService.join(userName).loadInvites()
      commit("FETCH_SUCCESS", invites)
    } catch (err) {
      commit("LOADING_ERROR", err)
      throw err
    }
  }
};

export default actions;
