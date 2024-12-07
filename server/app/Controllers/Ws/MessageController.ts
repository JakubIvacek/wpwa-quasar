import type { WsContextContract } from "@ioc:Ruby184/Socket.IO/WsContext";
import type { MessageRepositoryContract } from "@ioc:Repositories/MessageRepository";
import { inject } from "@adonisjs/core/build/standalone";

// inject repository from container to controller constructor
// we do so because we can extract database specific storage to another class
// and also to prevent big controller methods doing everything
// controler method just gets data (validates it) and calls repository
// also we can then test standalone repository without controller
// implementation is bind into container inside providers/AppProvider.ts
@inject(["Repositories/MessageRepository"])
export default class MessageController {
  constructor(private messageRepository: MessageRepositoryContract) {}

  public async loadMessages({ params }: WsContextContract) {
    return this.messageRepository.getAll(params.name);
  }
  public async fetchMessages({ params }: WsContextContract, name: string, page: number) {
    return this.messageRepository.fetchMessages(name, page)
  }

  public async addMessage(
    { params, socket, auth }: WsContextContract,
    content: string, addressedTo: string
  ) {
    //console.log(addressedTo)
    const message = await this.messageRepository.create(
      params.name,
      auth.user!.id,
      content,
      addressedTo
    );
    // broadcast message to other users in channel
    socket.broadcast.emit("message", message);
    // return message to sender
    return message;
  }
}
