import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Report } from '@/types/report'
import { mockReports } from '@/assets/mock/reports'

const STORAGE_KEY = 'asha-reports'

export const useReportsStore = defineStore('reports', () => {
  const reports = ref<Report[]>([])
  const isLoading = ref(false)

  // 初始化：从 localStorage 加载数据，如果没有则使用 mock 数据
  function init() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        reports.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored reports:', e)
        reports.value = [...mockReports]
      }
    } else {
      reports.value = [...mockReports]
      saveToStorage()
    }
  }

  // 保存到 localStorage
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports.value))
  }

  // 获取所有报告（按日期降序排序）
  const sortedReports = computed(() => {
    return [...reports.value].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  })

  // 添加报告
  function addReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    const newReport: Report = {
      ...report,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    }
    reports.value.push(newReport)
    saveToStorage()
    return newReport
  }

  // 更新报告
  function updateReport(id: string, updates: Partial<Report>) {
    const index = reports.value.findIndex(r => r.id === id)
    if (index !== -1) {
      reports.value[index] = {
        ...reports.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToStorage()
      return reports.value[index]
    }
    return null
  }

  // 删除报告
  function deleteReport(id: string) {
    const index = reports.value.findIndex(r => r.id === id)
    if (index !== -1) {
      reports.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  // 获取单个报告
  function getReportById(id: string) {
    return reports.value.find(r => r.id === id)
  }

  // 搜索报告
  function searchReports(query: string) {
    if (!query.trim()) {
      return sortedReports.value
    }
    const lowerQuery = query.toLowerCase()
    return sortedReports.value.filter(report =>
      report.title.toLowerCase().includes(lowerQuery) ||
      report.content.toLowerCase().includes(lowerQuery)
    )
  }

  // 重置为 mock 数据
  function resetToMock() {
    reports.value = [...mockReports]
    saveToStorage()
  }

  // 清空所有数据
  function clearAll() {
    reports.value = []
    saveToStorage()
  }

  return {
    reports,
    isLoading,
    sortedReports,
    init,
    addReport,
    updateReport,
    deleteReport,
    getReportById,
    searchReports,
    resetToMock,
    clearAll
  }
})
