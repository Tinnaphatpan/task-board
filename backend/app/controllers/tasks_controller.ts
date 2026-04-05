import type { HttpContext } from '@adonisjs/core/http'
import { BoardService } from '#services/board_service'
import { TaskService } from '#services/task_service'

const boardService = new BoardService()
const taskService = new TaskService()

export default class TasksController {
  async index({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const column = await taskService.getColumnById(params.columnId)
    if (!column) return response.notFound({ message: 'ไม่พบ column นี้' })

    const isMember = await boardService.isBoardMember(column.boardId!, user.id)
    if (!isMember) return response.forbidden({ message: 'ไม่มีสิทธิ์เข้าถึง' })

    const tasks = await taskService.listTasksByColumn(params.columnId)
    return response.ok(tasks)
  }

  async store({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const column = await taskService.getColumnById(params.columnId)
    if (!column) return response.notFound({ message: 'ไม่พบ column นี้' })

    const isMember = await boardService.isBoardMember(column.boardId!, user.id)
    if (!isMember) return response.forbidden({ message: 'ไม่มีสิทธิ์เข้าถึง' })

    const { title, description, priority, dueDate, assigneeId } = request.only([
      'title', 'description', 'priority', 'dueDate', 'assigneeId',
    ])
    if (!title) return response.badRequest({ message: 'กรุณาระบุชื่อ task' })

    const task = await taskService.createTask(params.columnId, user.id, {
      title, description, priority, dueDate, assigneeId,
    })
    return response.created(task)
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const task = await taskService.findTaskById(params.id)
    if (!task) return response.notFound({ message: 'ไม่พบ task นี้' })

    const column = await taskService.getColumnById(task.columnId!)
    const isMember = await boardService.isBoardMember(column!.boardId!, user.id)
    if (!isMember) return response.forbidden({ message: 'ไม่มีสิทธิ์แก้ไข task นี้' })

    const data = request.only(['title', 'description', 'priority', 'dueDate', 'assigneeId', 'columnId'])
    const updated = await taskService.updateTask(task, data)
    return response.ok(updated)
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const task = await taskService.findTaskById(params.id)
    if (!task) return response.notFound({ message: 'ไม่พบ task นี้' })

    const column = await taskService.getColumnById(task.columnId!)
    const isMember = await boardService.isBoardMember(column!.boardId!, user.id)
    if (!isMember) return response.forbidden({ message: 'ไม่มีสิทธิ์ลบ task นี้' })

    await taskService.deleteTask(task)
    return response.ok({ message: 'ลบ task สำเร็จ' })
  }
}
