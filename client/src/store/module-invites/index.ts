import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { InvitesStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const inviteModule: Module<InvitesStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default inviteModule;
