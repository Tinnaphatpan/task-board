import type { HttpContext } from '@adonisjs/core/http'
import { BoardService } from '#services/board_service'
import Task from '#models/task'
import Column from '#models/column'
import db from '@adonisjs/lucid/services/db'

const boardService = new BoardService()

export default class BoardStatsController {
  async index({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const isMember = await boardService.isBoardMember(Number(params.boardId), user.id)
    if (!isMember) return response.forbidden({ error: 'Access denied' })

    const columns = await Column.query().where('board_id', params.boardId)
    const columnIds = columns.map((c) => c.id)

    if (columnIds.length === 0) {
      return { total: 0, byPriority: {}, byColumn: [], completionRate: 0 }
    }

    const tasks = await Task.query().whereIn('column_id', columnIds)
    const total = tasks.length
    const byPriority = { low: 0, medium: 0, high: 0, none: 0 }

    for (const task of tasks) {
      const p = task.priority as string | null
      if (p === 'low') byPriority.low++
      else if (p === 'medium') byPriority.medium++
      else if (p === 'high') byPriority.high++
      else byPriority.none++
    }

    const byColumn = columns.map((col) => ({
      name: col.name,
      count: tasks.filter((t) => t.columnId === col.id).length,
    }))

    const doneColumn = columns.find((c) => c.name.toLowerCase().includes('done'))
    const completionRate =
      total > 0 && doneColumn
        ? Math.round((tasks.filter((t) => t.columnId === doneColumn.id).length / total) * 100)
        : 0

    return { total, byPriority, byColumn, completionRate }
  }
}
