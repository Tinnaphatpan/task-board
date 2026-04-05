import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'task_attachments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE')
      table.integer('uploaded_by').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()
      table.string('filename').notNullable()
      table.string('original_name').notNullable()
      table.string('mime_type').notNullable()
      table.integer('size').unsigned().notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}