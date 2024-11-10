import Channel from 'App/Models/Channel'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {ChannelRepositoryContract, SerializedChannel} from "@ioc:Repositories/ChannelRepository";
import {inject} from "@adonisjs/core/build/standalone";
import {ChannelType} from "App/Enums/ChannelType";
import User from "App/Models/User";

@inject(["Repositories/ChannelRepository"])
export default class ChannelController {
  constructor(private channelRepository: ChannelRepositoryContract) {}

  async create({ request, response }: HttpContextContract) {
    // Log the body to see how the data is being sent
    //console.log(request.body());

    // Extract the values directly from the request
    const { name, creator_id, type } = request.only(['name', 'creator_id', 'type']);

    // Ensure name is a string
    if (typeof name !== 'string') {
      return response.status(400).json({ error: 'Channel name must be a string' });
    }

    // Validate the 'type' field, it must be either 'public' or 'private'
    const validTypes = ['public', 'private'];
    if (!validTypes.includes(type)) {
      return response.status(400).json({ error: 'Channel type must be "public" or "private"' });
    }

    // Ensure creator_id is present
    if (!creator_id) {
      return response.status(400).json({ error: 'User ID is required' });
    }

    // Trim the channel name to remove extra spaces
    const trimmedName = name.trim();

    if (!trimmedName) {
      return response.status(400).json({ error: 'Channel name is required' });
    }

    // Determine the channel type (enum or plain string)
    const channelType: ChannelType = type === 'private' ? ChannelType.PRIVATE : ChannelType.PUBLIC;

    try {
      // Check if a channel with this name already exists
      const existingChannel = await Channel.findBy('name', trimmedName);
      if (existingChannel) {
        return response.status(400).json({ error: 'Channel with this name already exists' });
      }

      // Create and save the new channel to the database
      const channel = await this.channelRepository.create(trimmedName, channelType, creator_id);
      const user = await User.findByOrFail('id', creator_id);
      await user.related('channels').attach([channel.id]);
      // Respond with the created channel
      return response.status(201).json(channel);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Unable to create channel' });
    }
  }


  // The join method is used to add a user to a channel
  async join({ request, response }: HttpContextContract) {
    const { name, user_id} = request.only(['name', 'user_id']);
    const typeInput = request.input('type');
    const type: ChannelType = typeInput === 'private' ? ChannelType.PRIVATE : ChannelType.PUBLIC;

    if (!name || name.trim() === '') {
      return response.status(400).json({ error: 'Channel name is required' });
    }

    if (!user_id) {
      return response.status(400).json({ error: 'User ID is required' });
    }

   let channel :  Channel | SerializedChannel | null = await Channel.findBy('name', name);
    if (channel) {
      if (channel.type === 'private') {
        return response.status(403).json({ error: 'You cannot join private channel' });
      }
    }else {
      try {
        channel = await this.channelRepository.create(name, type, user_id);
      }catch (error) {
        return response.status(500).json({ error: 'Unable to create channel' });
      }
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


  async leave ({ request, response }: HttpContextContract) {
    const { name, user_id} = request.only(['name', 'user_id']);
    //console.log("2: " + name, user_id)
    if (!name || name.trim() === '') {
      return response.status(400).json({ error: 'Channel name is required' });
    }

    if (!user_id) {
      return response.status(400).json({ error: 'User ID is required' });
    }

    let channel :  Channel | SerializedChannel | null = await Channel.findBy('name', name);
    if (channel) {
      this.channelRepository.leave(user_id, channel.id)
      return response.status(200).json({ error: "Channel left successfully " });
    } else {
      return response.status(400).json({ error: 'Channel with this name not found' });
    }
  }
  async quit ({ request, response }: HttpContextContract) {
    const { name, user_id} = request.only(['name', 'user_id']);
    //console.log("2: " + name, user_id)
    if (!name || name.trim() === '') {
      return response.status(400).json({ error: 'Channel name is required' });
    }

    if (!user_id) {
      return response.status(400).json({ error: 'User ID is required' });
    }

    let channel :  Channel | SerializedChannel | null = await Channel.findBy('name', name);
    if (channel && channel.creator_id == user_id) {
      this.channelRepository.quit(user_id, channel.id)
      return response.status(200).json({ error: "Channel left successfully " });
    } else {
      return response.status(400).json({ error: 'Channel with this name not found or not creator' });
    }
  }

  async revoke ({ request, response }: HttpContextContract) {
    const { user_name, channel_name, active_user_id} = request.only(['user_name', 'channel_name', 'active_user_id']);

    if (!user_name || user_name.trim() === '') {
      return response.status(400).json({ error: 'User name is required' });
    }
    if (!channel_name || channel_name.trim() === '') {
      return response.status(400).json({ error: 'Channel name is required' });
    }
    if (!active_user_id) {
      return response.status(400).json({ error: 'Active User ID is required' });
    }

    let channel :  Channel | SerializedChannel | null = await Channel.findBy('name', channel_name);
    let active_user : User | null = await User.findBy('id', active_user_id);
    let revoked_user : User | null = await User.findBy('nickname', user_name);
    if (!channel) {
      return response.status(400).json({ error: 'Channel not found' });
    }
    if (!active_user) {
      return response.status(400).json({ error: 'Active user not found' });
    }
    if (!revoked_user) {
      return response.status(400).json({ error: 'Revoked user not found' });
    }

    if (
      channel.creator_id === active_user.id && channel.type === ChannelType.PRIVATE
    ) {
      this.channelRepository.revoke(user_name, channel_name)
      return response.status(200).json({ message: "User revoked successfully" });
    } else {
      return response.status(400).json({ error: "Unable to revoke user." });
    }
  }

  async getUserChannels({ params, response }: HttpContextContract) {
    const { id } = params;
    if (!id) {
      return response.status(400).json({ error: 'User ID is required' });
    }

    try {
      const channels = await this.channelRepository.getUserChannels(id);
      return response.status(200).json({channels: channels});
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({ error: 'User not found' });
      }
      console.error('Error fetching channels for user:', error);
      return response.status(500).json({ error: 'Unable to fetch channels for the user' });
    }
  }

  async getAll({ response }: HttpContextContract) {
    const channels = await this.channelRepository.getAll();
    return response.status(200).json({channels: channels});
  }
}
