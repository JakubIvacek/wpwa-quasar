import type {
  MessageRepositoryContract,
  SerializedMessage,
} from "@ioc:Repositories/MessageRepository"
import Channel from "App/Models/Channel";
import User from "App/Models/User";
import Message from "App/Models/Message";

export default class MessageRepository implements MessageRepositoryContract {
  public async getAll(channelName: string): Promise<SerializedMessage[]> {
    const channel = await Channel.query()
      .where("name", channelName)
      .preload("messages", (messagesQuery) => messagesQuery.preload("author"))
      .firstOrFail();
    return channel.messages.map(
      (message) => message.serialize() as SerializedMessage
    );
  }
  public async fetchMessages(channelName: string, page: number): Promise<SerializedMessage[]> {
    // First, fetch the channel without preloading messages
    const channel = await Channel.query().where('name', channelName).firstOrFail();

    // Then, paginate the messages for the channel separately
    const messages = await Message.query()
      .where('channel_id', channel.id) // Filter messages by channel ID
      .preload('author') // Preload the author of each message
      .paginate(page, 10); // Paginate the messages

    // Return the serialized messages
    return messages.toJSON().data.map(
      (message) => message as SerializedMessage
    );
  }

  public async create(
    channelName: string,
    userId: number,
    content: string,
    addressedTo: string
  ): Promise<SerializedMessage> {
    console.log(addressedTo)
    const channel = await Channel.findByOrFail("name", channelName);
    const userAddressed = await User.findBy('nickname', addressedTo);
    if(userAddressed){
      const message = await channel
        .related("messages")
        .create({ createdBy: userId, addressedTo: userAddressed.id, content });
      await message.load("author");
      return message.serialize() as SerializedMessage;
    }else{
      const message = await channel
        .related("messages")
        .create({ createdBy: userId, content });
      await message.load("author");
      return message.serialize() as SerializedMessage;
    }
  }
  public async createUnSend(
    channelName: string,
    userId: number,
    content: string,
  ): Promise<SerializedMessage> {
    const channel = await Channel.findByOrFail("name", channelName);
    const message = await channel
      .related("messages")
      .create({ createdBy: userId, content, send: "unsend" });
    await message.load("author");
    return message.serialize() as SerializedMessage;
  }
  public async updateUnSend(
    channelName: string,
    userId: number,
    content: string,
  ): Promise<SerializedMessage> {
    const channel = await Channel.findByOrFail("name", channelName);

    const message = await channel
      .related("messages")
      .query()
      .where("created_by", userId)
      .where("send", "unsend")
      .first();

    if (!message) {
      throw new Error("No unsent message found for the user in this channel");
    }
    message.content = content
    return message.serialize() as SerializedMessage;
  }
  public async deleteUnSend(
    channelName: string,
    userId: number
  ): Promise<{ success: boolean; message?: string }> {
    // Find the channel by its name
    const channel = await Channel.findByOrFail("name", channelName);

    // Retrieve all unsent messages for the specified user in this channel
    const unsentMessages = await channel
      .related("messages")
      .query()
      .where("created_by", userId)
      .where("send", "unsend");

    // If no unsent messages found, return a message
    if (unsentMessages.length === 0) {
      throw new Error("No unsent messages found for the user in this channel");
    }

    // Delete all unsent messages
    await channel
      .related("messages")
      .query()
      .where("created_by", userId)
      .where("send", "unsend")
      .delete();

    // Return success response
    return { success: true, message: "All unsent messages deleted successfully" };
  }
}
