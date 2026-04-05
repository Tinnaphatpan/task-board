import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import Task from '#models/task'
import Column from '#models/column'
import User from '#models/user'

export class EmailService {
  async sendDueSoonAlerts(): Promise<void> {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const tasks = await Task.query()
      .whereNotNull('due_date')
      .whereNotNull('assignee_id')
      .where('due_date', '<=', tomorrowStr)

    for (const task of tasks) {
      if (!task.assigneeId) continue
      const assignee = await User.find(task.assigneeId)
      if (!assignee) continue

      await this.sendDueReminderEmail(assignee.email, task.title, task.dueDate as unknown as string)
    }
  }

  async sendDueReminderEmail(toEmail: string, taskTitle: string, dueDate: string): Promise<void> {
    const from = env.get('MAIL_FROM', 'noreply@taskboard.local')
    try {
      await mail.send((message) => {
        message
          .to(toEmail)
          .from(from)
          .subject(`[Task Board] งานที่ใกล้กำหนดส่ง: ${taskTitle}`)
          .html(`
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #4f46e5;">งานที่ใกล้กำหนดส่ง</h2>
              <p>คุณมี task ที่ใกล้ถึงกำหนดส่ง:</p>
              <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <strong>${taskTitle}</strong><br/>
                <span style="color: #ef4444;">กำหนดส่ง: ${new Date(dueDate).toLocaleDateString('th-TH')}</span>
              </div>
              <p>เข้าสู่ระบบเพื่อดูรายละเอียดงาน</p>
            </div>
          `)
      })
    } catch {
      // silent fail — email config may not be set
    }
  }

  async sendTaskAssignedEmail(toEmail: string, taskTitle: string, boardName: string, assignerName: string): Promise<void> {
    const from = env.get('MAIL_FROM', 'noreply@taskboard.local')
    try {
      await mail.send((message) => {
        message
          .to(toEmail)
          .from(from)
          .subject(`[Task Board] ได้รับ task ใหม่: ${taskTitle}`)
          .html(`
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #4f46e5;">ได้รับ task ใหม่</h2>
              <p><strong>${assignerName}</strong> ได้ assign task ให้คุณ:</p>
              <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <strong>${taskTitle}</strong><br/>
                <span style="color: #6b7280;">Board: ${boardName}</span>
              </div>
            </div>
          `)
      })
    } catch {
      // silent fail
    }
  }
}
