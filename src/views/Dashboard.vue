<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="page-title">亚沙会工作人员任务大屏</h1>
      <div class="dashboard-actions">
        <el-switch
          v-model="autoRefresh"
          active-text="自动刷新"
          @change="toggleAutoRefresh"
        />
        <el-button
          type="primary"
          :icon="Refresh"
          @click="handleManualRefresh"
        >
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <StatsCard
        title="总任务数"
        :value="overallStats.totalTasks"
        icon="calendar"
        trend="今日新增 +12"
        :trend-up="true"
      />
      <StatsCard
        title="已完成任务"
        :value="overallStats.completedTasks"
        icon="check"
        :trend="`${completionRate}%`"
        :trend-up="true"
      />
      <StatsCard
        title="进行中任务"
        :value="overallStats.inProgressTasks"
        icon="loading"
        trend="待处理 12"
        :trend-up="false"
      />
      <StatsCard
        title="出勤率"
        :value="overallStats.attendanceRate.toFixed(1)"
        unit="%"
        icon="timer"
        trend="较昨日 +2.3%"
        :trend-up="true"
      />
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-row">
        <div class="chart-item">
          <TaskProgressChart
            title="任务完成情况"
            :data="pieChartData"
            chart-type="pie"
          />
        </div>
        <div class="chart-item">
          <TaskProgressChart
            title="场馆任务分布"
            :data="barChartData"
            chart-type="bar"
          />
        </div>
      </div>
      <div class="chart-row">
        <div class="chart-item full-width">
          <TaskProgressChart
            title="任务趋势与出勤率"
            :data="dailyStats"
            chart-type="line"
            height="280px"
          />
        </div>
      </div>
    </div>

    <!-- 底部数据区域 -->
    <div class="bottom-section">
      <div class="data-item">
        <RealTimeData
          :venue-data="venueStats"
          :last-update-time="lastUpdateTime"
        />
      </div>
      <div class="data-item">
        <VenueMap
          :venue-data="venueStats"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { useStatsStore } from '../stores/stats'
import StatsCard from '../components/dashboard/StatsCard.vue'
import TaskProgressChart from '../components/dashboard/TaskProgressChart.vue'
import RealTimeData from '../components/dashboard/RealTimeData.vue'
import VenueMap from '../components/dashboard/VenueMap.vue'

const statsStore = useStatsStore()
const autoRefresh = ref(true)
let refreshTimer: NodeJS.Timeout | null = null

const venueStats = computed(() => statsStore.venueStats)
const overallStats = computed(() => statsStore.overallStats)
const dailyStats = computed(() => statsStore.dailyStats)
const completionRate = computed(() => statsStore.completionRate)
const lastUpdateTime = computed(() => statsStore.lastUpdateTime)

const pieChartData = computed(() => [
  { name: '已完成', value: overallStats.value.completedTasks, itemStyle: { color: '#67C23A' } },
  { name: '进行中', value: overallStats.value.inProgressTasks, itemStyle: { color: '#FF6B35' } },
  { name: '待处理', value: overallStats.value.pendingTasks, itemStyle: { color: '#F56C6C' } }
])

const barChartData = computed(() =>
  venueStats.value.map(venue => ({
    name: venue.name.replace('馆', ''),
    value: venue.completedTasks
  }))
)

const handleManualRefresh = () => {
  statsStore.updateStats()
}

const toggleAutoRefresh = (enabled: boolean) => {
  if (enabled) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

const startAutoRefresh = () => {
  if (refreshTimer) return
  refreshTimer = setInterval(() => {
    statsStore.updateStats()
  }, 5000)
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

onMounted(() => {
  if (autoRefresh.value) {
    startAutoRefresh()
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
;
  justify-content: space-between;
;
  align-items: center;
  margin-bottom: 24px;
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  background: linear-gradient(135deg, #FF6B35, #FF8C61);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-actions {
  display: flex;
;
  align-items: center;
  gap: 12px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.charts-section {
  margin-bottom: 24px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-item {
  min-height: 380px;
}

.chart-item.full-width {
  grid-column: span 2;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.data-item {
  min-height: 400px;
}

@media (max-width: 1200px) {
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-row {
    grid-template-columns: 1fr;
  }

  .chart-item.full-width {
    grid-column: span 1;
  }

  .bottom-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .stats-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .chart-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .bottom-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
