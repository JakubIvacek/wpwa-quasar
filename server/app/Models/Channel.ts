import { DateTime } from "luxon";
import {BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany} from "@ioc:Adonis/Lucid/Orm";
import Message from "App/Models/Message";
import { ChannelType } from 'App/Enums/ChannelType'
import User from "App/Models/User";
import Invite from "App/Models/Invite";
import Kick from "App/Models/Kick";

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string;

  @column()
  public creator_id: number

  @column()
  public type: ChannelType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Message, {
    foreignKey: "channelId",
  })
  public messages: HasMany<typeof Message>;

  @manyToMany(() => User, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,
  })
  public users: ManyToMany<typeof User>;

  @hasMany(() => Invite, {
    foreignKey: 'channelId',
  })
  public invites: HasMany<typeof Invite>;
  @hasMany(() => Kick, {
    foreignKey: 'channelId',
  })
  public kicks: HasMany<typeof Kick>;
}
