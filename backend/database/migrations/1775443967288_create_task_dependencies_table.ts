import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'task_dependencies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // task_id depends on (is blocked by) depends_on_id
      table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE')
      table.integer('depends_on_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE')
      table.unique(['task_id', 'depends_on_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}