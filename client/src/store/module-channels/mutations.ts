import { SerializedMessage } from "src/contracts"
import { MutationTree } from "vuex"
import { ChannelsStateInterface } from "./state"
import {SerializedChannel} from "src/contracts/Channel";

const mutation: MutationTree<ChannelsStateInterface> = {
  LOADING_START (state) {
    state.loading = true
    state.error = null
  },
  LOADING_SUCCESS (
    state,
    { channel, messages }: { channel: string; messages: SerializedMessage[] }
  ) {
    state.loading = false
    state.messages[channel] = messages
  },
  LOADING_ERROR (state, error) {
    state.loading = false
    state.error = error
  },
  CLEAR_CHANNEL (state, channel) {
    state.active = null
    delete state.messages[channel]
  },
  SET_ACTIVE (state, channel: string) {
    state.active = channel
  },
  NEW_MESSAGE (state, { channel, message }: { channel: string; message: SerializedMessage }) {
    // Check if the channel exists in messages; if not, initialize it as an empty array
    if (!state.messages[channel]) {
      state.messages[channel] = []
    }

    // Now you can safely push the new message
    state.messages[channel].push(message)
  },
  ADD_CHANNEL (state, channel: SerializedChannel) {
    console.log('ADD_CHANNEL', channel)
    state.userChannels.push(channel)
  }
}

export default mutation
