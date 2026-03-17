<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types/task'
import { useTasksStore } from '@/stores/tasks'

interface Props {
  task: Task
}

const props = defineProps<Props>()
const tasksStore = useTasksStore()

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高'
}

const statusLabels = {
  'pending': '待办',
  'in-progress': '进行中',
  'completed': '已完成'
}

const priorityColors = {
  low: '#95a5a6',
  medium: '#FF6B35',
  high: '#e74c3c'
}

const statusColors = {
  'pending': '#95a5a6',
  'in-progress': '#FF6B35',
  'completed': '#4CAF50'
}

const isCompleted = computed(() => props.task.status === 'completed')
const isInProgress = computed(() => props.task.status === 'in-progress')
const hasCheckedIn = computed(() => !!props.task.checkInTime)

function handleCheckIn() {
  if (hasCheckedIn.value) return
  tasksStore.checkIn(props.task.id, props.task.location)
}

function handleCheckOut() {
  tasksStore.checkOut(props.task.id)
}

function handleToggleComplete() {
  if (isCompleted.value) {
    tasksStore.markPending(props.task.id)
  } else {
    tasksStore.markCompleted(props.task.id)
  }
}
</script>

<template>
  <div class="task-card" :class="{ completed: isCompleted, 'in-progress': isInProgress }">
    <div class="task-header">
      <h3 class="task-title">{{ task.title }}</h3>
      <div class="task-badges">
        <span
          class="badge priority"
          :style="{ backgroundColor: priorityColors[task.priority] }"
        >
          {{ priorityLabels[task.priority] }}优先级
        </span>
        <span
          class="badge status"
          :style="{ backgroundColor: statusColors[task.status] }"
        >
          {{ statusLabels[task.status] }}
        </span>
      </div>
    </div>

    <p class="task-description">{{ task.description }}</p>

    <div class="task-meta">
      <div class="meta-item">
        <span class="icon">📅</span>
        <span>{{ task.date }}</span>
      </div>
      <div v-if="task.location" class="meta-item">
        <span class="icon">📍</span>
        <span>{{ task.location }}</span>
      </div>
    </div>

    <div v-if="task.checkInTime || task.checkOutTime" class="clock-info">
      <div v-if="task.checkInTime" class="clock-time">
        <span class="icon">⏰</span>
        <span>签到: {{ task.checkInTime }}</span>
      </div>
      <div v-if="task.checkOutTime" class="clock-time">
        <span class="icon">🏁</span>
        <span>签退: {{ task.checkOutTime }}</span>
      </div>
    </div>

    <div class="task-actions">
      <button
        v-if="!isCompleted && !isInProgress && !hasCheckedIn"
        @click="handleCheckIn"
        class="action-btn check-in"
      >
        开始任务
      </button>

      <button
        v-if="isInProgress && !task.checkOutTime"
        @click="handleCheckOut"
        class="action-btn check-out"
      >
        完成任务
      </button>

      <button
        @click="handleToggleComplete"
        class="action-btn toggle"
        :class="{ checked: isCompleted }"
      >
        {{ isCompleted ? '取消完成' : '标记完成' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border-left: 4px solid #FF6B35;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.task-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.task-card.completed {
  border-left-color: #4CAF50;
  opacity: 0.7;
}

.task-card.completed .task-title {
  text-decoration: line-through;
}

.task-card['in-progress'] {
  border-left-color: #FF6B35;
  background: linear-gradient(to right, #fff5eb, white);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.task-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.task-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
}

.task-description {
  color: #666;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.task-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #888;
}

.meta-item .icon {
  font-size: 1rem;
}

.clock-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.clock-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.clock-time .icon {
  font-size: 1rem;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.check-in {
  background-color: #FF6B35;
  color: white;
}

.check-in:hover {
  background-color: #e55a2b;
}

.check-out {
  background-color: #4CAF50;
  color: white;
}

.check-out:hover {
  background-color: #45a049;
}

.toggle {
  background-color: white;
  color: #FF6B35;
  border: 2px solid #FF6B35;
}

.toggle:hover {
  background-color: #fff5eb;
}

.toggle.checked {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.toggle.checked:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .task-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .task-badges {
    width: 100%;
  }

  .task-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
