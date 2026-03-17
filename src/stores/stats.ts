import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { VenueStats, OverallStats, DailyStats } from '../types/stats'
import { mockVenueStats, mockOverallStats, mockDailyStats, generateRandomStats } from '../assets/mock/stats'

export const useStatsStore = defineStore('stats', () => {
  // 状态
  const venueStats = ref<VenueStats[]>([...mockVenueStats])
  const overallStats = ref<OverallStats>({ ...mockOverallStats })
  const dailyStats = ref<DailyStats[]>([...mockDailyStats])
  const lastUpdateTime = ref(new Date())

  // 计算属性
  const completionRate = computed(() => {
    const { totalTasks, completedTasks } = overallStats.value
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  })

  // 方法
  const updateStats = () => {
    const newStats = generateRandomStats()
    venueStats.value = newStats.venues
    overallStats.value = newStats.overall
    lastUpdateTime.value = new Date()
  }

  const getVenueStats = (venueId: string) => {
    return venueStats.value.find(v => v.id === venueId)
  }

  return {
    venueStats,
    overallStats,
    dailyStats,
    lastUpdateTime,
    completionRate,
    updateStats,
    getVenueStats
  }
})
