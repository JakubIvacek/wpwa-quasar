import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { WsContextContract } from "@ioc:Ruby184/Socket.IO/WsContext";
import { inject } from "@adonisjs/core/build/standalone";
import { InvitesRepositoryContract } from "@ioc:Repositories/InvitesRepository";
import Ws from "@ioc:Ruby184/Socket.IO/Ws";


@inject(["Repositories/InvitesRepository"])
export default class InvitesController {
  constructor(private invitesRepository: InvitesRepositoryContract) {}

  public async loadInvites({ params }: WsContextContract) {
    return this.invitesRepository.loadInvites(params.name);
  }

  public async addInvite({ request, response }: HttpContextContract) {
    const { senderId, receiverName, channelId } = request.only(['senderId', 'receiverName', 'channelId']);

    if (!senderId || !receiverName || !channelId) {
      return response.status(400).json({ error: 'All fields are required' });
    }

    try {
      const invite = await this.invitesRepository.addInvite({senderId, receiverName, channelId});

      // Posleme invite do namespace receivera
      const namespace = Ws.io.of(`/invites/${receiverName}`);
      namespace.emit('invite', {
          senderId: invite.senderId,
          receiverName: invite.receiverName,
          channelId: invite.channelId,
          name: invite.channelName
      });

      return response.status(201).json(invite);
    } catch (error) {
      return response.status(500).json({ error: 'Unable to send invite' });
    }
  }
}
