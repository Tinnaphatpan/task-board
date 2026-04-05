import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subtasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE')
      table.string('title').notNullable()
      table.boolean('completed').defaultTo(false)
      table.integer('position').unsigned().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}