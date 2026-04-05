import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import TaskAttachment from '#models/task_attachment'

export default class TaskAttachmentsController {
  async index({ params }: HttpContext) {
    return TaskAttachment.query().where('task_id', Number(params.taskId)).orderBy('created_at', 'desc')
  }

  async store({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const file = request.file('file', { size: '10mb' })
    if (!file) return response.badRequest({ error: 'ไม่พบไฟล์' })
    if (!file.isValid) return response.unprocessableEntity({ error: file.errors })

    const fileName = `attachments/${params.taskId}_${Date.now()}_${file.clientName}`
    await file.moveToDisk(fileName, 'fs')

    const attachment = await TaskAttachment.create({
      taskId: Number(params.taskId),
      uploadedBy: user.id,
      filename: fileName,
      originalName: file.clientName,
      mimeType: file.type ?? 'application/octet-stream',
      size: file.size,
    })
    return response.created({
      id: attachment.id,
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
      size: attachment.size,
      url: `/uploads/${fileName}`,
      createdAt: attachment.createdAt,
    })
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const attachment = await TaskAttachment.find(Number(params.id))
    if (!attachment) return response.notFound({ error: 'ไม่พบไฟล์' })
    if (attachment.uploadedBy !== user.id) return response.forbidden({ error: 'Access denied' })

    await drive.use('fs').delete(attachment.filename).catch(() => {})
    await attachment.delete()
    return response.noContent()
  }
}
