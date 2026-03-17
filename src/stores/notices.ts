import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notice, NoticeType } from '../types/notice'
import { mockNotices } from '../assets/mock/notices'

export const useNoticesStore = defineStore('notices', () => {
  // 状态
  const notices = ref<Notice[]>([...mockNotices])
  const currentFilter = ref<NoticeType | 'all'>('all')
  const selectedNotice = ref<Notice | null>(null)
  const showDetail = ref(false)

  // 计算属性
  const filteredNotices = computed(() => {
    const filtered = currentFilter.value === 'all'
      ? notices.value
      : notices.value.filter(notice => notice.type === currentFilter.value)

    // 按日期倒序排序
    return filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  })

  const unreadCount = computed(() => {
    return notices.value.filter(notice => !notice.read).length
  })

  const unreadCountByType = computed(() => {
    return {
      announcement: notices.value.filter(n => n.type === 'announcement' && !n.read).length,
      notification: notices.value.filter(n => n.type === 'notification' && !n.read).length,
      event: notices.value.filter(n => n.type === 'event' && !n.read).length
    }
  })

  // 方法
  function setFilter(filter: NoticeType | 'all') {
    currentFilter.value = filter
  }

  function markAsRead(id: string) {
    const notice = notices.value.find(n => n.id === id)
    if (notice) {
      notice.read = true
    }
  }

  function markAllAsRead() {
    notices.value.forEach(notice => {
      notice.read = true
    })
  }

  function showNoticeDetail(notice: Notice) {
    selectedNotice.value = notice
    showDetail.value = true
    // 自动标记为已读
    markAsRead(notice.id)
  }

  function closeNoticeDetail() {
    showDetail.value = false
    selectedNotice.value = null
  }

  function hasUnreadInType(type: NoticeType): boolean {
    return unreadCountByType.value[type] > 0
  }

  return {
    notices,
    currentFilter,
    selectedNotice,
    showDetail,
    filteredNotices,
    unreadCount,
    unreadCountByType,
    setFilter,
    markAsRead,
    markAllAsRead,
    showNoticeDetail,
    closeNoticeDetail,
    hasUnreadInType
  }
})
