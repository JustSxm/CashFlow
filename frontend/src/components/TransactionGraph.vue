<script setup lang="ts">
import type { Transaction } from '@shared/Transaction'
import { TransactionTypes } from '@shared/TransactionTypes'
import { Chart as ChartJS, LinearScale, PointElement, LineElement, type ChartOptions, type ChartData, type Plugin, Filler } from 'chart.js'
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

const props = defineProps<{
  up: boolean
  transactions: Transaction[]
}>()

let borderColor = computed(() => {
  return props.up ? 'rgba(48, 177, 15, 1)' : 'rgba(255, 0, 0, 1)'
})

let gradentColor = computed(() => {
  return props.up ? 'rgba(48, 177, 15, 0.4)' : 'rgba(255, 0, 0, 0.4)'
})

let gradientEndColor = computed(() => {
  return props.up ? 'rgba(164, 250, 142, 0.01)' : 'rgba(250, 142, 142, 0.01)'
})

ChartJS.register(LinearScale, PointElement, LineElement, Filler)

const accountFluctuations = computed(() =>
  props.transactions.map((transaction) =>
    transaction.type === TransactionTypes.INCOME ? Number(transaction.amount) : -Number(transaction.amount),
  ),
)

const data = computed<ChartData<'line'>>(() => {
  const dataPoints = accountFluctuations.value.map((y, x) => ({ x, y }))
  return {
    datasets: [
      {
        data: dataPoints,
        fill: 'start',
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height)
          gradient.addColorStop(0, gradentColor.value)
          gradient.addColorStop(1, gradientEndColor.value)
          return gradient
        },
        borderColor: borderColor.value,
        tension: 0,
        yAxisID: 'y',
        xAxisID: 'x',
      },
    ],
  }
})

const options = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 5,
      left: 16,
      right: 16,
      bottom: 0,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      type: 'linear',
      display: false,
      min: 0,
      max: accountFluctuations.value.length - 1,
    },
    y: {
      display: false,
      min: Math.min(...accountFluctuations.value) * 1.1,
    },
  },
  elements: {
    point: {
      radius: 0,
    },
    line: {
      borderWidth: 2,
    },
  },
}))
</script>

<template>
  <Line :data="data" :options="options" />
</template>
