import type { HttpContext } from '@adonisjs/core/http'
import { BoardService } from '#services/board_service'

const boardService = new BoardService()

export default class BoardsController {
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const boards = await boardService.listBoardsForUser(user.id)
    return response.ok(boards)
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { name, description } = request.only(['name', 'description'])
    if (!name) return response.badRequest({ message: 'กรุณาระบุชื่อ board' })

    const board = await boardService.createBoard(user.id, name, description)
    return response.created(board)
  }

  async show({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const board = await boardService.findBoardById(params.id)
    if (!board) return response.notFound({ message: 'ไม่พบ board นี้' })

    const isMember = await boardService.isBoardMember(board.id, user.id)
    if (!isMember) return response.forbidden({ message: 'ไม่มีสิทธิ์เข้าถึง board นี้' })

    return response.ok(board)
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const board = await boardService.findBoardById(params.id)
    if (!board) return response.notFound({ message: 'ไม่พบ board นี้' })

    const isOwner = await boardService.isBoardOwner(board.id, user.id)
    if (!isOwner) return response.forbidden({ message: 'เฉพาะเจ้าของ board เท่านั้นที่แก้ไขได้' })

    const { name, description } = request.only(['name', 'description'])
    if (!name) return response.badRequest({ message: 'กรุณาระบุชื่อ board' })

    const updated = await boardService.updateBoard(board, name, description)
    return response.ok(updated)
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const board = await boardService.findBoardById(params.id)
    if (!board) return response.notFound({ message: 'ไม่พบ board นี้' })

    const isOwner = await boardService.isBoardOwner(board.id, user.id)
    if (!isOwner) return response.forbidden({ message: 'เฉพาะเจ้าของ board เท่านั้นที่ลบได้' })

    await boardService.deleteBoard(board)
    return response.ok({ message: 'ลบ board สำเร็จ' })
  }
}
