import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { inject } from "@adonisjs/core/build/standalone";
import { InvitesRepositoryContract } from "@ioc:Repositories/InvitesRepository";
import Ws from "@ioc:Ruby184/Socket.IO/Ws";


@inject(["Repositories/InvitesRepository"])
export default class HTTPInvitesController {
  constructor(private invitesRepository: InvitesRepositoryContract) {}

  public async addInvite({ request, response }: HttpContextContract) {
    const { senderId, receiverName, channelName } = request.only(['senderId', 'receiverName', 'channelName']);

    if (!senderId || !receiverName || !channelName) {
      return response.status(400).json({ error: 'All fields are required' });
    }

    try {
      const invite = await this.invitesRepository.addInvite({senderId, receiverName, channelName});

      // Posleme invite do namespace receivera
      const namespace = Ws.io.of(`/invites/${receiverName}`);
      namespace.emit('invite', {
        id: invite.id,
        name: invite.name,
        type: invite.type,
        creator_id: invite.creator_id
      });

      return response.status(201).json(invite);
    } catch (error) {
      return response.status(500).json({ error: 'Unable to send invite' });
    }
  }
}
