import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, ClockRecord } from '@/types/task'
import { mockTasks } from '@/assets/mock/tasks'

export const useTasksStore = defineStore('tasks', () => {
  // 状态
  const tasks = ref<Task[]>([...mockTasks])
  const clockRecords = ref<ClockRecord[]>([])
  const currentDate = ref(new Date().toISOString().split('T')[0])

  // 计算属性
  const tasksByDate = computed(() => {
    const grouped: Record<string, Task[]> = {}
    tasks.value.forEach((task) => {
      if (!grouped[task.date]) {
        grouped[task.date] = []
      }
      grouped[task.date].push(task)
    })
    return grouped
  })

  const todayTasks = computed(() => {
    return tasks.value.filter((task) => task.date === currentDate.value)
  })

  const completedTasks = computed(() => {
    return tasks.value.filter((task) => task.status === 'completed')
  })

  const inProgressTasks = computed(() => {
    return tasks.value.filter((task) => task.status === 'in-progress')
  })

  const pendingTasks = computed(() => {
    return tasks.value.filter((task) => task.status === 'pending')
  })

  const completionRate = computed(() => {
    if (tasks.value.length === 0) return 0
    return Math.round((completedTasks.value.length / tasks.value.length) * 100)
  })

  // 方法
  function addTask(task: Task) {
    tasks.value.push(task)
  }

  function updateTask(id: string, updates: Partial<Task>) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates }
    }
  }

  function deleteTask(id: string) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
  }

  function checkIn(taskId: string, location?: string) {
    const now = new Date()
    const time = now.toTimeString().slice(0, 5)
    updateTask(taskId, { status: 'in-progress', checkInTime: time, location })
  }

  function checkOut(taskId: string) {
    const now = new Date()
    const time = now.toTimeString().slice(0, 5)
    updateTask(taskId, { status: 'completed', checkOutTime: time })
  }

  function markCompleted(taskId: string) {
    updateTask(taskId, { status: 'completed' })
  }

  function markInProgress(taskId: string) {
    updateTask(taskId, { status: 'in-progress' })
  }

  function markPending(taskId: string) {
    updateTask(taskId, { status: 'pending', checkInTime: undefined, checkOutTime: undefined })
  }

  function clockIn(location?: string) {
    const now = new Date()
    const record: ClockRecord = {
      id: Date.now().toString(),
      date: currentDate.value,
      checkInTime: now.toTimeString().slice(0, 5),
      location
    }
    clockRecords.value.push(record)
    return record
  }

  function clockOut(recordId: string) {
    const index = clockRecords.value.findIndex((r) => r.id === recordId)
    if (index !== -1) {
      const now = new Date()
      const checkOutTime = now.toTimeString().slice(0, 5)
      const record = clockRecords.value[index]

      // 计算工时（分钟）
      const [inHours, inMinutes] = record.checkInTime.split(':').map(Number)
      const [outHours, outMinutes] = checkOutTime.split(':').map(Number)
      const duration = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes)

      clockRecords.value[index] = {
        ...record,
        checkOutTime,
        duration: duration > 0 ? duration : 0
      }
    }
  }

  function setCurrentDate(date: string) {
    currentDate.value = date
  }

  return {
    tasks,
    clockRecords,
    currentDate,
    tasksByDate,
    todayTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    completionRate,
    addTask,
    updateTask,
    deleteTask,
    checkIn,
    checkOut,
    markCompleted,
    markInProgress,
    markPending,
    clockIn,
    clockOut,
    setCurrentDate
  }
})
