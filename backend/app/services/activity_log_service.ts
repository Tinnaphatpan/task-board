import ActivityLog from '#models/activity_log'

export class ActivityLogService {
  async listForBoard(boardId: number, limit = 50): Promise<ActivityLog[]> {
    return ActivityLog.query()
      .where('board_id', boardId)
      .preload('user')
      .orderBy('created_at', 'desc')
      .limit(limit)
  }

  async log(
    boardId: number,
    userId: number,
    action: string,
    entityType: string,
    entityId: number,
    description: string
  ): Promise<void> {
    await ActivityLog.create({ boardId, userId, action, entityType, entityId, description })
  }
}
