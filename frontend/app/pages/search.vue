<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface BoardResult {
  id: number
  name: string
  description: string | null
  type: 'board'
}

interface TaskResult {
  id: number
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | null
  columnId: number
  boardId: number
  boardName: string
  type: 'task'
}

const { get } = useApi()
const query = ref('')
const boards = ref<BoardResult[]>([])
const tasks = ref<TaskResult[]>([])
const loading = ref(false)
const searched = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(query, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!val.trim() || val.trim().length < 2) {
    boards.value = []
    tasks.value = []
    searched.value = false
    return
  }
  debounceTimer = setTimeout(() => doSearch(), 400)
})

async function doSearch() {
  if (!query.value.trim()) return
  loading.value = true
  searched.value = true
  try {
    const result = await get<{ boards: BoardResult[]; tasks: TaskResult[] }>(
      `/api/v1/search?q=${encodeURIComponent(query.value)}`
    )
    boards.value = result.boards ?? []
    tasks.value = result.tasks ?? []
  } catch {
    boards.value = []
    tasks.value = []
  } finally {
    loading.value = false
  }
}

const priorityColor: Record<string, string> = {
  low: 'bg-green-900/40 text-green-400',
  medium: 'bg-yellow-900/40 text-yellow-400',
  high: 'bg-red-900/40 text-red-400',
}

const priorityLabel: Record<string, string> = { low: 'ต่ำ', medium: 'กลาง', high: 'สูง' }

const totalResults = computed(() => boards.value.length + tasks.value.length)
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <!-- Navbar -->
    <nav class="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-3">
      <div class="flex items-center gap-3 max-w-3xl mx-auto">
        <NuxtLink to="/boards" class="text-gray-400 hover:text-white transition text-sm shrink-0">← Boards</NuxtLink>
        <h1 class="text-base font-bold text-white">Global Search</h1>
      </div>
    </nav>

    <div class="flex-1 p-4 sm:p-8">
      <div class="max-w-3xl mx-auto space-y-6">
        <!-- Search box -->
        <div class="relative">
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            v-model="query"
            type="text"
            placeholder="ค้นหา boards, tasks..."
            autofocus
            class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 text-base outline-none focus:border-indigo-500 transition"
          />
          <div v-if="loading" class="absolute inset-y-0 right-4 flex items-center">
            <svg class="w-5 h-5 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        </div>

        <!-- Hint -->
        <p v-if="!searched && !query" class="text-center text-gray-600 text-sm">
          พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อค้นหา
        </p>

        <!-- No results -->
        <div v-else-if="searched && !loading && totalResults === 0" class="text-center py-12">
          <p class="text-gray-500 text-sm">ไม่พบผลลัพธ์สำหรับ "<span class="text-white">{{ query }}</span>"</p>
        </div>

        <template v-else-if="totalResults > 0">
          <!-- Summary -->
          <p class="text-xs text-gray-500">
            พบ {{ totalResults }} ผลลัพธ์
          </p>

          <!-- Boards -->
          <section v-if="boards.length > 0">
            <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Boards ({{ boards.length }})</h2>
            <div class="space-y-2">
              <NuxtLink
                v-for="board in boards"
                :key="board.id"
                :to="`/boards/${board.id}`"
                class="flex items-start gap-3 p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500/50 transition group"
              >
                <div class="w-9 h-9 rounded-lg bg-indigo-900/50 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-white group-hover:text-indigo-300 transition truncate">{{ board.name }}</p>
                  <p v-if="board.description" class="text-xs text-gray-500 truncate mt-0.5">{{ board.description }}</p>
                </div>
                <span class="text-xs text-gray-600 group-hover:text-indigo-400 transition shrink-0">→</span>
              </NuxtLink>
            </div>
          </section>

          <!-- Tasks -->
          <section v-if="tasks.length > 0">
            <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tasks ({{ tasks.length }})</h2>
            <div class="space-y-2">
              <NuxtLink
                v-for="task in tasks"
                :key="task.id"
                :to="`/boards/${task.boardId}`"
                class="flex items-start gap-3 p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500/50 transition group"
              >
                <div class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-sm font-semibold text-white group-hover:text-indigo-300 transition truncate">{{ task.title }}</p>
                    <span
                      v-if="task.priority"
                      class="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                      :class="priorityColor[task.priority]"
                    >{{ priorityLabel[task.priority] }}</span>
                  </div>
                  <p v-if="task.description" class="text-xs text-gray-500 truncate mt-0.5">{{ task.description }}</p>
                  <p class="text-[10px] text-gray-600 mt-1">
                    <span class="text-indigo-500/70">{{ task.boardName }}</span>
                  </p>
                </div>
                <span class="text-xs text-gray-600 group-hover:text-indigo-400 transition shrink-0">→</span>
              </NuxtLink>
            </div>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>
