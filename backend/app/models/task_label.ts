import { TaskLabelSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Label from '#models/label'

export default class TaskLabel extends TaskLabelSchema {
  @belongsTo(() => Label)
  declare label: BelongsTo<typeof Label>
}
