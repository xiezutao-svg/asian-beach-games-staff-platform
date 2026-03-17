import type { VenueStats, OverallStats, DailyStats } from '../../types/stats'

// 模拟场馆统计数据
export const mockVenueStats: VenueStats[] = [
  {
    id: '1',
    name: '沙滩排球馆',
    totalTasks: 45,
    completedTasks: 38,
    inProgressTasks: 5,
    pendingTasks: 2
  },
  {
    id: '2',
    name: '沙滩篮球馆',
    totalTasks: 52,
    completedTasks: 42,
    inProgressTasks: 6,
    pendingTasks: 4
  },
  {
    id: '3',
    name: '沙滩足球馆',
    totalTasks: 38,
    completedTasks: 35,
    inProgressTasks: 2,
    pendingTasks: 1
  },
  {
    id: '4',
    name: '沙滩手球馆',
    totalTasks: 41,
    completedTasks: 32,
    inProgressTasks: 7,
    pendingTasks: 2
  },
  {
    id: '5',
    name: '沙滩网球馆',
    totalTasks: 36,
    completedTasks: 28,
    inProgressTasks: 5,
    pendingTasks: 3
  }
]

// 模拟总览统计数据
export const mockOverallStats: OverallStats = {
  totalVenues: 5,
  totalTasks: 212,
  completedTasks: 175,
  inProgressTasks: 25,
  pendingTasks: 12,
  attendanceRate: 92.5
}

// 模拟每日统计数据
export const mockDailyStats: DailyStats[] = [
  { date: '3-12', completedTasks: 32, attendance: 88 },
  { date: '3-13', completedTasks: 35, attendance: 90 },
  { date: '3-14', completedTasks: 38, attendance: 91 },
  { date: '3-15', completedTasks: 42, attendance: 92 },
  { date: '3-16', completedTasks: 45, attendance: 93 },
  { date: '3-17', completedTasks: 48, attendance: 95 }
]

// 模拟实时数据生成
export const generateRandomStats = () => {
  const venues = mockVenueStats.map(venue => ({
    ...venue,
    completedTasks: Math.min(venue.totalTasks, Math.max(0, venue.completedTasks + Math.floor(Math.random() * 3) - 1))
  }))

  const totalTasks = venues.reduce((sum, v) => sum + v.totalTasks, 0)
  const completedTasks = venues.reduce((sum, v) => sum + v.completedTasks, 0)
  const inProgressTasks = venues.reduce((sum, v) => sum + v.inProgressTasks, 0)
  const pendingTasks = totalTasks - completedTasks - inProgressTasks

  return {
    venues,
    overall: {
      totalVenues: venues.length,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      attendanceRate: 90 + Math.random() * 10
    } as OverallStats
  }
}
