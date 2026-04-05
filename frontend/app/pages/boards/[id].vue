<script setup lang="ts">
import draggable from 'vuedraggable'

definePageMeta({ middleware: 'auth' })

interface User {
  id: number
  fullName: string | null
  email: string
}

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
  assigneeId: number | null
  position: number
}

interface Subtask {
  id: number
  taskId: number
  title: string
  completed: boolean
  position: number
}

interface Comment {
  id: number
  content: string
  createdAt: string
  user: { id: number; fullName: string | null; email: string }
}

interface Attachment {
  id: number
  originalName: string
  mimeType: string
  size: number
  url: string
  createdAt: string
}

interface BoardMember {
  id: number
  fullName: string | null
  email: string
  role: string
}

interface ActivityLog {
  id: number
  action: string
  entityType: string
  description: string
  createdAt: string
  user: { id: number; fullName: string | null; email: string } | null
}

const route = useRoute()
const { get, post, put, del } = useApi()
const { $patch: authPatch } = useAuthStore()
const authStore = useAuthStore()
const boardId = Number(route.params.id)

const board = ref<Board | null>(null)
const columns = ref<Column[]>([])
const tasksByColumn = ref<Record<number, Task[]>>({})
const loading = ref(true)
const allUsers = ref<User[]>([])
const activityLogs = ref<ActivityLog[]>([])
const showActivityLog = ref(false)
const showMembers = ref(false)
const boardMembers = ref<BoardMember[]>([])
const attachments = ref<Attachment[]>([])
const uploadingFile = ref(false)
const attachmentInput = ref<HTMLInputElement | null>(null)

// Column modal
const showColumnModal = ref(false)
const columnForm = reactive({ name: '' })
const savingColumn = ref(false)

// Task detail modal
const selectedTask = ref<Task | null>(null)
const showTaskDetail = ref(false)
const subtasks = ref<Subtask[]>([])
const comments = ref<Comment[]>([])
const newComment = ref('')
const postingComment = ref(false)
const newSubtask = ref('')
const addingSubtask = ref(false)
const savingTaskEdit = ref(false)
const editTaskForm = reactive({
  title: '',
  description: '',
  priority: '' as '' | 'low' | 'medium' | 'high',
  dueDate: '',
  assigneeId: null as number | null,
})

// Add task
const showAddTask = ref<number | null>(null)
const newTaskTitle = ref('')
const addingTask = ref(false)

// Search
const searchQuery = ref('')

onMounted(loadBoard)

async function loadBoard() {
  loading.value = true
  try {
    const [boardData, columnsData, usersData] = await Promise.all([
      get<Board>(`/api/v1/boards/${boardId}`),
      get<Column[]>(`/api/v1/boards/${boardId}/columns`),
      get<User[]>('/api/v1/users'),
    ])
    board.value = boardData
    columns.value = columnsData.sort((a, b) => a.position - b.position)
    allUsers.value = usersData
    await loadAllTasks()
    loadActivityLogs()
    loadBoardMembers()
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

async function loadActivityLogs() {
  try {
    activityLogs.value = await get<ActivityLog[]>(`/api/v1/boards/${boardId}/activity`)
  } catch {
    activityLogs.value = []
  }
}

async function loadBoardMembers() {
  try {
    boardMembers.value = await get<BoardMember[]>(`/api/v1/boards/${boardId}/members`)
  } catch {
    boardMembers.value = []
  }
}

// Drag & drop handler
async function onTaskDrop(columnId: number) {
  const tasks = tasksByColumn.value[columnId]
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].columnId !== columnId || tasks[i].position !== i) {
      tasks[i].columnId = columnId
      tasks[i].position = i
      await put(`/api/v1/boards/tasks/${tasks[i].id}`, { columnId, position: i })
    }
  }
}

// Column
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
  if (!confirm('ยืนยันลบ column นี้? tasks ทั้งหมดจะถูกลบด้วย')) return
  await del(`/api/v1/boards/columns/${columnId}`)
  columns.value = columns.value.filter((c) => c.id !== columnId)
  delete tasksByColumn.value[columnId]
}

// Add task inline
function openAddTask(columnId: number) {
  showAddTask.value = columnId
  newTaskTitle.value = ''
}

async function submitAddTask(columnId: number) {
  if (!newTaskTitle.value.trim()) {
    showAddTask.value = null
    return
  }
  addingTask.value = true
  try {
    const tasks = tasksByColumn.value[columnId] ?? []
    const task = await post<Task>(`/api/v1/boards/columns/${columnId}/tasks`, {
      title: newTaskTitle.value,
      position: tasks.length,
    })
    tasksByColumn.value[columnId] = [...tasks, task]
    showAddTask.value = null
    newTaskTitle.value = ''
    loadActivityLogs()
  } finally {
    addingTask.value = false
  }
}

// Task detail
async function openTaskDetail(task: Task) {
  selectedTask.value = { ...task }
  editTaskForm.title = task.title
  editTaskForm.description = task.description ?? ''
  editTaskForm.priority = task.priority ?? ''
  editTaskForm.dueDate = task.dueDate ?? ''
  editTaskForm.assigneeId = task.assigneeId ?? null
  showTaskDetail.value = true
  const [subtasksData, commentsData, attachmentsData] = await Promise.all([
    get<Subtask[]>(`/api/v1/boards/tasks/${task.id}/subtasks`),
    get<Comment[]>(`/api/v1/boards/tasks/${task.id}/comments`),
    get<Attachment[]>(`/api/v1/boards/tasks/${task.id}/attachments`),
  ])
  subtasks.value = subtasksData
  comments.value = commentsData
  attachments.value = attachmentsData
}

async function handleFileUpload(event: Event) {
  if (!selectedTask.value) return
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadingFile.value = true
  try {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(
      `${config.public.apiBase}/api/v1/boards/tasks/${selectedTask.value.id}/attachments`,
      { method: 'POST', headers: { Authorization: `Bearer ${token.value}` }, body: formData }
    )
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    attachments.value.unshift(data)
  } finally {
    uploadingFile.value = false
  }
}

async function deleteAttachment(attachment: Attachment) {
  await del(`/api/v1/boards/attachments/${attachment.id}`)
  attachments.value = attachments.value.filter((a) => a.id !== attachment.id)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function saveTaskEdit() {
  if (!selectedTask.value || !editTaskForm.title.trim()) return
  savingTaskEdit.value = true
  try {
    const updated = await put<Task>(`/api/v1/boards/tasks/${selectedTask.value.id}`, {
      title: editTaskForm.title,
      description: editTaskForm.description || null,
      priority: editTaskForm.priority || null,
      dueDate: editTaskForm.dueDate || null,
      assigneeId: editTaskForm.assigneeId || null,
    })
    const colId = selectedTask.value.columnId
    tasksByColumn.value[colId] = tasksByColumn.value[colId].map((t) =>
      t.id === updated.id ? updated : t
    )
    selectedTask.value = updated
    loadActivityLogs()
  } finally {
    savingTaskEdit.value = false
  }
}

async function deleteSelectedTask() {
  if (!selectedTask.value || !confirm('ยืนยันลบ task นี้?')) return
  await del(`/api/v1/boards/tasks/${selectedTask.value.id}`)
  const colId = selectedTask.value.columnId
  tasksByColumn.value[colId] = tasksByColumn.value[colId].filter(
    (t) => t.id !== selectedTask.value!.id
  )
  showTaskDetail.value = false
  loadActivityLogs()
}

// Subtasks
async function addSubtask() {
  if (!newSubtask.value.trim() || !selectedTask.value) return
  addingSubtask.value = true
  try {
    const subtask = await post<Subtask>(`/api/v1/boards/tasks/${selectedTask.value.id}/subtasks`, {
      title: newSubtask.value,
    })
    subtasks.value.push(subtask)
    newSubtask.value = ''
  } finally {
    addingSubtask.value = false
  }
}

async function toggleSubtask(subtask: Subtask) {
  const updated = await put<Subtask>(`/api/v1/boards/subtasks/${subtask.id}/toggle`, {})
  const idx = subtasks.value.findIndex((s) => s.id === subtask.id)
  if (idx !== -1) subtasks.value[idx] = updated
}

async function deleteSubtask(subtask: Subtask) {
  await del(`/api/v1/boards/subtasks/${subtask.id}`)
  subtasks.value = subtasks.value.filter((s) => s.id !== subtask.id)
}

// Comments
async function postComment() {
  if (!newComment.value.trim() || !selectedTask.value) return
  postingComment.value = true
  try {
    const comment = await post<Comment>(`/api/v1/boards/tasks/${selectedTask.value.id}/comments`, {
      content: newComment.value,
    })
    comments.value.push(comment)
    newComment.value = ''
    loadActivityLogs()
  } finally {
    postingComment.value = false
  }
}

async function deleteComment(comment: Comment) {
  await del(`/api/v1/boards/comments/${comment.id}`)
  comments.value = comments.value.filter((c) => c.id !== comment.id)
}

// Helpers
const priorityLabel: Record<string, string> = { low: 'ต่ำ', medium: 'กลาง', high: 'สูง' }
const priorityColor: Record<string, string> = {
  low: 'bg-green-900/40 text-green-400 border-green-800',
  medium: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  high: 'bg-red-900/40 text-red-400 border-red-800',
}

function getUserName(userId: number | null): string {
  if (!userId) return ''
  const user = allUsers.value.find((u) => u.id === userId)
  return user?.fullName || user?.email || ''
}

function getUserInitials(userId: number | null): string {
  const name = getUserName(userId)
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const completedSubtasks = computed(() => subtasks.value.filter((s) => s.completed).length)

const filteredColumns = computed(() => {
  if (!searchQuery.value.trim()) return columns.value
  return columns.value
})

function filteredTasks(columnId: number): Task[] {
  const tasks = tasksByColumn.value[columnId] ?? []
  if (!searchQuery.value.trim()) return tasks
  const q = searchQuery.value.toLowerCase()
  return tasks.filter((t) => t.title.toLowerCase().includes(q))
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

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <!-- Navbar -->
    <nav class="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-3 shrink-0">
      <NuxtLink to="/boards" class="text-gray-400 hover:text-white transition text-sm">← Boards</NuxtLink>
      <span class="text-gray-700">/</span>
      <h1 class="text-base font-bold text-white">{{ board?.name ?? '...' }}</h1>
      <div class="flex-1" />
      <!-- Search -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหา task..."
        class="w-48 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition"
      />
      <!-- Members toggle -->
      <button
        @click="showMembers = !showMembers; showActivityLog = false"
        class="px-3 py-1.5 rounded-lg text-sm border transition"
        :class="showMembers ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'"
      >
        👥 สมาชิก
      </button>
      <!-- Calendar link -->
      <NuxtLink
        :to="`/boards/${boardId}/calendar`"
        class="px-3 py-1.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-400 hover:text-white transition"
      >
        📅 Calendar
      </NuxtLink>
      <!-- Activity log toggle -->
      <button
        @click="showActivityLog = !showActivityLog; showMembers = false"
        class="px-3 py-1.5 rounded-lg text-sm border transition"
        :class="showActivityLog ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'"
      >
        Activity
      </button>
    </nav>

    <div class="flex flex-1 overflow-hidden">
      <!-- Board area -->
      <div class="flex gap-4 p-6 overflow-x-auto flex-1 items-start" @click.self="showAddTask = null">
        <!-- Loading skeleton -->
        <template v-if="loading">
          <div v-for="i in 3" :key="i" class="w-72 shrink-0 h-64 bg-gray-800 rounded-2xl animate-pulse" />
        </template>

        <template v-else>
          <!-- Columns -->
          <div
            v-for="col in filteredColumns"
            :key="col.id"
            class="w-72 shrink-0 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col max-h-[calc(100vh-120px)]"
          >
            <!-- Column header -->
            <div class="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-sm text-white">{{ col.name }}</span>
                <span class="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
                  {{ filteredTasks(col.id).length }}
                </span>
              </div>
              <button @click="deleteColumn(col.id)" class="text-gray-600 hover:text-red-400 transition text-xs">✕</button>
            </div>

            <!-- Draggable tasks -->
            <div class="flex-1 overflow-y-auto px-3 pb-2">
              <draggable
                :list="tasksByColumn[col.id]"
                group="tasks"
                item-key="id"
                class="flex flex-col gap-2 min-h-[4px]"
                @end="onTaskDrop(col.id)"
              >
                <template #item="{ element: task }">
                  <div
                    v-show="filteredTasks(col.id).some(t => t.id === task.id)"
                    class="bg-gray-800 border border-gray-700 rounded-xl p-3 group hover:border-indigo-500/50 transition cursor-pointer select-none"
                    @click="openTaskDetail(task)"
                  >
                    <p class="text-sm font-medium text-white leading-snug">{{ task.title }}</p>
                    <p v-if="task.description" class="text-xs text-gray-400 mt-1 line-clamp-2">
                      {{ task.description }}
                    </p>
                    <div class="flex items-center justify-between mt-2 gap-2">
                      <span
                        v-if="task.priority"
                        class="text-xs rounded-full px-2 py-0.5 border"
                        :class="priorityColor[task.priority]"
                      >
                        {{ priorityLabel[task.priority] }}
                      </span>
                      <span v-else class="flex-1" />
                      <div class="flex items-center gap-2 ml-auto">
                        <span v-if="task.dueDate" class="text-xs text-gray-500">
                          {{ formatShortDate(task.dueDate) }}
                        </span>
                        <div
                          v-if="task.assigneeId"
                          class="w-5 h-5 rounded-full bg-indigo-700 flex items-center justify-center text-[9px] font-bold text-white"
                          :title="getUserName(task.assigneeId)"
                        >
                          {{ getUserInitials(task.assigneeId) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>

              <!-- Add task inline -->
              <div v-if="showAddTask === col.id" class="mt-2">
                <input
                  v-model="newTaskTitle"
                  type="text"
                  placeholder="ชื่อ task..."
                  autofocus
                  class="w-full px-3 py-2 rounded-xl bg-gray-800 border border-indigo-500 text-sm text-white placeholder:text-gray-500 outline-none"
                  @keydown.enter="submitAddTask(col.id)"
                  @keydown.escape="showAddTask = null"
                />
                <div class="flex gap-2 mt-1.5">
                  <button
                    @click="submitAddTask(col.id)"
                    :disabled="addingTask"
                    class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold disabled:opacity-50 transition"
                  >
                    เพิ่ม
                  </button>
                  <button @click="showAddTask = null" class="px-3 py-1 text-gray-400 hover:text-white rounded-lg text-xs transition">
                    ยกเลิก
                  </button>
                </div>
              </div>

              <!-- Add task button -->
              <button
                v-else
                @click.stop="openAddTask(col.id)"
                class="w-full text-left text-xs text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl px-3 py-2 mt-2 transition border border-dashed border-gray-700 hover:border-indigo-500/50"
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
        </template>
      </div>

      <!-- Members Sidebar -->
      <transition name="slide">
        <div
          v-if="showMembers"
          class="w-80 shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden"
        >
          <div class="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <h3 class="font-semibold text-sm">สมาชิก ({{ boardMembers.length }})</h3>
            <button @click="showMembers = false" class="text-gray-500 hover:text-white text-xs">✕</button>
          </div>
          <div class="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            <div v-for="member in boardMembers" :key="member.id" class="flex items-center gap-3 py-2">
              <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                {{ (member.fullName || member.email)[0].toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ member.fullName || member.email }}</p>
                <p class="text-xs text-gray-500 truncate">{{ member.email }}</p>
              </div>
              <span class="text-xs px-2 py-0.5 rounded-full shrink-0"
                :class="{
                  'bg-purple-900/40 text-purple-400': member.role === 'owner',
                  'bg-indigo-900/40 text-indigo-400': member.role === 'admin',
                  'bg-gray-800 text-gray-400': member.role === 'member',
                  'bg-gray-800 text-gray-600': member.role === 'viewer',
                }"
              >
                {{ member.role }}
              </span>
            </div>
          </div>
        </div>
      </transition>

      <!-- Activity Log Sidebar -->
      <transition name="slide">
        <div
          v-if="showActivityLog"
          class="w-80 shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden"
        >
          <div class="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <h3 class="font-semibold text-sm">Activity Log</h3>
            <button @click="showActivityLog = false" class="text-gray-500 hover:text-white text-xs">✕</button>
          </div>
          <div class="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            <div v-if="activityLogs.length === 0" class="text-center text-gray-600 text-xs py-8">
              ยังไม่มี activity
            </div>
            <div v-for="log in activityLogs" :key="log.id" class="flex gap-2">
              <div class="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[9px] font-bold text-gray-300 shrink-0 mt-0.5">
                {{ log.user ? (log.user.fullName || log.user.email)[0].toUpperCase() : '?' }}
              </div>
              <div>
                <p class="text-xs text-gray-300 leading-snug">{{ log.description }}</p>
                <p class="text-[10px] text-gray-600 mt-0.5">{{ formatDate(log.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Add Column Modal -->
    <div v-if="showColumnModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div class="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-800">
        <h3 class="font-bold text-lg mb-4">เพิ่ม Column ใหม่</h3>
        <form @submit.prevent="createColumn" class="space-y-4">
          <input
            v-model="columnForm.name"
            type="text"
            required
            placeholder="เช่น To Do, In Progress, Done"
            class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition"
            autofocus
          />
          <div class="flex gap-3 justify-end">
            <button type="button" @click="showColumnModal = false" class="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition text-sm">ยกเลิก</button>
            <button type="submit" :disabled="savingColumn" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition disabled:opacity-50">
              {{ savingColumn ? 'กำลังเพิ่ม...' : 'เพิ่ม' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Task Detail Modal -->
    <div v-if="showTaskDetail && selectedTask" class="fixed inset-0 bg-black/70 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
      <div class="bg-gray-900 rounded-2xl w-full max-w-2xl border border-gray-800 my-auto">
        <!-- Header -->
        <div class="flex items-start justify-between p-6 border-b border-gray-800">
          <div class="flex-1 pr-4">
            <input
              v-model="editTaskForm.title"
              class="w-full bg-transparent text-lg font-bold text-white outline-none border-b border-transparent hover:border-gray-600 focus:border-indigo-500 transition pb-1"
            />
          </div>
          <div class="flex gap-2 shrink-0">
            <button @click="saveTaskEdit" :disabled="savingTaskEdit" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold transition disabled:opacity-50">
              {{ savingTaskEdit ? 'บันทึก...' : 'บันทึก' }}
            </button>
            <button @click="deleteSelectedTask" class="px-3 py-1.5 bg-red-900/40 hover:bg-red-900/70 text-red-400 rounded-lg text-xs font-semibold transition">ลบ</button>
            <button @click="showTaskDetail = false" class="text-gray-500 hover:text-white transition text-lg leading-none px-1">✕</button>
          </div>
        </div>

        <div class="p-6 grid grid-cols-3 gap-6">
          <!-- Left: details -->
          <div class="col-span-2 space-y-5">
            <!-- Description -->
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">คำอธิบาย</label>
              <textarea
                v-model="editTaskForm.description"
                rows="3"
                placeholder="เพิ่มคำอธิบาย..."
                class="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>

            <!-- Subtasks -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-medium text-gray-400">
                  Subtasks
                  <span v-if="subtasks.length > 0" class="ml-1 text-gray-600">
                    {{ completedSubtasks }}/{{ subtasks.length }}
                  </span>
                </label>
              </div>
              <!-- Progress bar -->
              <div v-if="subtasks.length > 0" class="w-full bg-gray-800 rounded-full h-1.5 mb-3">
                <div
                  class="bg-indigo-500 h-1.5 rounded-full transition-all"
                  :style="{ width: `${(completedSubtasks / subtasks.length) * 100}%` }"
                />
              </div>
              <div class="space-y-1.5">
                <div v-for="subtask in subtasks" :key="subtask.id" class="flex items-center gap-2 group">
                  <button
                    @click="toggleSubtask(subtask)"
                    class="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition"
                    :class="subtask.completed ? 'bg-indigo-600 border-indigo-500' : 'border-gray-600 hover:border-indigo-500'"
                  >
                    <span v-if="subtask.completed" class="text-[9px] text-white">✓</span>
                  </button>
                  <span class="text-sm flex-1" :class="subtask.completed ? 'line-through text-gray-500' : 'text-gray-300'">
                    {{ subtask.title }}
                  </span>
                  <button @click="deleteSubtask(subtask)" class="text-gray-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                </div>
              </div>
              <div class="flex gap-2 mt-2">
                <input
                  v-model="newSubtask"
                  type="text"
                  placeholder="เพิ่ม subtask..."
                  class="flex-1 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition"
                  @keydown.enter="addSubtask"
                />
                <button @click="addSubtask" :disabled="addingSubtask" class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs transition disabled:opacity-50">
                  เพิ่ม
                </button>
              </div>
            </div>

            <!-- Attachments -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-medium text-gray-400">ไฟล์แนบ ({{ attachments.length }})</label>
                <button
                  @click="attachmentInput?.click()"
                  :disabled="uploadingFile"
                  class="text-xs text-indigo-400 hover:text-indigo-300 transition disabled:opacity-50"
                >
                  {{ uploadingFile ? 'กำลังอัปโหลด...' : '+ แนบไฟล์' }}
                </button>
              </div>
              <input ref="attachmentInput" type="file" class="hidden" @change="handleFileUpload" />
              <div class="space-y-1.5 max-h-32 overflow-y-auto">
                <div v-if="attachments.length === 0" class="text-xs text-gray-600">ยังไม่มีไฟล์แนบ</div>
                <div v-for="att in attachments" :key="att.id" class="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 group">
                  <span class="text-xs flex-1 truncate text-gray-300">{{ att.originalName }}</span>
                  <span class="text-[10px] text-gray-500 shrink-0">{{ formatFileSize(att.size) }}</span>
                  <a
                    :href="`${useRuntimeConfig().public.apiBase}${att.url}`"
                    target="_blank"
                    class="text-[10px] text-indigo-400 hover:text-indigo-300 shrink-0"
                  >↓</a>
                  <button @click="deleteAttachment(att)" class="text-gray-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition shrink-0">✕</button>
                </div>
              </div>
            </div>

            <!-- Comments -->
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-2">Comments</label>
              <div class="space-y-3 mb-3 max-h-48 overflow-y-auto">
                <div v-if="comments.length === 0" class="text-xs text-gray-600">ยังไม่มีความคิดเห็น</div>
                <div v-for="comment in comments" :key="comment.id" class="flex gap-2 group">
                  <div class="w-6 h-6 rounded-full bg-indigo-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                    {{ (comment.user.fullName || comment.user.email)[0].toUpperCase() }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-medium text-gray-300">{{ comment.user.fullName || comment.user.email }}</span>
                      <span class="text-[10px] text-gray-600">{{ formatDate(comment.createdAt) }}</span>
                    </div>
                    <p class="text-sm text-gray-300 mt-0.5 leading-snug">{{ comment.content }}</p>
                  </div>
                  <button
                    v-if="comment.user.id === authStore.user?.id"
                    @click="deleteComment(comment)"
                    class="text-gray-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition shrink-0"
                  >✕</button>
                </div>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="newComment"
                  type="text"
                  placeholder="เขียนความคิดเห็น..."
                  class="flex-1 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition"
                  @keydown.enter="postComment"
                />
                <button @click="postComment" :disabled="postingComment" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm transition disabled:opacity-50">
                  ส่ง
                </button>
              </div>
            </div>
          </div>

          <!-- Right: metadata -->
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">ความสำคัญ</label>
              <select
                v-model="editTaskForm.priority"
                class="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white outline-none focus:border-indigo-500 transition"
              >
                <option value="">ไม่ระบุ</option>
                <option value="low">ต่ำ</option>
                <option value="medium">กลาง</option>
                <option value="high">สูง</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">กำหนดส่ง</label>
              <input
                v-model="editTaskForm.dueDate"
                type="date"
                class="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Assignee</label>
              <select
                v-model="editTaskForm.assigneeId"
                class="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white outline-none focus:border-indigo-500 transition"
              >
                <option :value="null">ไม่ระบุ</option>
                <option v-for="user in allUsers" :key="user.id" :value="user.id">
                  {{ user.fullName || user.email }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: width 0.2s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  width: 0;
}
.slide-enter-to,
.slide-leave-from {
  width: 20rem;
}
</style>
