<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
const props = defineProps<{
  label?: string
  loading?: boolean
  class?: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  if (!props.loading) {
    emit('click')
  }
}
</script>

<template>
  <button
    :class="[
      props.class ?? '',
      ' text-white font-inter rounded-base shadow-lg w-full transition-colors duration-200',
      props.loading ? 'cursor-not-allowed bg-green-300' : 'cursor-pointer active:scale-95 active:bg-green-300 bg-green-400',
    ]"
    :disabled="props.loading ?? false"
    @click="handleClick"
  >
    <span v-if="props.loading" class="loader"><LoaderCircle></LoaderCircle></span>
    <span v-else-if="props.label != null">{{ props.label }}</span>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
button {
  height: 48px;
}

/* loader animation */
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader > svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
