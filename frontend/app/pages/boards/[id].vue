<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface Board {
  id: number
  name: string
  description: string | null
  ownerId: number
}

interface Column {
  id: number
  boardId: number
  name: string
  position: number
}

interface Task {
  id: number
  columnId: number
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | null
  dueDate: string | null
  position: number
}

const route = useRoute()
const { get, post, put, del } = useApi()
const boardId = Number(route.params.id)

const board = ref<Board | null>(null)
const columns = ref<Column[]>([])
const tasksByColumn = ref<Record<number, Task[]>>({})
const loading = ref(true)

// Column modal
const showColumnModal = ref(false)
const columnForm = reactive({ name: '' })
const savingColumn = ref(false)

// Task modal
const showTaskModal = ref(false)
const activeColumnId = ref<number | null>(null)
const taskForm = reactive({ title: '', description: '', priority: '' as '' | 'low' | 'medium' | 'high', dueDate: '' })
const savingTask = ref(false)

// Edit task modal
const showEditModal = ref(false)
const editingTask = ref<Task | null>(null)
const editForm = reactive({ title: '', description: '', priority: '' as '' | 'low' | 'medium' | 'high', dueDate: '' })
const savingEdit = ref(false)

onMounted(loadBoard)

async function loadBoard() {
  loading.value = true
  try {
    const [boardData, columnsData] = await Promise.all([
      get<Board>(`/api/v1/boards/${boardId}`),
      get<Column[]>(`/api/v1/boards/${boardId}/columns`),
    ])
    board.value = boardData
    columns.value = columnsData.sort((a, b) => a.position - b.position)
    await loadAllTasks()
  } catch {
    board.value = null
  } finally {
    loading.value = false
  }
}

async function loadAllTasks() {
  const results = await Promise.all(
    columns.value.map((col) =>
      get<Task[]>(`/api/v1/boards/columns/${col.id}/tasks`).then((tasks) => ({ colId: col.id, tasks }))
    )
  )
  tasksByColumn.value = {}
  for (const { colId, tasks } of results) {
    tasksByColumn.value[colId] = tasks.sort((a, b) => a.position - b.position)
  }
}

async function createColumn() {
  if (!columnForm.name.trim()) return
  savingColumn.value = true
  try {
    const col = await post<Column>(`/api/v1/boards/${boardId}/columns`, {
      name: columnForm.name,
      position: columns.value.length,
    })
    columns.value.push(col)
    tasksByColumn.value[col.id] = []
    showColumnModal.value = false
    columnForm.name = ''
  } finally {
    savingColumn.value = false
  }
}

async function deleteColumn(columnId: number) {
  if (!confirm('ยืนยันลบ column นี้? tasks ทั้งหมดใน column จะถูกลบด้วย')) return
  await del(`/api/v1/boards/columns/${columnId}`)
  columns.value = columns.value.filter((c) => c.id !== columnId)
  delete tasksByColumn.value[columnId]
}

function openAddTask(columnId: number) {
  activeColumnId.value = columnId
  taskForm.title = ''
  taskForm.description = ''
  taskForm.priority = ''
  taskForm.dueDate = ''
  showTaskModal.value = true
}

async function createTask() {
  if (!taskForm.title.trim() || !activeColumnId.value) return
  savingTask.value = true
  try {
    const tasks = tasksByColumn.value[activeColumnId.value] ?? []
    const payload = {
      title: taskForm.title,
      description: taskForm.description || null,
      priority: taskForm.priority || null,
      dueDate: taskForm.dueDate || null,
      position: tasks.length,
    }
    const task = await post<Task>(`/api/v1/boards/columns/${activeColumnId.value}/tasks`, payload)
    tasksByColumn.value[activeColumnId.value] = [...tasks, task]
    showTaskModal.value = false
  } finally {
    savingTask.value = false
  }
}

function openEditTask(task: Task) {
  editingTask.value = task
  editForm.title = task.title
  editForm.description = task.description ?? ''
  editForm.priority = task.priority ?? ''
  editForm.dueDate = task.dueDate ?? ''
  showEditModal.value = true
}

async function saveEditTask() {
  if (!editingTask.value || !editForm.title.trim()) return
  savingEdit.value = true
  try {
    const updated = await put<Task>(`/api/v1/boards/tasks/${editingTask.value.id}`, {
      title: editForm.title,
      description: editForm.description || null,
      priority: editForm.priority || null,
      dueDate: editForm.dueDate || null,
    })
    const colId = editingTask.value.columnId
    tasksByColumn.value[colId] = tasksByColumn.value[colId].map((t) =>
      t.id === updated.id ? updated : t
    )
    showEditModal.value = false
  } finally {
    savingEdit.value = false
  }
}

async function deleteTask(task: Task) {
  if (!confirm('ยืนยันลบ task นี้?')) return
  await del(`/api/v1/boards/tasks/${task.id}`)
  tasksByColumn.value[task.columnId] = tasksByColumn.value[task.columnId].filter((t) => t.id !== task.id)
}

const priorityLabel: Record<string, string> = { low: 'ต่ำ', medium: 'กลาง', high: 'สูง' }
const priorityColor: Record<string, string> = {
  low: 'bg-green-900/40 text-green-400',
  medium: 'bg-yellow-900/40 text-yellow-400',
  high: 'bg-red-900/40 text-red-400',
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <!-- Navbar -->
    <nav class="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4 shrink-0">
      <NuxtLink to="/boards" class="text-gray-400 hover:text-white transition text-sm">← Boards</NuxtLink>
      <span class="text-gray-700">/</span>
      <h1 class="text-lg font-bold text-white">{{ board?.name ?? '...' }}</h1>
      <span v-if="board?.description" class="text-gray-500 text-sm hidden sm:block">— {{ board.description }}</span>
    </nav>

    <!-- Loading skeleton -->
    <div v-if="loading" class="flex gap-4 p-6 overflow-x-auto">
      <div v-for="i in 3" :key="i" class="w-72 shrink-0 h-64 bg-gray-800 rounded-2xl animate-pulse" />
    </div>

    <!-- Board area -->
    <div v-else class="flex gap-4 p-6 overflow-x-auto flex-1 items-start">
      <!-- Columns -->
      <div
        v-for="col in columns"
        :key="col.id"
        class="w-72 shrink-0 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col"
      >
        <!-- Column header -->
        <div class="flex items-center justify-between px-4 pt-4 pb-2">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-sm text-white">{{ col.name }}</span>
            <span class="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
              {{ (tasksByColumn[col.id] ?? []).length }}
            </span>
          </div>
          <button @click="deleteColumn(col.id)" class="text-gray-600 hover:text-red-400 transition text-xs">✕</button>
        </div>

        <!-- Tasks -->
        <div class="flex flex-col gap-2 px-3 pb-3 flex-1">
          <div
            v-for="task in tasksByColumn[col.id] ?? []"
            :key="task.id"
            class="bg-gray-800 border border-gray-700 rounded-xl p-3 group hover:border-indigo-500/50 transition cursor-pointer"
            @click="openEditTask(task)"
          >
            <p class="text-sm font-medium text-white leading-snug">{{ task.title }}</p>
            <p v-if="task.description" class="text-xs text-gray-400 mt-1 line-clamp-2">{{ task.description }}</p>
            <div class="flex items-center justify-between mt-2">
              <span
                v-if="task.priority"
                class="text-xs rounded-full px-2 py-0.5"
                :class="priorityColor[task.priority]"
              >
                {{ priorityLabel[task.priority] }}
              </span>
              <span v-else class="flex-1" />
              <div class="flex items-center gap-2">
                <span v-if="task.dueDate" class="text-xs text-gray-500">
                  {{ new Date(task.dueDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }) }}
                </span>
                <button
                  @click.stop="deleteTask(task)"
                  class="text-xs text-gray-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>

          <!-- Add task button -->
          <button
            @click="openAddTask(col.id)"
            class="w-full text-left text-xs text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl px-3 py-2 transition border border-dashed border-gray-700 hover:border-indigo-500/50"
          >
            + เพิ่ม task
          </button>
        </div>
      </div>

      <!-- Add column button -->
      <button
        @click="showColumnModal = true"
        class="w-72 shrink-0 h-14 rounded-2xl border border-dashed border-gray-700 text-gray-500 hover:text-white hover:border-indigo-500/50 transition text-sm font-medium"
      >
        + เพิ่ม Column
      </button>
    </div>

    <!-- Add Column Modal -->
    <div v-if="showColumnModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div class="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-800">
        <h3 class="font-bold text-lg mb-4">เพิ่ม Column ใหม่</h3>
        <form @submit.prevent="createColumn" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1.5">ชื่อ Column</label>
            <input
              v-model="columnForm.name"
              type="text"
              required
              placeholder="เช่น To Do, In Progress, Done"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition"
              autofocus
            />
          </div>
          <div class="flex gap-3 justify-end pt-1">
            <button type="button" @click="showColumnModal = false" class="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition text-sm">
              ยกเลิก
            </button>
            <button type="submit" :disabled="savingColumn" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition disabled:opacity-50">
              {{ savingColumn ? 'กำลังเพิ่ม...' : 'เพิ่ม' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showTaskModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div class="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800">
        <h3 class="font-bold text-lg mb-4">เพิ่ม Task ใหม่</h3>
        <form @submit.prevent="createTask" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1.5">ชื่อ Task</label>
            <input
              v-model="taskForm.title"
              type="text"
              required
              placeholder="สิ่งที่ต้องทำ..."
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition"
              autofocus
            />
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1.5">คำอธิบาย (ไม่บังคับ)</label>
            <textarea
              v-model="taskForm.description"
              rows="3"
              placeholder="รายละเอียดเพิ่มเติม..."
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition resize-none"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-300 mb-1.5">ความสำคัญ</label>
              <select
                v-model="taskForm.priority"
                class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-indigo-500 transition"
              >
                <option value="">ไม่ระบุ</option>
                <option value="low">ต่ำ</option>
                <option value="medium">กลาง</option>
                <option value="high">สูง</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-1.5">กำหนดส่ง</label>
              <input
                v-model="taskForm.dueDate"
                type="date"
                class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
          <div class="flex gap-3 justify-end pt-1">
            <button type="button" @click="showTaskModal = false" class="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition text-sm">
              ยกเลิก
            </button>
            <button type="submit" :disabled="savingTask" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition disabled:opacity-50">
              {{ savingTask ? 'กำลังเพิ่ม...' : 'เพิ่ม Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Task Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div class="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800">
        <h3 class="font-bold text-lg mb-4">แก้ไข Task</h3>
        <form @submit.prevent="saveEditTask" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1.5">ชื่อ Task</label>
            <input
              v-model="editForm.title"
              type="text"
              required
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1.5">คำอธิบาย</label>
            <textarea
              v-model="editForm.description"
              rows="3"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition resize-none"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-300 mb-1.5">ความสำคัญ</label>
              <select
                v-model="editForm.priority"
                class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-indigo-500 transition"
              >
                <option value="">ไม่ระบุ</option>
                <option value="low">ต่ำ</option>
                <option value="medium">กลาง</option>
                <option value="high">สูง</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-1.5">กำหนดส่ง</label>
              <input
                v-model="editForm.dueDate"
                type="date"
                class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
          <div class="flex gap-3 justify-end pt-1">
            <button type="button" @click="showEditModal = false" class="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition text-sm">
              ยกเลิก
            </button>
            <button type="submit" :disabled="savingEdit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition disabled:opacity-50">
              {{ savingEdit ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
