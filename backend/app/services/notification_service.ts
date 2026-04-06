import transmit from '@adonisjs/transmit/services/main'
import Notification from '#models/notification'

export class NotificationService {
  emitBoardUpdate(boardId: number, event: string, payload: Record<string, unknown>) {
    transmit.broadcast(`board/${boardId}`, { event, ...payload })
  }

  async emitTaskAssigned(boardId: number, taskId: number, taskTitle: string, assigneeId: number) {
    transmit.broadcast(`board/${boardId}`, {
      event: 'task:assigned',
      taskId,
      taskTitle,
      assigneeId,
    })
    transmit.broadcast(`user/${assigneeId}/notifications`, {
      event: 'task:assigned',
      taskId,
      taskTitle,
      boardId,
    })
    await Notification.create({
      userId: assigneeId,
      type: 'task:assigned',
      message: `คุณได้รับ task "${taskTitle}"`,
      data: { taskId, boardId },
      read: false,
    })
  }

  emitCommentAdded(boardId: number, taskId: number, taskTitle: string, authorName: string) {
    transmit.broadcast(`board/${boardId}`, {
      event: 'comment:added',
      taskId,
      taskTitle,
      authorName,
    })
  }

  emitTaskMoved(boardId: number, taskId: number, taskTitle: string, columnName: string) {
    transmit.broadcast(`board/${boardId}`, {
      event: 'task:moved',
      taskId,
      taskTitle,
      columnName,
    })
  }

  async notifyUser(userId: number, type: string, message: string, data?: Record<string, unknown>) {
    await Notification.create({ userId, type, message, data: data ?? null, read: false })
    transmit.broadcast(`user/${userId}/notifications`, { event: type, message, ...data })
  }
}
