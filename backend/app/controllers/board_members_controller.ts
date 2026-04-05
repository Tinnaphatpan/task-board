import type { HttpContext } from '@adonisjs/core/http'
import { BoardService } from '#services/board_service'
import BoardMember from '#models/board_member'
import vine from '@vinejs/vine'

const boardService = new BoardService()

const inviteValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    role: vine.enum(['admin', 'member', 'viewer'] as const),
  })
)

const updateRoleValidator = vine.compile(
  vine.object({ role: vine.enum(['admin', 'member', 'viewer'] as const) })
)

export default class BoardMembersController {
  async index({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const isMember = await boardService.isBoardMember(Number(params.boardId), user.id)
    if (!isMember) return response.forbidden({ error: 'Access denied' })

    const members = await boardService.listBoardMembers(Number(params.boardId))
    return members
  }

  async store({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const isAdmin = await boardService.isBoardAdmin(Number(params.boardId), user.id)
    if (!isAdmin) return response.forbidden({ error: 'Only admin can invite members' })

    const { userId, role } = await request.validateUsing(inviteValidator)
    const existing = await BoardMember.query()
      .where('board_id', params.boardId)
      .where('user_id', userId)
      .first()
    if (existing) return response.conflict({ error: 'User is already a member' })

    const member = await BoardMember.create({ boardId: Number(params.boardId), userId, role })
    return response.created(member)
  }

  async update({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const isAdmin = await boardService.isBoardAdmin(Number(params.boardId), user.id)
    if (!isAdmin) return response.forbidden({ error: 'Only admin can change roles' })

    const { role } = await request.validateUsing(updateRoleValidator)
    const member = await BoardMember.query()
      .where('board_id', params.boardId)
      .where('user_id', params.userId)
      .first()
    if (!member) return response.notFound({ error: 'Member not found' })

    member.role = role
    await member.save()
    return member
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const isAdmin = await boardService.isBoardAdmin(Number(params.boardId), user.id)
    const isSelf = user.id === Number(params.userId)
    if (!isAdmin && !isSelf) return response.forbidden({ error: 'Access denied' })

    await BoardMember.query()
      .where('board_id', params.boardId)
      .where('user_id', params.userId)
      .delete()
    return response.noContent()
  }
}
