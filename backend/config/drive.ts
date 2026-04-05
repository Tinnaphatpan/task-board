import { defineConfig, services } from '@adonisjs/drive'

const driveConfig = defineConfig({
  default: 'fs',
  services: {
    fs: services.fs({
      location: new URL('../storage', import.meta.url),
      serveFiles: true,
      routeBasePath: '/uploads',
      visibility: 'public',
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
