<template>
  <slot v-if="isMounted" />
  <div v-else class="w-full h-64 bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-400">
    Memuat peta interaktif...
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>
