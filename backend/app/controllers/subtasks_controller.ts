import type { HttpContext } from '@adonisjs/core/http'
import { SubtaskService } from '#services/subtask_service'
import vine from '@vinejs/vine'

const subtaskService = new SubtaskService()

const createSubtaskValidator = vine.compile(
  vine.object({ title: vine.string().minLength(1).maxLength(500) })
)

export default class SubtasksController {
  async index({ params }: HttpContext) {
    return subtaskService.listSubtasks(Number(params.taskId))
  }

  async store({ params, request }: HttpContext) {
    const { title } = await request.validateUsing(createSubtaskValidator)
    const existing = await subtaskService.listSubtasks(Number(params.taskId))
    return subtaskService.createSubtask(Number(params.taskId), title, existing.length)
  }

  async toggle({ params, response }: HttpContext) {
    const subtask = await subtaskService.findSubtaskById(Number(params.id))
    if (!subtask) return response.notFound({ error: 'Subtask not found' })
    return subtaskService.toggleSubtask(subtask)
  }

  async destroy({ params, response }: HttpContext) {
    const subtask = await subtaskService.findSubtaskById(Number(params.id))
    if (!subtask) return response.notFound({ error: 'Subtask not found' })
    await subtaskService.deleteSubtask(subtask)
    return response.noContent()
  }
}
