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

    getUserChannels(userId: number): Promise<SerializedChannel[]>;
    leave (user_id: number, channel_id: number): void
    quit (user_id: number, channel_id: number): void
    revoke (user_name: string, channel_name: string): void
    create(
      name: string,
      channelType: ChannelType,
      creatorId: number
    ): Promise<SerializedChannel>;

    join(
      user_id: number,
      channel_id: number
    ): Promise<SerializedChannel>;
  }

  const ChannelRepository: ChannelRepositoryContract;
  export default ChannelRepository;
}

declare module "@ioc:Repositories/InvitesRepository" {
  import {SerializedChannel} from "@ioc:Repositories/ChannelRepository";

  export interface SerializedInvite {
    senderId: number;
    receiverName: string;
    channelName: string;
    channelId: number;
  }

  export interface InvitesRepositoryContract {
   loadInvites(userName: string): Promise<SerializedChannel[]>

    addInvite({senderId, receiverName, channelName}: {
      senderId: number;
      receiverName: string;
      channelName: string
    }): Promise<SerializedChannel>
  }

  const InvitesRepository: InvitesRepositoryContract;
  export default InvitesRepository;
}
