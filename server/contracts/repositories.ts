// here we are declaring our MessageRepository types for Repositories/MessageRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
declare module "@ioc:Repositories/MessageRepository" {
  export interface SerializedMessage {
    createdBy: number;
    content: string;
    channelId: number;
    createdAt: string;
    updatedAt: string;
    id: number;
    author: {
      id: number;
      email: string;
      createdAt: string;
      updatedAt: string;
    };
  }

  export interface MessageRepositoryContract {
    getAll(channelName: string): Promise<SerializedMessage[]>;
    create(
      channelName: string,
      userId: number,
      content: string
    ): Promise<SerializedMessage>;
  }

  const MessageRepository: MessageRepositoryContract;
  export default MessageRepository;
}

declare module "@ioc:Repositories/ChannelRepository" {
  import {ChannelType} from "App/Enums/ChannelType";

  export interface SerializedChannel {
    id: number;
    name: string;
    type: string;
    creator_id: number;
  }

  export interface ChannelRepositoryContract {
    getAll(): Promise<SerializedChannel[]>;

    create(
      name: string,
      type: ChannelType,
      user_id: number
    ): Promise<SerializedChannel>;

    join(
      user_id: number,
      channel_id: number
    ): Promise<SerializedChannel>;
  }

  const ChannelRepository: ChannelRepositoryContract;
  export default ChannelRepository;
}
