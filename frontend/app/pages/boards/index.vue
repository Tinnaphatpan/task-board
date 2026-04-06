<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface Board {
  id: number
  name: string
  description: string | null
  ownerId: number
}

interface BoardStats {
  total: number
  completionRate: number
  byPriority: { low: number; medium: number; high: number; none: number }
  byColumn: { name: string; count: number }[]
}

interface Template {
  key: string
  name: string
  description: string
  columns: string[]
  columnCount: number
}

const { get, post, del } = useApi()
const authStore = useAuthStore()

const boards = ref<Board[]>([])
const statsMap = ref<Record<number, BoardStats>>({})
const loading = ref(true)
const showModal = ref(false)
const form = reactive({ name: '', description: '' })
const saving = ref(false)
const error = ref('')

// Templates
const templates = ref<Template[]>([])
const showTemplates = ref(false)
const applyingTemplate = ref<string | null>(null)
const templateBoardName = ref('')

onMounted(async () => {
  await fetchBoards()
  templates.value = await get<Template[]>('/api/v1/board-templates').catch(() => [])
})

async function fetchBoards() {
  loading.value = true
  try {
    boards.value = await get<Board[]>('/api/v1/boards')
    loadAllStats()
  } catch {
    boards.value = []
  } finally {
    loading.value = false
  }
}

async function applyTemplate(template: Template) {
  applyingTemplate.value = template.key
  try {
    const board = await post<Board>(`/api/v1/board-templates/${template.key}/apply`, {
      boardName: templateBoardName.value || template.name,
    })
    boards.value.unshift(board)
    statsMap.value[board.id] = { total: 0, completionRate: 0, byPriority: { low: 0, medium: 0, high: 0, none: 0 }, byColumn: [] }
    showTemplates.value = false
    templateBoardName.value = ''
  } finally {
    applyingTemplate.value = null
  }
}

async function loadAllStats() {
  await Promise.all(
    boards.value.map(async (board) => {
      try {
        const stats = await get<BoardStats>(`/api/v1/boards/${board.id}/stats`)
        statsMap.value[board.id] = stats
      } catch {
        statsMap.value[board.id] = { total: 0, completionRate: 0, byPriority: { low: 0, medium: 0, high: 0, none: 0 }, byColumn: [] }
      }
    })
  )
}

async function createBoard() {
  if (!form.name.trim()) return
  saving.value = true
  error.value = ''
  try {
    const board = await post<Board>('/api/v1/boards', form)
    boards.value.unshift(board)
    statsMap.value[board.id] = { total: 0, completionRate: 0, byPriority: { low: 0, medium: 0, high: 0, none: 0 }, byColumn: [] }
    showModal.value = false
    form.name = ''
    form.description = ''
  } catch (e: any) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}

async function deleteBoard(id: number) {
  if (!confirm('ยืนยันลบ board นี้?')) return
  await del(`/api/v1/boards/${id}`)
  boards.value = boards.value.filter((b) => b.id !== id)
  delete statsMap.value[id]
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <AppNavbar title="Task Board">
      <template #actions>
        <NuxtLink to="/search" class="text-sm text-gray-400 hover:text-white transition">🔍 ค้นหา</NuxtLink>
        <NuxtLink to="/workspaces" class="text-sm text-gray-400 hover:text-white transition">Workspaces</NuxtLink>
      </template>
    </AppNavbar>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold">Boards ของฉัน</h2>
          <p class="text-gray-400 mt-1">{{ boards.length }} board</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="showTemplates = true"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm transition"
          >
            📋 Template
          </button>
          <button
            @click="showModal = true"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition"
          >
            + สร้าง Board
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="h-40 bg-gray-800 rounded-2xl animate-pulse" />
      </div>

      <!-- Empty state -->
      <div v-else-if="boards.length === 0" class="text-center py-20 text-gray-500">
        <p class="text-lg">ยังไม่มี board</p>
        <p class="text-sm mt-1">กด "สร้าง Board" เพื่อเริ่มต้น</p>
      </div>

      <!-- Board list -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="board in boards"
          :key="board.id"
          class="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-indigo-500/50 transition group flex flex-col"
        >
          <NuxtLink :to="`/boards/${board.id}`" class="block flex-1">
            <h3 class="font-semibold text-white group-hover:text-indigo-400 transition">{{ board.name }}</h3>
            <p v-if="board.description" class="text-gray-400 text-sm mt-1 line-clamp-2">{{ board.description }}</p>

            <!-- Stats -->
            <div v-if="statsMap[board.id]" class="mt-3 space-y-2">
              <!-- Completion bar -->
              <div>
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{{ statsMap[board.id].total }} tasks</span>
                  <span>{{ statsMap[board.id].completionRate }}% เสร็จ</span>
                </div>
                <div class="w-full bg-gray-800 rounded-full h-1.5">
                  <div
                    class="bg-indigo-500 h-1.5 rounded-full transition-all"
                    :style="{ width: `${statsMap[board.id].completionRate}%` }"
                  />
                </div>
              </div>
              <!-- Priority breakdown -->
              <div v-if="statsMap[board.id].total > 0" class="flex gap-1.5">
                <span v-if="statsMap[board.id].byPriority.high > 0" class="text-[10px] bg-red-900/40 text-red-400 rounded-full px-2 py-0.5">
                  🔴 {{ statsMap[board.id].byPriority.high }}
                </span>
                <span v-if="statsMap[board.id].byPriority.medium > 0" class="text-[10px] bg-yellow-900/40 text-yellow-400 rounded-full px-2 py-0.5">
                  🟡 {{ statsMap[board.id].byPriority.medium }}
                </span>
                <span v-if="statsMap[board.id].byPriority.low > 0" class="text-[10px] bg-green-900/40 text-green-400 rounded-full px-2 py-0.5">
                  🟢 {{ statsMap[board.id].byPriority.low }}
                </span>
              </div>
            </div>
          </NuxtLink>

          <div class="flex justify-end mt-4 gap-3">
            <NuxtLink :to="`/boards/${board.id}/calendar`" class="text-xs text-gray-600 hover:text-indigo-400 transition">
              📅
            </NuxtLink>
            <button @click="deleteBoard(board.id)" class="text-xs text-gray-600 hover:text-red-400 transition">
              ลบ
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Templates modal -->
    <div v-if="showTemplates" class="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 sm:px-4">
      <div class="bg-gray-900 sm:rounded-2xl rounded-t-2xl w-full sm:max-w-lg border border-gray-800 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-lg">เลือก Template</h3>
          <button @click="showTemplates = false" class="text-gray-500 hover:text-white">✕</button>
        </div>
        <div class="mb-4">
          <input
            v-model="templateBoardName"
            type="text"
            placeholder="ชื่อ board (ไม่บังคับ ถ้าว่างจะใช้ชื่อ template)"
            class="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500"
          />
        </div>
        <div class="space-y-3">
          <button
            v-for="tpl in templates"
            :key="tpl.key"
            :disabled="applyingTemplate !== null"
            @click="applyTemplate(tpl)"
            class="w-full text-left p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-500/50 transition disabled:opacity-50"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="font-semibold text-sm text-white">{{ tpl.name }}</span>
              <span v-if="applyingTemplate === tpl.key" class="text-xs text-indigo-400">กำลังสร้าง...</span>
            </div>
            <p class="text-xs text-gray-400 mb-2">{{ tpl.description }}</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="col in tpl.columns"
                :key="col"
                class="text-[10px] bg-gray-700 text-gray-300 rounded-full px-2 py-0.5"
              >{{ col }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Create modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div class="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800">
        <h3 class="font-bold text-lg mb-4">สร้าง Board ใหม่</h3>
        <form @submit.prevent="createBoard" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1.5">ชื่อ Board</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="เช่น Sprint 1, Marketing Q3"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1.5">คำอธิบาย (ไม่บังคับ)</label>
            <input
              v-model="form.description"
              type="text"
              placeholder="อธิบาย board นี้..."
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition"
            />
          </div>
          <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
          <div class="flex gap-3 justify-end pt-2">
            <button type="button" @click="showModal = false" class="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition text-sm">
              ยกเลิก
            </button>
            <button type="submit" :disabled="saving" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition disabled:opacity-50">
              {{ saving ? 'กำลังสร้าง...' : 'สร้าง' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
