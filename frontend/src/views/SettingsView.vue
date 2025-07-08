<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue'
import { ArrowRight, Calendar, CircleUser } from 'lucide-vue-next'
import { RouteNames } from '@/router'
import Toggle from '@/components/Toggle.vue'
import { onMounted, ref } from 'vue'
import GrayInput from '@/components/GrayInput.vue'
import GrayDropdown from '@/components/GrayDropdown.vue'
import { ApiEndpoints } from '@/enums/APIEndpoints'
import { SettingsDTO, Settings } from '@shared/Settings'
import { fetchWithAuth } from '@/fetchWithAuth'

let savingMode = ref(false)
let percentage = ref('0')
let startOfWeek = ref(1)
let defaultDashboardView = ref(1)

async function updateSettings() {
  const settings: SettingsDTO = {
    savingMode: savingMode.value,
    percentage: parseInt(percentage.value),
    startOfTheWeek: startOfWeek.value,
    defaultDashboardView: defaultDashboardView.value,
  }

  await fetchWithAuth(ApiEndpoints.SETTINGS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  })
}

async function fetchSettings() {
  const response = await fetchWithAuth(ApiEndpoints.SETTINGS)
  const settings: Settings = await response.json()

  savingMode.value = settings.saving_mode
  percentage.value = settings.percentage.toString()
  startOfWeek.value = settings.start_of_the_week
  defaultDashboardView.value = settings.default_dashboard_view
}

onMounted(() => {
  fetchSettings()
})
</script>

<template>
  <div class="py-2 px-4">
    <BackButton :link="RouteNames.Dashboard" />
  </div>
  <div class="px-4">
    <RouterLink to="/accounts">
      <hr class="my-4 border-gray-300" />
      <div>
        <div class="flex gap-3 items-center">
          <CircleUser class="w-8 h-8 text-gray-500" stroke-width="1" />
          <h1 class="text-xl font-inter text-black">Accounts</h1>
          <ArrowRight class="w-6 h-6 text-gray-500 ml-auto" />
        </div>
      </div>
      <hr class="my-4 border-gray-300" />
    </RouterLink>
    <div class="flex flex-nowrap">
      <div>
        <h1 class="font-inter">Saving Mode</h1>
        <span class="font-inter text-sm text-black/50">Automatically withhold a percentage of incoming money for savings </span>
      </div>
      <div class="my-auto">
        <Toggle v-model="savingMode" @update:model-value="updateSettings" />
      </div>
    </div>
    <div v-if="savingMode" class="mt-2 flex flex-col">
      <span class="font-inter text-sm text-black">Enter Percentage : </span>
      <div class="w-1/2">
        <GrayInput :type="'number'" placeholder="0" v-model="percentage" @update:model-value="updateSettings" />
      </div>
    </div>
    <div class="flex flex-col mt-8">
      <div>
        <h1 class="font-inter">Start Of The Week</h1>
        <span class="font-inter text-sm text-black/50"
          >Choose which day the week starts on. This will determine when your weekly income and expenses reset.</span
        >
      </div>
      <div class="mt-2">
        <GrayDropdown
          placeholder="Select a day"
          :options="[
            { label: 'Monday', value: 1, icon: Calendar },
            { label: 'Tuesday', value: 2, icon: Calendar },
            { label: 'Wednesday', value: 3, icon: Calendar },
            { label: 'Thursday', value: 4, icon: Calendar },
            { label: 'Friday', value: 5, icon: Calendar },
            { label: 'Saturday', value: 6, icon: Calendar },
            { label: 'Sunday', value: 7, icon: Calendar },
          ]"
          v-model="startOfWeek"
          @update:model-value="updateSettings"
        />
      </div>
    </div>
    <div class="flex flex-col mt-8">
      <div>
        <h1 class="font-inter">Default Dashboard View</h1>
        <span class="font-inter text-sm text-black/50">Select the default time range shown on your dashboard</span>
      </div>
      <div class="mt-2">
        <GrayDropdown
          placeholder="Select a day"
          :options="[
            { label: '1 Week', value: 1, icon: Calendar },
            { label: '2 Weeks', value: 2, icon: Calendar },
            { label: '1 Month', value: 3, icon: Calendar },
            { label: '3 Months', value: 4, icon: Calendar },
            { label: '6 Months', value: 5, icon: Calendar },
            { label: '1 Year', value: 6, icon: Calendar },
            { label: 'All', value: 7, icon: Calendar },
          ]"
          v-model="defaultDashboardView"
          @update:model-value="updateSettings"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
