import { SerializedMessage } from "src/contracts"
import {SerializedChannel} from "src/contracts/Channel";

export interface ChannelsStateInterface {
  loading: boolean;
  error: Error | null;
  messages: { [channel: string]: SerializedMessage[] };
  userChannels: SerializedChannel[];
  active: string | null;
}

function state (): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    userChannels: [],
    active: null
  }
}

export default state
