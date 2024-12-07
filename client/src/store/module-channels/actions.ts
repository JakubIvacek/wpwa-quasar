import { ActionTree } from "vuex"
import { StateInterface } from "../index"
import { ChannelsStateInterface } from "./state"
import { channelService } from "src/services"
import { RawMessage } from "src/contracts"
import {CreateChannel, JoinChannel, RevokeUser, SerializedChannel} from "src/contracts/Channel"
import InvitesService from "src/services/InvitesService";
import {ChannelUser} from "src/contracts/ChannelUser";

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  async join ({ commit }, channel: string) {
    try {
      commit("LOADING_START")
      const messages = await channelService.join(channel).loadMessages()
      commit("LOADING_SUCCESS", { channel, messages })
    } catch (err) {
      commit("LOADING_ERROR", err)
      throw err
    }
  },
  async leave ({ getters, commit }, channel: string | null) {
    const leaving: string[] =
      channel !== null ? [channel] : getters.joinedChannels

    leaving.forEach((c) => {
      channelService.leave(c)
      commit("CLEAR_CHANNEL", c)
    })
    InvitesService.leave()
  },
  async addMessage (
    { commit },
    { channel, message, addressedTo }: { channel: string; message: RawMessage; addressedTo: string }
  ) {
    const newMessage = await channelService.in(channel)?.addMessage(message, addressedTo)
    commit("NEW_MESSAGE", { channel, message: newMessage })
  },
  async fetchMessages ({ commit }, { channel, page }: { channel: string, page: number }) {
    const newMessage = await channelService.in(channel)?.fetchMessages(channel, page)
    console.log(newMessage) // Check the response
    console.log("wtf")
    // Optionally commit the result to the store if needed
    // commit('setMessages', newMessage);
    return newMessage;
  },
  async addChannel ({ commit }, newChannel: CreateChannel) {
    try {
      // Send the data as a flatter structure
      await channelService.createChannel(newChannel)
    } catch (error) {
      console.error("Failed to create channel:", error)
      throw error
    }
  },
  async getChannels ({ commit }, id: number): Promise<SerializedChannel[]> {
    try {
      return await channelService.getUserChannels(id)
    } catch (error) {
      console.error("Failed get User channels:", error)
      throw error
    }
  },
  async joinChannel ({ commit }, data: CreateChannel) {
    try {
      return await channelService.joinChannel(data)
    } catch (error) {
      console.error("Failed join channel:", error)
      throw error
    }
  },
  async leaveChannel ({ commit }, data: JoinChannel) {
    try {
      // console.log(data)
      return await channelService.leaveChannel(data)
    } catch (error) {
      console.error("Failed leave channel:", error)
      throw error
    }
  },
  async revokeUser ({ commit }, data: RevokeUser) {
    try {
      // console.log(data)
      return await channelService.revokeUser(data)
    } catch (error) {
      console.error("Failed to revoke user :", error)
      throw error
    }
  },
  async kickUser ({ commit }, data: RevokeUser) {
    try {
      // console.log(data)
      return await channelService.kickUser(data)
    } catch (error) {
      console.error("Failed to kick user :", error)
      throw error
    }
  },
  async quitChannel ({ commit }, data: JoinChannel) {
    try {
      // console.log(data)
      return await channelService.quitChannel(data)
    } catch (error) {
      console.error("Failed leave channel:", error)
      throw error
    }
  },
  async getChannelUsers ({ commit }, name: string): Promise<ChannelUser[]> {
    try {
      return await channelService.getChannelUsers(name)
    } catch (error) {
      console.error("Failed get channel users:", error)
      throw error
    }
  }
}

export default actions
