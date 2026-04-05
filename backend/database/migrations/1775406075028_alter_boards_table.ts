import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'boards'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('workspace_id').unsigned().references('id').inTable('workspaces').onDelete('SET NULL').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('workspace_id')
    })
  }
}