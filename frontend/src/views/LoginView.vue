<script setup lang="ts">
import FormLabel from '@/components/FormLabel.vue'
import GreenInput from '@/components/GreenInput.vue'
</script>

<template>
  <div class="">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />
    <div class="flex flex-col gap-4 px-14">
      <div>
        <FormLabel label="Username"></FormLabel>
        <GreenInput></GreenInput>
      </div>
    </div>
  </div>
</template>
