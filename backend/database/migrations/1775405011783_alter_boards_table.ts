import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'board_members'

  async up() {
    await this.db.rawQuery(
      `ALTER TABLE board_members ALTER COLUMN role TYPE VARCHAR(20) USING role::VARCHAR`
    )
    await this.db.rawQuery(
      `ALTER TABLE board_members DROP CONSTRAINT IF EXISTS board_members_role_check`
    )
    await this.db.rawQuery(
      `ALTER TABLE board_members ADD CONSTRAINT board_members_role_check CHECK (role IN ('admin', 'member', 'viewer'))`
    )
  }

  async down() {
    await this.db.rawQuery(
      `ALTER TABLE board_members DROP CONSTRAINT IF EXISTS board_members_role_check`
    )
    await this.db.rawQuery(
      `ALTER TABLE board_members ADD CONSTRAINT board_members_role_check CHECK (role IN ('admin', 'member'))`
    )
  }
}