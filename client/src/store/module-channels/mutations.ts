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
  DELETE_MESSAGE (state, { channel }) {
    // Check if the channel exists in the state
    // print("deleting store")
    if (state.messages[channel]) {
      // Filter out messages that have send="unsend"
      state.messages[channel] = state.messages[channel].filter(
        (message) => message.send !== 'unsend'
      )
    }
  },
  UPDATE_MESSAGE (state, { channel, userId, content }: {channel:string, userId: number, content: string}) {
    // Check if the channel exists in the state
    if (state.messages[channel]) {
      // Find the message by the user ID (this assumes 'message.created_by' is the userId)
      const message = state.messages[channel].find(
        (msg) => msg.created_by === userId && msg.send === 'unsend'
      );
      console.log(content)
      // If message is found, update its content
      if (message) {
        message.content = content;  // Update message content
      }
    }
  },

  ADD_CHANNEL (state, channel: SerializedChannel) {
    console.log('ADD_CHANNEL', channel)
    state.userChannels.push(channel)
  }
}

export default mutation
