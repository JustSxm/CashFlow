<script setup lang="ts">
import { Chart as ChartJS, LinearScale, PointElement, LineElement, type ChartOptions, type ChartData, type Plugin, Filler } from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(LinearScale, PointElement, LineElement, Filler)

const accountFluctuations = [
  1000, 1120, 1025, 1087, 1230, 1160, 1215, 1060, 985, 1140, 1090, 1035, 1115, 1010, 1195, 1110, 1250, 1175, 1305, 1350,
]
const dataPoints = accountFluctuations.map((y, x) => ({ x, y }))

const data: ChartData<'line'> = {
  datasets: [
    {
      data: dataPoints,
      fill: true,
      backgroundColor: (context) => {
        const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height)
        gradient.addColorStop(0, 'rgba(48, 177, 15, 0.4)')

        gradient.addColorStop(1, 'rgba(164, 250, 142, 0)')
        return gradient
      },
      borderColor: 'rgba(48, 177, 15, 1)',
      tension: 0,
      yAxisID: 'y',
      xAxisID: 'x',
    },
  ],
}

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 5,
      left: 48,
      right: 48,
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
      max: accountFluctuations.length - 1,
    },
    y: {
      display: false,
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
}
</script>

<template>
  <Line :data="data" :options="options" />
</template>
