import { WsContextContract } from "@ioc:Ruby184/Socket.IO/WsContext";
import { inject } from "@adonisjs/core/build/standalone";
import { InvitesRepositoryContract } from "@ioc:Repositories/InvitesRepository";


@inject(["Repositories/InvitesRepository"])
export default class InvitesController {
  constructor(private invitesRepository: InvitesRepositoryContract) {}

  public async loadInvites({ params }: WsContextContract) {
    return this.invitesRepository.loadInvites(params.name);
  }

}
