import Board from '#models/board'
import BoardMember from '#models/board_member'
import Column from '#models/column'

export class BoardService {
  async listBoardsForUser(userId: number): Promise<Board[]> {
    const ownedBoards = await Board.query().where('owner_id', userId)
    const memberBoardIds = await BoardMember.query()
      .where('user_id', userId)
      .select('board_id')
    const memberBoards = await Board.query().whereIn(
      'id',
      memberBoardIds.map((m) => m.boardId!)
    )
    const allBoards = [...ownedBoards, ...memberBoards]
    const uniqueBoards = allBoards.filter(
      (board, index, self) => self.findIndex((b) => b.id === board.id) === index
    )
    return uniqueBoards
  }

  async createBoard(userId: number, name: string, description?: string): Promise<Board> {
    const board = await Board.create({ ownerId: userId, name, description })
    await this.createDefaultColumns(board.id)
    return board
  }

  async findBoardById(boardId: number): Promise<Board | null> {
    return Board.find(boardId)
  }

  async updateBoard(board: Board, name: string, description?: string): Promise<Board> {
    board.name = name
    board.description = description ?? null
    await board.save()
    return board
  }

  async deleteBoard(board: Board): Promise<void> {
    await board.delete()
  }

  async isBoardMember(boardId: number, userId: number): Promise<boolean> {
    const board = await Board.find(boardId)
    if (!board) return false
    if (board.ownerId === userId) return true
    const member = await BoardMember.query()
      .where('board_id', boardId)
      .where('user_id', userId)
      .first()
    return !!member
  }

  async isBoardOwner(boardId: number, userId: number): Promise<boolean> {
    const board = await Board.find(boardId)
    return board?.ownerId === userId
  }

  private async createDefaultColumns(boardId: number): Promise<void> {
    const defaultColumns = [
      { name: 'To Do', position: 0 },
      { name: 'In Progress', position: 1 },
      { name: 'Done', position: 2 },
    ]
    for (const col of defaultColumns) {
      await Column.create({ boardId, name: col.name, position: col.position })
    }
  }
}
