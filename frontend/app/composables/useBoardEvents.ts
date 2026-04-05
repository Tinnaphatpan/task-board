import { Transmit } from '@adonisjs/transmit-client'

interface BoardEvent {
  event: string
  taskId?: number
  taskTitle?: string
  columnId?: number
  columnName?: string
  assigneeId?: number
  authorName?: string
}

export function useBoardEvents(boardId: number) {
  const config = useRuntimeConfig()
  const notifications = ref<{ id: number; message: string; type: string }[]>([])
  let transmit: Transmit | null = null
  let unsubscribe: (() => void) | null = null

  function connect() {
    transmit = new Transmit({ baseUrl: config.public.apiBase })
    const channel = transmit.subscription(`board/${boardId}`)
    channel.create()
    unsubscribe = channel.onMessage((data: BoardEvent) => {
      const message = formatEventMessage(data)
      if (message) addNotification(message, 'info')
    })
  }

  function disconnect() {
    unsubscribe?.()
    transmit?.close?.()
  }

  function addNotification(message: string, type = 'info') {
    const id = Date.now()
    notifications.value.unshift({ id, message, type })
    setTimeout(() => {
      notifications.value = notifications.value.filter((n) => n.id !== id)
    }, 5000)
  }

  function formatEventMessage(data: BoardEvent): string | null {
    switch (data.event) {
      case 'task:created':
        return `Task ใหม่: "${data.taskTitle}"`
      case 'task:assigned':
        return `Task "${data.taskTitle}" ถูก assign แล้ว`
      case 'task:moved':
        return `Task "${data.taskTitle}" ย้ายไป ${data.columnName}`
      case 'task:deleted':
        return `ลบ task แล้ว`
      case 'comment:added':
        return `${data.authorName} comment ใน "${data.taskTitle}"`
      default:
        return null
    }
  }

  onMounted(connect)
  onUnmounted(disconnect)

  return { notifications, addNotification }
}
