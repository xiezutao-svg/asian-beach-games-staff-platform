<script setup lang="ts">
import { computed } from 'vue'
import TaskCard from './TaskCard.vue'
import { useTasksStore } from '@/stores/tasks'

interface Props {
  date?: string
  status?: 'pending' | 'in-progress' | 'completed'
}

const props = defineProps<Props>()

const tasksStore = useTasksStore()

const displayedTasks = computed(() => {
  let tasks = tasksStore.tasks

  if (props.date) {
    tasks = tasks.filter(t => t.date === props.date)
  }

  if (props.status) {
    tasks = tasks.filter(t => t.status === props.status)
  }

  // 按优先级排序：高 -> 中 -> 低
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
})

const taskCount = computed(() => displayedTasks.value.length)
const taskCountText = computed(() => {
  if (props.status === 'pending') return `待办任务 (${taskCount.value})`
  if (props.status === 'in-progress') return `进行中 (${taskCount.value})`
  if (props.status === 'completed') return `已完成 (${taskCount.value})`
  return `所有任务 (${taskCount.value})`
})
</script>

<template>
  <div class="task-list">
    <h2 class="task-list-title">{{ taskCountText }}</h2>

    <div v-if="taskCount > 0" class="tasks-container">
      <TaskCard
        v-for="task in displayedTasks"
        :key="task.id"
        :task="task"
      />
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">📋</span>
      <p>暂无任务</p>
    </div>
  </div>
</template>

<style scoped>
.task-list {
  margin-bottom: 2rem;
}

.task-list-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #FF6B35;
}

.tasks-container {
  /* Empty block */
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
</style>
