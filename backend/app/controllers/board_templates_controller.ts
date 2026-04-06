import type { HttpContext } from '@adonisjs/core/http'
import Board from '#models/board'
import Column from '#models/column'
import db from '@adonisjs/lucid/services/db'

interface TemplateDefinition {
  name: string
  description: string
  columns: string[]
}

const TEMPLATES: Record<string, TemplateDefinition> = {
  kanban: {
    name: 'Kanban',
    description: 'กระดาน Kanban พื้นฐาน',
    columns: ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'],
  },
  scrum: {
    name: 'Scrum Sprint',
    description: 'บอร์ดสำหรับ Scrum Sprint',
    columns: ['Product Backlog', 'Sprint Backlog', 'In Progress', 'Testing', 'Done'],
  },
  bugtracker: {
    name: 'Bug Tracker',
    description: 'ติดตาม bugs และปัญหา',
    columns: ['New', 'Confirmed', 'In Progress', 'Testing', 'Resolved', 'Closed'],
  },
}

export default class BoardTemplatesController {
  async index() {
    return Object.entries(TEMPLATES).map(([key, tpl]) => ({
      key,
      name: tpl.name,
      description: tpl.description,
      columnCount: tpl.columns.length,
      columns: tpl.columns,
    }))
  }

  async apply({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { boardName, workspaceId } = request.only(['boardName', 'workspaceId'])
    const templateKey = params.key

    const template = TEMPLATES[templateKey]
    if (!template) {
      return response.notFound({ error: 'Template not found' })
    }

    const boardTitle = boardName?.trim() || template.name

    const board = await db.transaction(async (trx) => {
      const newBoard = await Board.create(
        {
          name: boardTitle,
          description: template.description,
          ownerId: user.id,
          workspaceId: workspaceId ? Number(workspaceId) : null,
        },
        { client: trx }
      )

      for (let i = 0; i < template.columns.length; i++) {
        await Column.create({ boardId: newBoard.id, name: template.columns[i], position: i }, { client: trx })
      }

      return newBoard
    })

    return response.created(board)
  }
}
