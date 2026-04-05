<script setup lang="ts">
definePageMeta({ layout: false })

const { post } = useApi()
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await post<{ token: string; user: { id: number; fullName: string | null; email: string } }>(
      '/api/v1/auth/login',
      form
    )
    const token = useCookie('auth_token')
    token.value = res.token
    authStore.setUser(res.user)
    router.push('/boards')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white">Task Board</h1>
        <p class="text-gray-400 mt-2">เข้าสู่ระบบเพื่อจัดการงาน</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">อีเมล</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="your@email.com"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">รหัสผ่าน</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
          >
            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </form>

        <p class="text-center text-gray-500 text-sm mt-6">
          ยังไม่มีบัญชี?
          <NuxtLink to="/register" class="text-indigo-400 hover:text-indigo-300 transition">สมัครสมาชิก</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
