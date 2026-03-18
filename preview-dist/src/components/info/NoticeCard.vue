<template>
  <div class="notice-card" :class="{ 'unread': !notice.read, 'read': notice.read }" @click="handleClick">
    <div class="notice-header">
      <div class="notice-type" :class="`type-${notice.type}`">
        {{ typeLabel }}
      </div>
      <div class="notice-date">{{ formatDate(notice.date) }}</div>
    </div>

    <div class="notice-content">
      <h3 class="notice-title">
        <span v-if="!notice.read" class="unread-dot"></span>
        {{ notice.title }}
      </h3>
      <p class="notice-preview">{{ notice.content }}</p>
    </div>

    <div class="notice-footer">
      <div class="notice-author">
        <el-icon><User /></el-icon>
        <span>{{ notice.author }}</span>
      </div>
      <div class="notice-actions">
        <el-button
          v-if="notice.attachment"
          type="primary"
          size="small"
          text
          @click.stop="handleDownload"
        >
          <el-icon><Download /></el-icon>
          下载附件
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Download } from '@element-plus/icons-vue'
import type { Notice } from '../../types/notice'
import { useUserStore } from '@/stores'
import { UserRole } from '../../types/notice'

interface Props {
  notice: Notice
}

interface Emits {
  (e: 'click', notice: Notice): void
  (e: 'download', notice: Notice): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const userStore = useUserStore()

const typeLabel = computed(() => {
  const typeMap = {
    announcement: '公告',
    notification: '通知',
    event: '活动'
  }
  return typeMap[props.notice.type]
})

function formatDate(date: string) {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  }
}

function handleClick() {
  emit('click', props.notice)
}

function handleDownload() {
  // 权限检查
  const userRole = userStore.userInfo?.role

  // 在实际项目中，这里应该检查用户是否有权限下载该文件
  // 目前只是模拟实现
  if (userRole === UserRole.ADMIN) {
    emit('download', props.notice)
  } else {
    // 普通用户只能下载与自己相关的文件
    // 这里简化处理，允许所有用户下载
    emit('download', props.notice)
  }
}
</script>

<style scoped lang="scss">
.notice-card {
  background: $bg-primary;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
  cursor: pointer;
  transition: all $transition-normal;
  border: 1px solid transparent;
  box-shadow: $shadow-sm;

  &:hover {
    box-shadow: $shadow-md;
    border-color: $primary-orange;
    transform: translateY(-2px);
  }

  &.unread {
    border-left: 3px solid $primary-orange;
  }

  .notice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;
    gap: $spacing-md;

    .notice-type {
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-sm;
      font-size: $font-size-xs;
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

    .notice-date {
      font-size: $font-size-xs;
      color: $text-secondary;
    }
  }

  .notice-content {
    margin-bottom: $spacing-md;

    .notice-title {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-primary;
      margin: 0 0 $spacing-sm 0;
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .unread-dot {
        width: 8px;
        height: 8px;
        background: $primary-orange;
        border-radius: 50%;
        flex-shrink: 0;
      }
    }

    .notice-preview {
      font-size: $font-size-sm;
      color: $text-secondary;
      line-height: 1.6;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .notice-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-md;

    .notice-author {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      font-size: $font-size-xs;
      color: $text-light;

      .el-icon {
        font-size: $font-size-sm;
      }
    }

    .notice-actions {
      display: flex;
      gap: $spacing-sm;
    }
  }
}

@media (max-width: $breakpoint-mobile) {
  .notice-card {
    padding: $spacing-md;

    .notice-header {
      .notice-type {
        font-size: 10px;
        padding: 2px 6px;
      }
    }

    .notice-content {
      .notice-title {
        font-size: $font-size-sm;
      }

      .notice-preview {
        -webkit-line-clamp: 3;
      }
    }

    .notice-footer {
      {
        flex-direction: column;
        align-items: flex-start;
        gap: $spacing-sm;
      }
    }
  }
}
</style>
