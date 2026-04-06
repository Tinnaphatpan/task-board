<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface Notification {
  id: number
  type: string
  message: string
  data: Record<string, unknown> | null
  read: boolean
  createdAt: string
}

interface PaginatedResponse {
  data: Notification[]
  meta: { total: number; currentPage: number; lastPage: number }
}

const { get, patch } = useApi()
const notifications = ref<Notification[]>([])
const meta = ref({ total: 0, currentPage: 1, lastPage: 1 })
const loading = ref(true)
const markingAll = ref(false)

onMounted(fetchNotifications)

async function fetchNotifications(page = 1) {
  loading.value = true
  try {
    const result = await get<PaginatedResponse>(`/api/v1/notifications?page=${page}`)
    notifications.value = result.data ?? []
    meta.value = result.meta ?? { total: 0, currentPage: 1, lastPage: 1 }
  } catch {
    notifications.value = []
  } finally {
    loading.value = false
  }
}

async function markRead(notif: Notification) {
  if (notif.read) return
  await patch(`/api/v1/notifications/${notif.id}/read`, {})
  notif.read = true
}

async function markAllRead() {
  markingAll.value = true
  try {
    await patch('/api/v1/notifications/read-all', {})
    notifications.value.forEach((n) => (n.read = true))
  } finally {
    markingAll.value = false
  }
}

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

const typeIcon: Record<string, string> = {
  'task:assigned': '📋',
  'due:soon': '⏰',
  'task:moved': '🔄',
  'comment:added': '💬',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <!-- Navbar -->
    <nav class="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-3">
      <div class="flex items-center gap-3 max-w-2xl mx-auto">
        <NuxtLink to="/boards" class="text-gray-400 hover:text-white transition text-sm shrink-0">← Boards</NuxtLink>
        <h1 class="text-base font-bold text-white flex-1">การแจ้งเตือน</h1>
        <button
          v-if="unreadCount > 0"
          @click="markAllRead"
          :disabled="markingAll"
          class="text-xs text-indigo-400 hover:text-indigo-300 transition disabled:opacity-50"
        >
          {{ markingAll ? '...' : 'อ่านทั้งหมด' }}
        </button>
      </div>
    </nav>

    <div class="flex-1 p-4 sm:p-8">
      <div class="max-w-2xl mx-auto space-y-3">
        <!-- Loading -->
        <template v-if="loading">
          <div v-for="i in 5" :key="i" class="h-16 rounded-xl bg-gray-900 border border-gray-800 animate-pulse" />
        </template>

        <!-- Empty -->
        <div v-else-if="notifications.length === 0" class="text-center py-16">
          <p class="text-4xl mb-3">🔔</p>
          <p class="text-gray-500">ยังไม่มีการแจ้งเตือน</p>
        </div>

        <!-- Notification list -->
        <template v-else>
          <p class="text-xs text-gray-500">
            {{ notifications.length }} รายการ
            <span v-if="unreadCount > 0" class="ml-2 text-indigo-400">({{ unreadCount }} ยังไม่ได้อ่าน)</span>
          </p>

          <div
            v-for="notif in notifications"
            :key="notif.id"
            class="flex items-start gap-3 p-4 rounded-xl border transition cursor-pointer"
            :class="notif.read
              ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
              : 'bg-gray-900 border-indigo-500/40 hover:border-indigo-500/70'"
            @click="markRead(notif)"
          >
            <!-- Icon -->
            <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-lg"
              :class="notif.read ? 'bg-gray-800' : 'bg-indigo-900/40'">
              {{ typeIcon[notif.type] ?? '🔔' }}
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white leading-snug" :class="{ 'text-gray-400': notif.read }">
                {{ notif.message }}
              </p>
              <p class="text-[10px] text-gray-600 mt-1">{{ formatDate(notif.createdAt) }}</p>
            </div>

            <!-- Unread dot -->
            <div v-if="!notif.read" class="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
          </div>

          <!-- Pagination -->
          <div v-if="meta.lastPage > 1" class="flex justify-center gap-2 pt-4">
            <button
              v-for="page in meta.lastPage"
              :key="page"
              @click="fetchNotifications(page)"
              class="w-8 h-8 rounded-lg text-xs transition"
              :class="page === meta.currentPage
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'"
            >
              {{ page }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
