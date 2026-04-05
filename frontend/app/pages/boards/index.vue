<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface Board {
  id: number
  name: string
  description: string | null
  ownerId: number
}

const { get, post, del } = useApi()
const authStore = useAuthStore()

const boards = ref<Board[]>([])
const loading = ref(true)
const showModal = ref(false)
const form = reactive({ name: '', description: '' })
const saving = ref(false)
const error = ref('')

onMounted(fetchBoards)

async function fetchBoards() {
  loading.value = true
  try {
    boards.value = await get<Board[]>('/api/v1/boards')
  } catch {
    boards.value = []
  } finally {
    loading.value = false
  }
}

async function createBoard() {
  if (!form.name.trim()) return
  saving.value = true
  error.value = ''
  try {
    const board = await post<Board>('/api/v1/boards', form)
    boards.value.unshift(board)
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
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <!-- Navbar -->
    <nav class="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-bold text-white">Task Board</h1>
      <div class="flex items-center gap-4">
        <span class="text-gray-400 text-sm">{{ authStore.user?.fullName || authStore.user?.email }}</span>
        <button @click="authStore.logout()" class="text-sm text-gray-400 hover:text-white transition">
          ออกจากระบบ
        </button>
      </div>
    </nav>

    <main class="max-w-6xl mx-auto px-6 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold">Boards ของฉัน</h2>
          <p class="text-gray-400 mt-1">{{ boards.length }} board</p>
        </div>
        <button
          @click="showModal = true"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition"
        >
          + สร้าง Board
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="h-32 bg-gray-800 rounded-2xl animate-pulse" />
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
          class="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-indigo-500/50 transition group"
        >
          <NuxtLink :to="`/boards/${board.id}`" class="block">
            <h3 class="font-semibold text-white group-hover:text-indigo-400 transition">{{ board.name }}</h3>
            <p v-if="board.description" class="text-gray-400 text-sm mt-1 line-clamp-2">{{ board.description }}</p>
          </NuxtLink>
          <div class="flex justify-end mt-4">
            <button
              @click="deleteBoard(board.id)"
              class="text-xs text-gray-600 hover:text-red-400 transition"
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    </main>

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
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition text-sm"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition disabled:opacity-50"
            >
              {{ saving ? 'กำลังสร้าง...' : 'สร้าง' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
