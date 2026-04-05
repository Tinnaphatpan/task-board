import transmit from '@adonisjs/transmit/services/main'

export class NotificationService {
  emitBoardUpdate(boardId: number, event: string, payload: Record<string, unknown>) {
    transmit.broadcast(`board/${boardId}`, { event, ...payload })
  }

  emitTaskAssigned(boardId: number, taskId: number, taskTitle: string, assigneeId: number) {
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
}
