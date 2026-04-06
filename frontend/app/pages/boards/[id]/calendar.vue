<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface Task {
  id: number
  columnId: number
  title: string
  priority: 'low' | 'medium' | 'high' | null
  dueDate: string | null
}

interface Column {
  id: number
  name: string
}

const route = useRoute()
const { get } = useApi()
const boardId = Number(route.params.id)

const columns = ref<Column[]>([])
const allTasks = ref<Task[]>([])
const loading = ref(true)

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

onMounted(loadData)

async function loadData() {
  loading.value = true
  try {
    const columnsData = await get<Column[]>(`/api/v1/boards/${boardId}/columns`)
    columns.value = columnsData
    const results = await Promise.all(
      columnsData.map((col) => get<Task[]>(`/api/v1/boards/columns/${col.id}/tasks`))
    )
    allTasks.value = results.flat()
  } finally {
    loading.value = false
  }
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const monthName = computed(() =>
  new Date(currentYear.value, currentMonth.value).toLocaleDateString('th-TH', {
    month: 'long',
    year: 'numeric',
  })
)

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = []

  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  while (days.length % 7 !== 0) days.push(null)
  return days
})

function tasksOnDay(day: number | null): Task[] {
  if (!day) return []
  return allTasks.value.filter((t) => {
    if (!t.dueDate) return false
    const d = new Date(t.dueDate)
    return (
      d.getFullYear() === currentYear.value &&
      d.getMonth() === currentMonth.value &&
      d.getDate() === day
    )
  })
}

function isToday(day: number | null): boolean {
  if (!day) return false
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  )
}

const priorityColor: Record<string, string> = {
  low: 'bg-green-900/60 text-green-300',
  medium: 'bg-yellow-900/60 text-yellow-300',
  high: 'bg-red-900/60 text-red-300',
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <!-- Navbar -->
    <nav class="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-3 shrink-0">
      <NuxtLink :to="`/boards/${boardId}`" class="text-gray-400 hover:text-white transition text-sm">← Kanban</NuxtLink>
      <span class="text-gray-700">/</span>
      <h1 class="text-base font-bold text-white">Calendar</h1>
    </nav>

    <main class="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <!-- Month navigation -->
      <div class="flex items-center justify-between mb-6">
        <button @click="prevMonth" class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition">←</button>
        <h2 class="text-lg font-bold">{{ monthName }}</h2>
        <button @click="nextMonth" class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition">→</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-7 gap-2">
        <div v-for="i in 35" :key="i" class="h-24 bg-gray-800 rounded-xl animate-pulse" />
      </div>

      <!-- Calendar grid -->
      <div v-else>
        <!-- Day headers -->
        <div class="grid grid-cols-7 gap-2 mb-2">
          <div v-for="day in ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']" :key="day"
            class="text-center text-xs text-gray-500 font-medium py-1">
            {{ day }}
          </div>
        </div>

        <!-- Day cells -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2">
          <div
            v-for="(day, idx) in calendarDays"
            :key="idx"
            class="min-h-16 sm:min-h-24 rounded-lg sm:rounded-xl p-1 sm:p-2 border transition"
            :class="[
              day ? 'bg-gray-900 border-gray-800' : 'bg-transparent border-transparent',
              isToday(day) ? 'border-indigo-500/60 bg-indigo-950/30' : '',
            ]"
          >
            <span v-if="day"
              class="text-xs font-semibold block mb-1"
              :class="isToday(day) ? 'text-indigo-400' : 'text-gray-400'"
            >
              {{ day }}
            </span>
            <div class="space-y-1">
              <div
                v-for="task in tasksOnDay(day)"
                :key="task.id"
                class="text-[10px] rounded-lg px-1.5 py-0.5 truncate cursor-pointer"
                :class="task.priority ? priorityColor[task.priority] : 'bg-gray-700 text-gray-300'"
              >
                {{ task.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex gap-4 mt-6 text-xs text-gray-500">
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-green-500 inline-block"></span>ต่ำ</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>กลาง</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-500 inline-block"></span>สูง</span>
      </div>
    </main>
  </div>
</template>
