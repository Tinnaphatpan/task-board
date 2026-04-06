import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class SearchController {
  async index({ request, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const query = request.input('q', '').trim()

    if (!query || query.length < 2) {
      return { boards: [], tasks: [] }
    }

    // Board IDs this user has access to
    const memberRows = await db.from('board_members').where('user_id', user.id).select('board_id')
    const ownedRows = await db.from('boards').where('owner_id', user.id).select('id')

    const accessibleBoardIds = [
      ...new Set([
        ...memberRows.map((r: { board_id: number }) => r.board_id),
        ...ownedRows.map((r: { id: number }) => r.id),
      ]),
    ]

    if (accessibleBoardIds.length === 0) {
      return { boards: [], tasks: [] }
    }

    const like = `%${query}%`

    const [boards, tasks] = await Promise.all([
      db
        .from('boards')
        .whereIn('id', accessibleBoardIds)
        .where((q) => q.whereLike('name', like).orWhereLike('description', like))
        .select('id', 'name', 'description')
        .limit(10),

      db
        .from('tasks')
        .join('columns', 'tasks.column_id', 'columns.id')
        .join('boards', 'columns.board_id', 'boards.id')
        .whereIn('columns.board_id', accessibleBoardIds)
        .where((q) => q.whereLike('tasks.title', like).orWhereLike('tasks.description', like))
        .select(
          'tasks.id',
          'tasks.title',
          'tasks.description',
          'tasks.priority',
          'tasks.column_id as columnId',
          'columns.board_id as boardId',
          'boards.name as boardName'
        )
        .limit(20),
    ])

    return {
      boards: boards.map((b: any) => ({ ...b, type: 'board' as const })),
      tasks: tasks.map((t: any) => ({ ...t, type: 'task' as const })),
    }
  }
}
