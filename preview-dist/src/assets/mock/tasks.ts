import type { Task } from '@/types/task'

export const mockTasks: Task[] = [
  {
    id: '1',
    title: '开幕式场地布置检查',
    description: '检查开幕式主会场座位、舞台、灯光、音响等设施的布置情况',
    date: '2026-03-18',
    priority: 'high',
    status: 'pending',
    location: '主体育场'
  },
  {
    id: '2',
    title: '志愿者培训会议',
    description: '组织志愿者进行基础礼仪和应急处理培训',
    date: '2026-03-18',
    priority: 'medium',
    status: 'in-progress',
    location: '培训中心',
    checkInTime: '08:30'
  },
  {
    id: '3',
    title: '媒体中心设备调试',
    description: '配合技术团队完成媒体转播设备的最终调试',
    date: '2026-03-18',
    priority: 'high',
    status: 'pending',
    location: '媒体中心'
  },
  {
    id: '4',
    title: '运动员住宿区安全检查',
    description: '对运动员村的消防设施、监控系统进行全面检查',
    date: '2026-03-19',
    priority: 'high',
    status: 'pending',
    location: '运动员村'
  },
  {
    id: '5',
    title: '餐饮供应商协调会',
    description: '与餐饮供应商确认比赛期间的供餐计划',
    date: '2026-03-19',
    priority: 'medium',
    status: 'pending',
    location: '会议中心'
  },
  {
    id: '6',
    title: '交通路线踩点',
    description: '确认赛事期间的运动员、官员专用交通路线',
    date: '2026-03-20',
    priority: 'medium',
    status: 'pending',
    location: '各赛场'
  },
  {
    id: '7',
    title: '医疗急救演练',
    description: '组织医疗团队进行突发伤病急救演练',
    date: '2026-03-20',
    priority: 'high',
    status: 'pending',
    location: '综合体育馆'
  },
  {
    id: '8',
    title: '开幕式彩排协调',
    description: '协调各部门配合开幕式彩排工作',
    date: '2026-03-21',
    priority: 'high',
    status: 'pending',
    location: '主体育场'
  },
  {
    id: '9',
    title: '安保方案最终确认',
    description: '与安保团队确认各比赛场馆的安保方案',
    date: '2026-03-21',
    priority: 'high',
    status: 'pending',
    location: '安保中心'
  },
  {
    id: '10',
    title: '后勤物资分发',
    description: '向工作人员分发工作证、服装等后勤物资',
    date: '2026-03-22',
    priority: 'low',
    status: 'pending',
    location: '物资中心'
  }
]
