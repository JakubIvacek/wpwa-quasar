import Channel from 'App/Models/Channel'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {ChannelRepositoryContract} from "@ioc:Repositories/ChannelRepository";
import {inject} from "@adonisjs/core/build/standalone";
import {ChannelType} from "App/Enums/ChannelType";

@inject(["Repositories/ChannelRepository"])
export default class ChannelController {
  constructor(private channelRepository: ChannelRepositoryContract) {}

  async create({ request, response }: HttpContextContract) {
    const { name, user_id } = request.only(['name', 'user_id']);
    const typeInput = request.input('type');
    const type: ChannelType = typeInput === 'private' ? ChannelType.PRIVATE : ChannelType.PUBLIC;

    if (!name || name.trim() === '') {
      return response.status(400).json({ error: 'Channel name is required' });
    }

    if (!user_id) {
      return response.status(400).json({ error: 'User ID is required' });
    }

    try {
      const existingChannel = await Channel.findBy('name', name);
      if (existingChannel) {
        return response.status(400).json({ error: 'Channel with this name already exists' });
      }

      // Vytvorenie a uloženie nového kanála do databázy
      const channel = await this.channelRepository.create(name, type, user_id);

      // Odpoveď s vytvoreným kanálom
      return response.status(201).json(channel);
    } catch (error) {
      return response.status(500).json({ error: 'Unable to create channel' });
    }
  }


  async join({ request, response }: HttpContextContract) {
    const { name, user_id } = request.only(['name', 'user_id']);

    const typeInput = request.input('type');
    const type: ChannelType = typeInput === 'private' ? ChannelType.PRIVATE : ChannelType.PUBLIC;

    if (!name || name.trim() === '') {
      return response.status(400).json({ error: 'Channel name is required' });
    }

    if (!user_id) {
      return response.status(400).json({ error: 'User ID is required' });
    }

   const channel = await Channel.findBy('name', name);
    if (!channel) {
      try {
        const newChannel = await this.channelRepository.create(name, type, user_id);
        return response.status(201).json(newChannel);
      }catch (error) {
        return response.status(500).json({ error: 'Unable to create channel' });
      }
    }else{
      if (channel.type === 'private') {
        return response.status(403).json({ error: 'You cannot join private channel' });
      }

      try {
        const serializedChannel = await this.channelRepository.join(user_id, channel.id);
        return response.status(200).json({ channel: serializedChannel });
      } catch (error) {
        if (error.code === '23505') {
          return response.status(400).json({ error: 'User is already a member of this channel' });
        }
        return response.status(500).json({ error: 'Unable to join channel' })
      }
    }
  }

  async getAll({ response }: HttpContextContract) {
    const channels = await this.channelRepository.getAll();
    return response.status(200).json(channels);
  }
}
