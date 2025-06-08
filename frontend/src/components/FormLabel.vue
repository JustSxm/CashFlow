<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Default Label',
    },
  },
}
</script>

<template>
  <label class="font-inter text-black/50 font-medium">{{ label }}</label>
</template>
