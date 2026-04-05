import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('column_id').unsigned().references('id').inTable('columns').onDelete('CASCADE')
      table.integer('assignee_id').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()
      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('description').nullable()
      table.enu('priority', ['low', 'medium', 'high']).defaultTo('medium')
      table.date('due_date').nullable()
      table.integer('position').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}