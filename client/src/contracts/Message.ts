import { User } from './Auth'

export type RawMessage = string;

export interface SerializedMessage {
  createdBy: number;
  content: string;
  send: string;
  channelId: number;
  addressedTo: number;
  createdAt: string;
  updatedAt: string;
  id: number;
  author: User;
}
