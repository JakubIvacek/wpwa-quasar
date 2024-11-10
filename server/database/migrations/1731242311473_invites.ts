import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'invites'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sender_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('receiver_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('channel_id').unsigned().notNullable().references('id').inTable('channels').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
