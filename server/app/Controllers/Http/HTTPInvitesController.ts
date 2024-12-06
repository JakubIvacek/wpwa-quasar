import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { inject } from "@adonisjs/core/build/standalone";
import { InvitesRepositoryContract } from "@ioc:Repositories/InvitesRepository";
import Ws from "@ioc:Ruby184/Socket.IO/Ws";


@inject(["Repositories/InvitesRepository"])
export default class HTTPInvitesController {
  constructor(private invitesRepository: InvitesRepositoryContract) {}

  public async addInvite({ request, response }: HttpContextContract):Promise<void> {
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
      if (error.code === '23505') {
        return response.status(400).json({ error: 'User is already invited' });
      } else if (error.message === 'You are not allowed to invite to private channel') {
        return response.status(403).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Unable to send invite' });
    }
  }

  public async acceptInvite({ request, response }: HttpContextContract) {
    const { receiverName, channelName } = request.only(['receiverName', 'channelName']);

    if (!receiverName || !channelName) {
      return response.status(400).json({ error: 'All fields are required' });
    }

    try {
      await this.invitesRepository.acceptInvite({receiverName, channelName});

      return response.status(200).json({ message: 'Invite accepted' });
    }catch (error) {
      return response.status(500).json({ error: 'Unable to accept invite' });
    }
  }

  public async declineInvite({ request, response }: HttpContextContract) {
    const { receiverName, channelName } = request.only(['receiverName', 'channelName']);

    if (!receiverName || !channelName) {
      return response.status(400).json({ error: 'All fields are required' });
    }

    try {
      await this.invitesRepository.declineInvite({receiverName, channelName});

      return response.status(200).json({ message: 'Invite declined' });
    }catch (error) {
      return response.status(500).json({ error: 'Unable to decline invite' });
    }
  }
}
