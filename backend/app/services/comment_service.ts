import Comment from '#models/comment'
import ActivityLog from '#models/activity_log'

export class CommentService {
  async listComments(taskId: number): Promise<Comment[]> {
    return Comment.query()
      .where('task_id', taskId)
      .preload('user')
      .orderBy('created_at', 'asc')
  }

  async createComment(taskId: number, userId: number, content: string): Promise<Comment> {
    return Comment.create({ taskId, userId, content })
  }

  async deleteComment(comment: Comment): Promise<void> {
    await comment.delete()
  }

  async findCommentById(commentId: number): Promise<Comment | null> {
    return Comment.find(commentId)
  }

  async logActivity(
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
