<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { get, put } = useApi()
const authStore = useAuthStore()
const config = useRuntimeConfig()

interface Profile {
  id: number
  fullName: string | null
  email: string
  avatarUrl: string | null
}

const profile = ref<Profile | null>(null)
const form = reactive({ fullName: '' })
const saving = ref(false)
const uploadingAvatar = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const avatarInput = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  profile.value = await get<Profile>('/api/v1/account/profile')
  form.fullName = profile.value?.fullName ?? ''
})

async function saveProfile() {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const updated = await put<Profile>('/api/v1/account/profile', { fullName: form.fullName })
    profile.value = updated
    authStore.setUser({ id: updated.id, fullName: updated.fullName, email: updated.email })
    successMsg.value = 'บันทึกข้อมูลสำเร็จ'
  } catch (e: any) {
    errorMsg.value = e.message
  } finally {
    saving.value = false
  }
}

async function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadingAvatar.value = true
  errorMsg.value = ''
  try {
    const formData = new FormData()
    formData.append('avatar', file)

    const token = useCookie<string | null>('auth_token')
    const res = await fetch(`${config.public.apiBase}/api/v1/account/avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    if (profile.value) profile.value.avatarUrl = data.avatarUrl
    successMsg.value = 'อัปโหลด avatar สำเร็จ'
  } catch (e: any) {
    errorMsg.value = e.message
  } finally {
    uploadingAvatar.value = false
  }
}

function avatarFullUrl(path: string | null): string {
  if (!path) return ''
  return `${config.public.apiBase}${path}`
}

function getInitials(): string {
  const name = profile.value?.fullName || profile.value?.email || '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <!-- Navbar -->
    <nav class="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4">
      <NuxtLink to="/boards" class="text-gray-400 hover:text-white transition text-sm">← Boards</NuxtLink>
      <span class="text-gray-700">/</span>
      <h1 class="text-base font-bold">โปรไฟล์</h1>
    </nav>

    <main class="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <!-- Avatar -->
        <div class="flex flex-col items-center gap-4">
          <div class="relative">
            <img
              v-if="profile?.avatarUrl"
              :src="avatarFullUrl(profile.avatarUrl)"
              class="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
              alt="avatar"
            />
            <div
              v-else
              class="w-24 h-24 rounded-full bg-indigo-700 flex items-center justify-center text-3xl font-bold border-2 border-indigo-500"
            >
              {{ getInitials() }}
            </div>
            <button
              @click="avatarInput?.click()"
              :disabled="uploadingAvatar"
              class="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center text-xs transition disabled:opacity-50"
            >
              {{ uploadingAvatar ? '...' : '✎' }}
            </button>
          </div>
          <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
          <p class="text-gray-500 text-xs">JPG, PNG, WebP ขนาดไม่เกิน 2MB</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1.5">ชื่อ-นามสกุล</label>
            <input
              v-model="form.fullName"
              type="text"
              placeholder="Tinnaphat Pan"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1.5">อีเมล</label>
            <input
              :value="profile?.email"
              type="email"
              disabled
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-500 outline-none cursor-not-allowed"
            />
          </div>
          <p v-if="successMsg" class="text-green-400 text-sm">{{ successMsg }}</p>
          <p v-if="errorMsg" class="text-red-400 text-sm">{{ errorMsg }}</p>
          <button
            type="submit"
            :disabled="saving"
            class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
          >
            {{ saving ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>
