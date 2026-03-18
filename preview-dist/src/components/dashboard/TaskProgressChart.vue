<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
    </div>
    <div ref="chartRef" class="chart" :style="{ height: height }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

interface Props {
  title: string
  data: any[]
  chartType: 'pie' | 'bar' | 'line'
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '300px'
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const getChartOption = () => {
  const { chartType, data } = props

  if (chartType === 'pie') {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        textStyle: {
          color: '#666'
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold'
            }
          },
          data: data
        }
      ]
    }
  } else if (chartType === 'bar') {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map((item: any) => item.name),
        axisLabel: {
          color: '#666'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#666'
        }
      },
      series: [
        {
          type: 'bar',
          data: data.map((item: any) => item.value),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#FF6B35' },
              { offset: 1, color: '#FF8C61' }
            ]),
            borderRadius: [8, 8, 0, 0]
          },
          barWidth: '60%'
        }
      ]
    }
  } else if (chartType === 'line') {
    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['完成任务', '出勤率'],
        bottom: 0,
        textStyle: {
          color: '#666'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map((item: any) => item.date),
        axisLabel: {
          color: '#666'
        },
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#666'
        }
      },
      series: [
        {
          name: '完成任务',
          type: 'line',
          smooth: true,
          data: data.map((item: any) => item.completedTasks),
          itemStyle: {
            color: '#FF6B35'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 107, 53, 0.3)' },
              { offset: 1, color: 'rgba(255, 107, 53, 0.05)' }
            ])
          }
        },
        {
          name: '出勤率',
          type: 'line',
          smooth: true,
          data: data.map((item: any) => item.attendance),
          itemStyle: {
            color: '#67C23A'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
              { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
            ])
          }
        }
      ]
    }
  }

  return {}
}

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(getChartOption())

  // 响应式调整
  const resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize()
  })
  resizeObserver.observe(chartRef.value)

  return resizeObserver
}

onMounted(() => {
  const resizeObserver = initChart()

  onUnmounted(() => {
    resizeObserver?.disconnect()
    chartInstance?.dispose()
  })
})

watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.setOption(getChartOption())
  }
}, { deep: true })
</script>

<style scoped>
.chart-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
}

.chart-header {
  margin-bottom: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.chart {
  width: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 16px;
  }

  .chart-title {
    font-size: 14px;
  }
}
</style>
