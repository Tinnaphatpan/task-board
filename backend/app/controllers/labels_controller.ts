import type { HttpContext } from '@adonisjs/core/http'
import Label from '#models/label'
import TaskLabel from '#models/task_label'
import { BoardService } from '#services/board_service'
import vine from '@vinejs/vine'

const boardService = new BoardService()

const createValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(50),
    color: vine.string().regex(/^#[0-9a-fA-F]{6}$/),
  })
)

export default class LabelsController {
  async index({ params }: HttpContext) {
    return Label.query().where('board_id', Number(params.boardId)).orderBy('name')
  }

  async store({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const isAdmin = await boardService.isBoardAdmin(Number(params.boardId), user.id)
    if (!isAdmin) return response.forbidden({ error: 'Only admin can manage labels' })
    const { name, color } = await request.validateUsing(createValidator)
    const label = await Label.create({ boardId: Number(params.boardId), name, color })
    return response.created(label)
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const label = await Label.find(Number(params.id))
    if (!label) return response.notFound({ error: 'Label not found' })
    const isAdmin = await boardService.isBoardAdmin(label.boardId!, user.id)
    if (!isAdmin) return response.forbidden({ error: 'Only admin can delete labels' })
    await label.delete()
    return response.noContent()
  }

  async attachToTask({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const existing = await TaskLabel.query()
      .where('task_id', Number(params.taskId))
      .where('label_id', Number(params.labelId))
      .first()
    if (existing) return response.conflict({ error: 'Label already attached' })
    await TaskLabel.create({ taskId: Number(params.taskId), labelId: Number(params.labelId) })
    return response.created({ taskId: Number(params.taskId), labelId: Number(params.labelId) })
  }

  async detachFromTask({ params, response }: HttpContext) {
    await TaskLabel.query()
      .where('task_id', Number(params.taskId))
      .where('label_id', Number(params.labelId))
      .delete()
    return response.noContent()
  }

  async taskLabels({ params }: HttpContext) {
    const taskLabels = await TaskLabel.query()
      .where('task_id', Number(params.taskId))
      .preload('label')
    return taskLabels.map((tl) => ({
      id: tl.label.id,
      name: tl.label.name,
      color: tl.label.color,
    }))
  }
}
