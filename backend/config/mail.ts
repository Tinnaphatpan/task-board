import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST', 'smtp.gmail.com'),
      port: env.get('SMTP_PORT', 587),
      secure: false,
      auth: {
        type: 'login',
        user: env.get('SMTP_USER', ''),
        pass: env.get('SMTP_PASS', ''),
      },
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
