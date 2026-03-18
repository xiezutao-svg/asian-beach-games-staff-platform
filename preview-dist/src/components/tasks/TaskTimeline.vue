<script setup lang="ts">
import { computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'

const tasksStore = useTasksStore()

// 获取所有有日期的任务并按日期分组
const tasksByDate = computed(() => {
  const grouped: Record<string, any[]> = {}
  tasksStore.tasks.forEach(task => {
    if (!grouped[task.date]) {
      grouped[task.date] = []
    }
    grouped[task.date].push(task)
  })

  // 按日期排序
  const sortedDates = Object.keys(grouped).sort()
  const result: any[] = []
  sortedDates.forEach(date => {
    result.push({
      date,
      tasks: grouped[date]
    })
  })

  return result
})

const totalDays = computed(() => tasksByDate.value.length)
</script>

<template>
  <div class="task-timeline">
    <h2 class="timeline-title">任务时间线</h2>

    <div v-if="totalDays > 0" class="timeline-container">
      <div
        v-for="(dayTasks, index) in tasksByDate"
        :key="dayTasks.date"
        class="timeline-day"
      >
        <div class="timeline-header">
          <div class="date-badge">{{ dayTasks.date }}</div>
          <div class="task-count">{{ dayTasks.tasks.length }} 个任务</div>
        </div>

        <div class="timeline-items">
          <div
            v-for="(task, taskIndex) in dayTasks.tasks"
            :key="task.id"
            class="timeline-item"
            :class="{
              'is-first': taskIndex === 0,
              'is-last': taskIndex === dayTasks.tasks.length - 1,
              [`status-${task.status}`]: true
            }"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-item-header">
                <h4 class="timeline-title">{{ task.title }}</h4>
                <span class="timeline-time">{{ task.date }}</span>
              </div>
              <p class="timeline-desc">{{ task.description }}</p>
              <div class="timeline-meta">
                <span class="timeline-status">{{ task.status }}</span>
                <span v-if="task.checkInTime" class="timeline-check-in">
                  签到: {{ task.checkInTime }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">📅</span>
      <p>暂无任务安排</p>
    </div>
  </div>
</template>

<style scoped>
.task-timeline {
  margin-bottom: 2rem;
}

.timeline-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #FF6B35;
}

.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-day {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.date-badge {
  background: #FF6B35;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1rem;
}

.task-count {
  color: #666;
  font-size: 0.875rem;
}

.timeline-items {
  position: relative;
  padding-left: 1.5rem;
}

.timeline-items::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -1.5rem;
  top: 0.5rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #FF6B35;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #FF6B35;
  transition: all 0.3s ease;
}

.timeline-item.status-pending .timeline-dot {
  background: #95a5a6;
  box-shadow: 0 0 0 2px #95a5a6;
}

.timeline-item.status-in-progress .timeline-dot {
  background: #FF6B35;
  box-shadow: 0 0 0 2px #FF6B35;
}

.timeline-item.status-completed .timeline-dot {
  background: #4CAF50;
  box-shadow: 0 0 0 2px #4CAF50;
}

.timeline-item.is-first .timeline-dot {
  top: 0.5rem;
}

.timeline-content {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  border-left: 3px solid #FF6B35;
}

.timeline-item.status-pending .timeline-content {
  border-left-color: #95a5a6;
}

.timeline-item.status-in-progress .timeline-content {
  border-left-color: #FF6B35;
  background: linear-gradient(to right, #fff5eb, #f9f9f9);
}

.timeline-item.status-completed .timeline-content {
  border-left-color: #4CAF50;
}

.timeline-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.timeline-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.timeline-time {
  font-size: 0.75rem;
  color: #999;
  white-space: nowrap;
}

.timeline-desc {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.timeline-meta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.timeline-status,
.timeline-check-in {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.timeline-status {
  background: #e0e0e0;
  color: #666;
}

.timeline-item.status-pending .timeline-status {
  background: #e0e0e0;
  color: #666;
}

.timeline-item.status-in-progress .timeline-status {
  background: #FF6B35;
  color: white;
}

.timeline-item.status-completed .timeline-status {
  background: #4CAF50;
  color: white;
}

.timeline-check-in {
  background: #e3f2fd;
  color: #1976d2;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  border: 2px dashed #ddd;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #999;
  font-size: 1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .timeline-item-header {
    flex-direction: column;
    gap: 0.25rem;
  }

  .timeline-time {
    font-size: 0.875rem;
  }
}
</style>
