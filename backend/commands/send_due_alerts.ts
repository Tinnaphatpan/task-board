import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { EmailService } from '#services/email_service'

export default class SendDueAlerts extends BaseCommand {
  static commandName = 'alerts:due'
  static description = 'Send email alerts for tasks due within 24 hours'

  static options: CommandOptions = { startApp: true }

  async run() {
    const emailService = new EmailService()
    await emailService.sendDueSoonAlerts()
    this.logger.success('Due alerts sent successfully')
  }
}
