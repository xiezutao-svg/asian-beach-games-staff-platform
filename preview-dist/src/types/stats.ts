export interface VenueStats {
  id: string
  name: string
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  pendingTasks: number
}

export interface OverallStats {
  totalVenues: number
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  pendingTasks: number
  attendanceRate: number
}

export interface DailyStats {
  date: string
  completedTasks: number
  attendance: number
}
