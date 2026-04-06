<script setup lang="ts">
interface Props {
  title?: string
  backTo?: string
  backLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Task Board',
  backTo: '',
  backLabel: '←',
})

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)
</script>

<template>
  <nav class="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 z-30">
    <div class="flex items-center gap-2 sm:gap-3 min-w-0">
      <NuxtLink v-if="backTo" :to="backTo" class="text-gray-400 hover:text-white transition text-sm shrink-0">
        {{ backLabel }}
      </NuxtLink>
      <span v-if="backTo" class="text-gray-700 shrink-0">/</span>
      <h1 class="text-base font-bold text-white truncate">{{ title }}</h1>
    </div>

    <!-- Desktop slot -->
    <div class="hidden sm:flex items-center gap-2">
      <slot name="actions" />
      <NuxtLink to="/notifications" class="relative text-gray-400 hover:text-white transition p-1">
        🔔
      </NuxtLink>
      <NuxtLink to="/profile" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition ml-2">
        <div class="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
          {{ (authStore.user?.fullName || authStore.user?.email || '?')[0].toUpperCase() }}
        </div>
      </NuxtLink>
      <button @click="authStore.logout()" class="text-sm text-gray-500 hover:text-white transition">ออก</button>
    </div>

    <!-- Mobile hamburger -->
    <button class="sm:hidden p-2 text-gray-400 hover:text-white transition" @click="mobileMenuOpen = !mobileMenuOpen">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="absolute top-14 left-0 right-0 bg-gray-900 border-b border-gray-800 px-4 py-3 flex flex-col gap-3 sm:hidden z-40">
      <slot name="actions-mobile" />
      <slot name="actions" />
      <div class="border-t border-gray-800 pt-3 flex items-center justify-between">
        <NuxtLink to="/profile" class="text-sm text-gray-400 hover:text-white transition" @click="mobileMenuOpen = false">
          {{ authStore.user?.fullName || authStore.user?.email }}
        </NuxtLink>
        <button @click="authStore.logout()" class="text-sm text-red-400 hover:text-red-300 transition">ออกจากระบบ</button>
      </div>
    </div>
  </nav>
</template>
