import type { HttpContext } from '@adonisjs/core/http'
import { WorkspaceService } from '#services/workspace_service'
import vine from '@vinejs/vine'

const workspaceService = new WorkspaceService()

const createValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(100),
    description: vine.string().maxLength(500).optional(),
  })
)

export default class WorkspacesController {
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return workspaceService.listForUser(user.id)
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { name, description } = await request.validateUsing(createValidator)
    const workspace = await workspaceService.create(user.id, name, description)
    return response.created(workspace)
  }

  async show({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const workspace = await workspaceService.findById(Number(params.id))
    if (!workspace) return response.notFound({ error: 'ไม่พบ workspace' })
    const isMember = await workspaceService.isMember(workspace.id, user.id)
    if (!isMember) return response.forbidden({ error: 'Access denied' })
    return workspace
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const workspace = await workspaceService.findById(Number(params.id))
    if (!workspace) return response.notFound({ error: 'ไม่พบ workspace' })
    const isOwner = await workspaceService.isOwner(workspace.id, user.id)
    if (!isOwner) return response.forbidden({ error: 'เฉพาะเจ้าของเท่านั้น' })
    const { name, description } = await request.validateUsing(createValidator)
    return workspaceService.update(workspace, name, description)
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const workspace = await workspaceService.findById(Number(params.id))
    if (!workspace) return response.notFound({ error: 'ไม่พบ workspace' })
    const isOwner = await workspaceService.isOwner(workspace.id, user.id)
    if (!isOwner) return response.forbidden({ error: 'เฉพาะเจ้าของเท่านั้น' })
    await workspaceService.delete(workspace)
    return response.noContent()
  }
}
