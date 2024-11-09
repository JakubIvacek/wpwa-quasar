import { ActionTree } from "vuex"
import { StateInterface } from "../index"
import { ChannelsStateInterface } from "./state"
import { channelService } from "src/services"
import { RawMessage } from "src/contracts"
import {CreateChannel, SerializedChannel} from "src/contracts/Channel"

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
  },
  async addMessage (
    { commit },
    { channel, message }: { channel: string; message: RawMessage }
  ) {
    const newMessage = await channelService.in(channel)?.addMessage(message)
    commit("NEW_MESSAGE", { channel, message: newMessage })
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
  }
}

export default actions
