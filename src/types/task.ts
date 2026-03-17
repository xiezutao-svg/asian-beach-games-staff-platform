export interface Task {
  id: string
  title: string
  description: string
  date: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  location?: string
  checkInTime?: string
  checkOutTime?: string
}

export interface ClockRecord {
  id: string
  date: string
  checkInTime: string
  checkOutTime?: string
  location?: string
  duration?: number
}
