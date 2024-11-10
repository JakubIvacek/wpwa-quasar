import {BaseModel, BelongsTo, belongsTo, column} from "@ioc:Adonis/Lucid/Orm";
import {DateTime} from "luxon";
import User from "App/Models/User";
import Channel from "App/Models/Channel";


export default class Invite extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public senderId: number;

  @column()
  public receiverId: number;

  @column()
  public channelId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User, {
    foreignKey: 'senderId',
  })
  public sender: BelongsTo<typeof User>;

  @belongsTo(() => User, {
    foreignKey: 'receiverId',
  })
  public receiver: BelongsTo<typeof User>;

  @belongsTo(() => Channel, {
    foreignKey: 'channelId',
  })
  public channel: BelongsTo<typeof Channel>;
}
