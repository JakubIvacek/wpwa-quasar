import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { InvitesStateInterface } from './state';
import InvitesService from "src/services/InvitesService";
import {SerializedChannel} from "src/contracts/Channel";

const actions: ActionTree<InvitesStateInterface, StateInterface> = {
  async fetchInvites ({ commit }, userName: string) {
    try {
      const invites = await InvitesService.join(userName).loadInvites()
      commit("FETCH_SUCCESS", invites)
    } catch (err) {
      commit("LOADING_ERROR", err)
      throw err
    }
  },
  async sendInvite(
    { commit },
    { senderId, receiverName, channelName }: { senderId: number; receiverName: string; channelName: string }
  ) {
    try {
      await InvitesService.sendInvite(senderId, receiverName, channelName)
    } catch (error) {
      console.error("Failed to send invite:", error)
      throw error
    }
  },
  async acceptInvite(
    { commit },
    { invite, userName }: { invite: SerializedChannel, userName: string }
  ) {
    try {
      await InvitesService.acceptInvite(userName, invite.name)

      commit("DELETE_INVITE", invite)
      commit("channels/ADD_CHANNEL", invite, { root: true });
    } catch (error) {
      console.error("Failed to accept invite:", error)
      throw error
    }
  }
};

export default actions;
