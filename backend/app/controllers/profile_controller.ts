import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import vine from '@vinejs/vine'

const updateProfileValidator = vine.compile(
  vine.object({ fullName: vine.string().minLength(1).maxLength(100).optional() })
)

export default class ProfileController {
  async show({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    return serialize({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: (user as any).avatarUrl ?? null,
    })
  }

  async update({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { fullName } = await request.validateUsing(updateProfileValidator)
    if (fullName !== undefined) {
      user.fullName = fullName
      await user.save()
    }
    return response.ok({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: (user as any).avatarUrl ?? null,
    })
  }

  async uploadAvatar({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const avatar = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })
    if (!avatar) return response.badRequest({ error: 'ไม่พบไฟล์' })
    if (!avatar.isValid) return response.unprocessableEntity({ error: avatar.errors })

    const existingAvatar = (user as any).avatarUrl as string | null
    if (existingAvatar) {
      const oldKey = existingAvatar.replace('/uploads/', '')
      await drive.use('fs').delete(oldKey).catch(() => {})
    }

    const fileName = `avatars/${user.id}_${Date.now()}.${avatar.extname}`
    await avatar.moveToDisk(fileName, 'fs')
    ;(user as any).avatarUrl = `/uploads/${fileName}`
    await user.save()

    return response.ok({ avatarUrl: (user as any).avatarUrl })
  }
}
