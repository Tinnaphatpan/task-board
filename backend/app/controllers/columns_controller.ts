import type { HttpContext } from '@adonisjs/core/http'
import { BoardService } from '#services/board_service'
import { TaskService } from '#services/task_service'

const boardService = new BoardService()
const taskService = new TaskService()

export default class ColumnsController {
  async index({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const isMember = await boardService.isBoardMember(params.boardId, user.id)
    if (!isMember) return response.forbidden({ message: 'ไม่มีสิทธิ์เข้าถึง board นี้' })

    const columns = await taskService.listColumnsByBoard(params.boardId)
    return response.ok(columns)
  }

  async store({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const isOwner = await boardService.isBoardOwner(params.boardId, user.id)
    if (!isOwner) return response.forbidden({ message: 'เฉพาะเจ้าของ board เท่านั้นที่เพิ่ม column ได้' })

    const { name, position } = request.only(['name', 'position'])
    if (!name) return response.badRequest({ message: 'กรุณาระบุชื่อ column' })

    const column = await taskService.createColumn(params.boardId, name, position ?? 0)
    return response.created(column)
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const column = await taskService.getColumnById(params.id)
    if (!column) return response.notFound({ message: 'ไม่พบ column นี้' })

    const isOwner = await boardService.isBoardOwner(column.boardId!, user.id)
    if (!isOwner) return response.forbidden({ message: 'เฉพาะเจ้าของ board เท่านั้นที่แก้ไข column ได้' })

    const { name } = request.only(['name'])
    if (!name) return response.badRequest({ message: 'กรุณาระบุชื่อ column' })

    const updated = await taskService.updateColumn(column, name)
    return response.ok(updated)
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const column = await taskService.getColumnById(params.id)
    if (!column) return response.notFound({ message: 'ไม่พบ column นี้' })

    const isOwner = await boardService.isBoardOwner(column.boardId!, user.id)
    if (!isOwner) return response.forbidden({ message: 'เฉพาะเจ้าของ board เท่านั้นที่ลบ column ได้' })

    await taskService.deleteColumn(column)
    return response.ok({ message: 'ลบ column สำเร็จ' })
  }
}
