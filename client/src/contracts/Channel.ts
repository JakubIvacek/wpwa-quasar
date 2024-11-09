
export type RawMessage = string;

export interface SerializedChannel {
  id: number;
  name: string;
  type: string;
  creator_id: number;
}

export interface CreateChannel {
  name: string;
  type: string;
  creator_id: number;
}
