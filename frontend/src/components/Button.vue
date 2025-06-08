<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Default Label',
    },
    classes: {
      type: String,
      default: '',
    },
  },
}
</script>

<template>
  <button class="bg-green-400 text-white font-inter rounded-base shadow-lg w-full">
    {{ label }}
  </button>
</template>

<style scoped>
button {
  height: 48px;
}
</style>
