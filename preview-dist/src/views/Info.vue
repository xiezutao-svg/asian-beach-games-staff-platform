<template>
  <div class="info-page">
    <div class="info-container">
      <!-- 顶部：分类标签和未读数量 -->
      <div class="info-header">
        <div class="section-title">
          <h2>公告通知</h2>
          <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="unread-badge">
            <span class="badge-label">未读</span>
          </el-badge>
        </div>

        <div class="filter-tabs">
          <el-button-group>
            <el-button
              :type="currentFilter === 'all' ? 'primary' : ''"
              @click="setFilter('all')"
            >
              全部
              <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="tab-badge" />
            </el-button>
            <el-button
              :type="currentFilter === 'announcement' ? 'primary' : ''"
              @click="setFilter('announcement')"
            >
              公告
              <el-badge :value="unreadCountByType.announcement" :hidden="!hasUnreadInType('announcement')" class="tab-badge" />
            </el-button>
            <el-button
              :type="currentFilter === 'notification' ? 'primary' : ''"
              @click="setFilter('notification')"
            >
              通知
              <el-badge :value="unreadCountByType.notification" :hidden="!hasUnreadInType('notification')" class="tab-badge" />
            </el-button>
            <el-button
              :type="currentFilter === 'event' ? 'primary' : ''"
              @click="setFilter('event')"
            >
              活动
              <el-badge :value="unreadCountByType.event" :hidden="!hasUnreadInType('event')" class="tab-badge" />
            </el-button>
          </el-button-group>

          <el-button
            v-if="unreadCount > 0"
            type="text"
            size="small"
            @click="handleMarkAllRead"
          >
            全部标为已读
          </el-button>
        </div>
      </div>

      <!-- 公告列表 -->
      <div class="notice-section">
        <NoticeList
          :filtered-notices="filteredNotices"
          @notice-click="handleNoticeClick"
          @notice-download="handleNoticeDownload"
        />
      </div>
    </div>

    <!-- 公告详情弹窗 -->
    <el-dialog
      v-model="showDetail"
      title="公告详情"
      :width="800"
      class="notice-detail-dialog"
    >
      <div v-if="selectedNotice" class="notice-detail">
        <div class="detail-header">
          <div class="detail-type" :class="`type-${selectedNotice.type}`">
            {{ getTypeLabel(selectedNotice.type) }}
          </div>
          <div class="detail-date">{{ selectedNotice.date }}</div>
        </div>

        <h3 class="detail-title">{{ selectedNotice.title }}</h3>

        <div class="detail-meta">
          <span class="meta-item">
            <el-icon><User /></el-icon>
            {{ selectedNotice.author }}
          </span>
        </div>

        <div class="detail-content">
          {{ selectedNotice.content }}
        </div>

        <div v-if="selectedNotice.attachment" class="detail-attachment">
          <el-alert
            :title="`附件：${selectedNotice.attachment}`"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <div class="attachment-actions">
                <el-button type="primary" size="small" @click="handleAttachmentDownload(selectedNotice)">
                  <el-icon><Download /></el-icon>
                  下载附件
                </el-button>
              </div>
            </template>
          </el-alert>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Download } from '@element-plus/icons-vue'
import { useNoticesStore } from '@/stores/notices'
import { NoticeType } from '../types/notice'
import NoticeList from '../components/info/NoticeList.vue'

const noticesStore = useNoticesStore()

// 从 store 获取状态
const currentFilter = computed(() => noticesStore.currentFilter)
const filteredNotices = computed(() => noticesStore.filteredNotices)
const unreadCount = computed(() => noticesStore.unreadCount)
const unreadCountByType = computed(() => noticesStore.unreadCountByType)
const selectedNotice = computed(() => noticesStore.selectedNotice)
const showDetail = computed({
  get: () => noticesStore.showDetail,
  set: (value) => {
    if (!value) {
      noticesStore.closeNoticeDetail()
    }
  }
})

// 方法
function setFilter(filter: NoticeType | 'all') {
  noticesStore.setFilter(filter)
}

function handleNoticeClick(notice: any) {
  noticesStore.showNoticeDetail(notice)
}

function handleNoticeDownload(notice: any) {
  // 模拟下载
  simulateDownload(notice.title, notice.attachment)
}

function handleAttachmentDownload(notice: any) {
  simulateDownload(notice.title, notice.attachment)
}

function handleMarkAllRead() {
  noticesStore.markAllAsRead()
  ElMessage.success('已全部标记为已读')
}

function hasUnreadInType(type: NoticeType): boolean {
  return noticesStore.hasUnreadInType(type)
}

function getTypeLabel(type: string): string {
  const typeMap = {
    announcement: '公告',
    notification: '通知',
    event: '活动'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

function simulateDownload(title: string, attachment?: string) {
  // 模拟下载过程
  const loading = ElMessage.info('正在准备下载...', {
    duration: 1000
  })

  setTimeout(() => {
    loading.close()
    const fileName = attachment || `${title}.pdf`
    ElMessage.success(`已开始下载：${fileName}`)

    // 在实际项目中，这里应该触发真实的文件下载
    console.log('模拟下载文件:', fileName)
  }, 1000)
}
</script>

<style scoped lang="scss">
.info-page {
  min-height: 100vh;
  padding: $header-height + $spacing-lg $spacing-lg $spacing-lg;
  background: $bg-secondary;
}

.info-container {
  max-width: $breakpoint-desktop;
  margin: 0 auto;
}

.info-header {
  background: $bg-primary;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-sm;

  .section-title {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;

    h2 {
      font-size: $font-size-xxl;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
    }

    .unread-badge {
      :deep(.el-badge__content) {
        background: $primary-orange;
      }
    }
  }

  .filter-tabs {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    flex-wrap: wrap;

    :deep(.el-button-group .el-button) {
      padding: $spacing-sm $spacing-lg;
      font-weight: 500;

      .el-badge {
        margin-left: $spacing-xs;

        :deep(.el-badge__content) {
          font-size: 10px;
          height: 16px;
          line-height: 16px;
          min-width: 16px;
        }
      }
    }
  }
}

.notice-section {
  background: transparent;
}

.notice-detail-dialog {
  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, $primary-orange, $dark-orange);
    color: $text-white;
    padding: $spacing-lg;
    margin: 0;

    .el-dialog__title {
      color: $text-white;
      font-weight: 600;
    }
  }

  :deep(.el-dialog__body) {
    padding: $spacing-lg;
  }
}

.notice-detail {
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    gap: $spacing-md;

    .detail-type {
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-sm;
      font-size: $font-size-sm;
      font-weight: 500;

      &.type-announcement {
        background: rgba(255, 107, 53, 0.1);
        color: $primary-orange;
      }

      &.type-notification {
        background: rgba(44, 62, 80, 0.1);
        color: $auxiliary-color;
      }

      &.type-event {
        background: rgba(255, 217, 61, 0.1);
        color: #d4a800;
      }
    }

    .detail-date {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }

  .detail-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 $spacing-md 0;
  }

  .detail-meta {
    display: flex;
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid $bg-secondary;

    .meta-item {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      font-size: $font-size-sm;
      color: $text-secondary;

      .el-icon {
        font-size: $font-size-md;
      }
    }
  }

  .detail-content {
    font-size: $font-size-md;
    color: $text-primary;
    line-height: 1.8;
    margin-bottom: $spacing-lg;
    white-space: pre-wrap;
  }

  .detail-attachment {
    :deep(.el-alert) {
      margin: 0;

      .el-alert__description {
        margin-top: $spacing-sm;
      }
    }

    .attachment-actions {
      display: flex;
      gap: $spacing-sm;
    }
  }
}

@media (max-width: $breakpoint-mobile) {
  .info-page {
    padding: $header-height + $spacing-md $spacing-md $spacing-md;
  }

  .info-header {
    padding: $spacing-md;

    .section-title {
      h2 {
        font-size: $font-size-xl;
      }
    }

    .filter-tabs {
      flex-direction: column;
      align-items: stretch;

      :deep(.el-button-group) {
        display: flex;
        flex-wrap: wrap;
      }

      :deep(.el-button-group .el-button) {
        flex: 1;
        min-width: 80px;
      }
    }
  }

  .notice-detail-dialog {
    :deep(.el-dialog) {
      width: 95% !important;
      margin: 0 auto;
    }
  }

  .notice-detail {
    .detail-title {
      font-size: $font-size-lg;
    }

    .detail-content {
      font-size: $font-size-sm;
    }
  }
}
</style>
