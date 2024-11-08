import Channel from 'App/Models/Channel'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class ChannelController {
  async create({ request, response }: HttpContextContract) {
    const { name, user_id } = request.only(['name', 'user_id']);
    let type = request.input('type', 'public'); // Ak nie je uvedený `type`, nastaví sa na "public"


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
      const channel = new Channel();
      channel.name = name;
      channel.type = type;
      channel.creator_id = user_id;
      await channel.save();

      // Odpoveď s vytvoreným kanálom
      return response.status(201).json(channel);
    } catch (error) {
      return response.status(500).json({ error: 'Unable to create channel' });
    }
  }


  async join({ request, response }: HttpContextContract) {
    const { name, user_id } = request.only(['name', 'user_id']);

    if (!name || name.trim() === '') {
      return response.status(400).json({ error: 'Channel name is required' });
    }

    if (!user_id) {
      return response.status(400).json({ error: 'User ID is required' });
    }

   const channel = await Channel.findBy('name', name);
    // Zavolame create
    if (!channel) {
      return response.status(404).json({ error: 'Channel not found' });
    }

    if (channel.type === 'private') {
      return response.status(403).json({ error: 'You cannot join private channel' });
    }

    try {
      const user = await User.findOrFail(user_id);
      console.log(user)
      await user.related('channels').attach([channel.id])

      return response.status(200).json({ message: 'User successfully joined the channel', channel });
    } catch (error) {
      return response.status(500).json({ error: 'Unable to join channel' });
    }
  }


  async getAll({ response }: HttpContextContract) {
    const channels = await Channel.all();

    return response.status(200).json({ data: channels });
  }
}
