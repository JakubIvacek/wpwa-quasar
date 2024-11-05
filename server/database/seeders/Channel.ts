import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Channel from "App/Models/Channel";
import User from "App/Models/User";
import {ChannelType} from 'App/Enums/ChannelType'
import {UserStatus} from "App/Enums/UserStatus";

export default class ChannelSeeder extends BaseSeeder {
  public async run() {
   // const uniqueKey = "name";

    const user = await User.firstOrCreate({
      email: 'example@example.com',
    }, {
      first_name: 'Example',
      last_name: 'User',
      nickname: "xddd",
      status: UserStatus.ONLINE,
      email: 'example@example.com',
      password: 'password123', // or a hashed password if necessary
    })

    // Now create channels with the `creator_id` referencing this user
    await Channel.createMany([
      {
        name: 'General',
        type: ChannelType.PUBLIC,
        creator_id: user.id,  // Reference the user ID here
      },
      {
        name: 'Announcements',
        type: ChannelType.PUBLIC,
        creator_id: user.id,
      },
      // Add more channels as needed
    ]);
  }
}
