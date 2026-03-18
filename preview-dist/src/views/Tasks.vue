<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import ClockButton from '@/components/tasks/ClockButton.vue'
import TaskList from '@/components/tasks/TaskList.vue'
import TaskTimeline from '@/components/tasks/TaskTimeline.vue'

const tasksStore = useTasksStore()

const selectedDate = ref(new Date().toISOString().split('T')[0])
const activeTab = ref('today') // 'today', 'pending', 'in-progress', 'completed', 'timeline'

// 计算所有日期的唯一列表
const allDates = computed(() => {
  const dates = new Set(tasksStore.tasks.map(t => t.date))
  return Array.from(dates).sort()
})

const completionRate = computed(() => tasksStore.completionRate)

const tabLabels = {
  'today': '今日任务',
  'pending': '待办',
  'in-progress': '进行中',
  'completed': '已完成',
  'timeline': '时间线'
}

function handleDateChange(event: Event) {
  const target = event.target as HTMLInputElement
  selectedDate.value = target.value
  tasksStore.setCurrentDate(target.value)
}

function setTab(tab: string) {
  activeTab.value = tab
}

// 请求通知权限
async function requestNotificationPermission() {
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }
}

// 检查任务提醒
function checkTaskReminders() {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const currentHour = now.getHours()

  // 在早上9点提醒今日任务
  if (currentHour === 9) {
    const todayTasks = tasksStore.tasks.filter(t =>
      t.date === today && t.status !== 'completed'
    )

    if (todayTasks.length > 0 && Notification.permission === 'granted') {
      new Notification('今天有未完成的任务', {
        body: `您今天还有 ${todayTasks.length} 个任务待处理`,
        icon: '/icon.png'
      })
    }
  }
}

onMounted(() => {
  requestNotificationPermission()

  // 每小时检查一次任务提醒
  setInterval(checkTaskReminders, 3600000)

  // 立即检查一次
  checkTaskReminders()
})

// 监听日期变化
watch(selectedDate, (newDate) => {
  tasksStore.setCurrentDate(newDate)
})
</script>

<template>
  <div class="tasks-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">任务打卡</h1>
        <p class="page-subtitle">管理您的每日任务，记录工作时间</p>
      </div>

      <ClockButton />
    </header>

    <!-- 统计信息 -->
    <section class="stats-section">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ completionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <div class="stat-value">{{ tasksStore.pendingTasks.length }}</div>
          <div class="stat-label">待办任务</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🔄</div>
        <div class="stat-content">
          <div class="stat-value">{{ tasksStore.inProgressTasks.length }}</div>
          <div class="stat-label">进行中</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ tasksStore.completedTasks.length }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
    </section>

    <!-- 进度条 -->
    <section class="progress-section">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: completionRate + '%' }"
        ></div>
      </div>
      <div class="progress-label">任务进度</div>
    </section>

    <!-- 日期选择器 -->
    <section class="date-section">
      <label for="date-picker" class="date-label">选择日期：</label>
      <input
        id="date-picker"
        type="date"
        v-model="selectedDate"
        @change="handleDateChange"
        class="date-picker"
      />
    </section>

    <!-- 标签页 -->
    <nav class="tabs">
      <button
        v-for="(label, tab) in tabLabels"
        :key="tab"
        @click="setTab(tab)"
        class="tab-button"
        :class="{ active: activeTab === tab }"
      >
        {{ label }}
      </button>
    </nav>

    <!-- 任务列表 -->
    <main class="tasks-content">
      <template v-if="activeTab === 'today'">
        <TaskList :date="selectedDate" />
      </template>

      <template v-else-if="activeTab === 'pending'">
        <TaskList status="pending" />
      </template>

      <template v-else-if="activeTab === 'in-progress'">
        <TaskList status="in-progress" />
      </template>

      <template v-else-if="activeTab === 'completed'">
        <TaskList status="completed" />
      </template>

      <template v-else-if="activeTab === 'timeline'">
        <TaskTimeline />
      </template>
    </main>
  </div>
</template>

<style scoped>
.tasks-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 3px solid #FF6B35;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FF6B35;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.progress-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B35 0%, #ff8c5a 100%);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-label {
  text-align: center;
  font-weight: 600;
  color: #666;
}

.date-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.date-label {
  font-weight: 600;
  color: #333;
}

.date-picker {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.date-picker:focus {
  outline: none;
  border-color: #FF6B35;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.tab-button:hover {
  background: #f5f5f5;
  color: #FF6B35;
}

.tab-button.active {
  background: #FF6B35;
  color: white;
}

.tasks-content {
  min-height: 400px;
}

@media (max-width: 768px) {
  .tasks-page {
    padding: 1rem 0.5rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .date-section {
    flex-direction: column;
    align-items: stretch;
  }

  .tabs {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1;
    min-width: 80px;
  }
}
</style>
