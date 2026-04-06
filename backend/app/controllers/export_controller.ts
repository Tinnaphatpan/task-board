import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { BoardService } from '#services/board_service'

const boardService = new BoardService()

export default class ExportController {
  async boardCsv({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const boardId = Number(params.boardId)

    const hasAccess = await boardService.getBoardMemberRole(boardId, user.id)
    if (!hasAccess) {
      return response.forbidden({ error: 'Access denied' })
    }

    const tasks = await db
      .from('tasks')
      .join('columns', 'tasks.column_id', 'columns.id')
      .leftJoin('users as assignees', 'tasks.assignee_id', 'assignees.id')
      .where('columns.board_id', boardId)
      .select(
        'tasks.id',
        'tasks.title',
        'tasks.description',
        'tasks.priority',
        'tasks.due_date as dueDate',
        'columns.name as columnName',
        db.raw(`COALESCE(assignees.full_name, assignees.email, '') as assignee`)
      )
      .orderBy('columns.position')
      .orderBy('tasks.position')

    const header = ['ID', 'Title', 'Description', 'Priority', 'Due Date', 'Column', 'Assignee']
    const rows = tasks.map((t: any) => [
      t.id,
      `"${String(t.title ?? '').replace(/"/g, '""')}"`,
      `"${String(t.description ?? '').replace(/"/g, '""')}"`,
      t.priority ?? '',
      t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : '',
      `"${String(t.columnName ?? '').replace(/"/g, '""')}"`,
      `"${String(t.assignee ?? '').replace(/"/g, '""')}"`,
    ])

    const csv = [header.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n')

    response.header('Content-Type', 'text/csv')
    response.header('Content-Disposition', `attachment; filename="board-${boardId}-tasks.csv"`)
    return response.send(csv)
  }
}
