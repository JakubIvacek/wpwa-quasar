import {SerializedChannel} from "src/contracts/Channel";

export interface InvitesStateInterface {
  invites: SerializedChannel[];
}

function state(): InvitesStateInterface {
  return {
    invites: [],
  };
}

export default state;
