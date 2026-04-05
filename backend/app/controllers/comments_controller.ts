import type { HttpContext } from '@adonisjs/core/http'
import { CommentService } from '#services/comment_service'
import { NotificationService } from '#services/notification_service'
import Task from '#models/task'
import Column from '#models/column'
import vine from '@vinejs/vine'

const notificationService = new NotificationService()

const commentService = new CommentService()

const createCommentValidator = vine.compile(
  vine.object({ content: vine.string().minLength(1).maxLength(2000) })
)

export default class CommentsController {
  async index({ params }: HttpContext) {
    const comments = await commentService.listComments(Number(params.taskId))
    return comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      user: { id: c.user.id, fullName: c.user.fullName, email: c.user.email },
    }))
  }

  async store({ params, request, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const { content } = await request.validateUsing(createCommentValidator)
    const comment = await commentService.createComment(Number(params.taskId), user.id, content)
    await comment.load('user')

    const task = await Task.find(Number(params.taskId))
    if (task) {
      const column = await Column.find(task.columnId)
      if (column) {
        const authorName = user.fullName || user.email
        notificationService.emitCommentAdded(column.boardId!, task.id, task.title, authorName)
      }
    }

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: { id: comment.user.id, fullName: comment.user.fullName, email: comment.user.email },
    }
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const comment = await commentService.findCommentById(Number(params.id))
    if (!comment) return response.notFound({ error: 'Comment not found' })
    if (comment.userId !== user.id) return response.forbidden({ error: 'Access denied' })
    await commentService.deleteComment(comment)
    return response.noContent()
  }
}
