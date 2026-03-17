<template>
  <aside class="app-sidebar">
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h3>功能菜单</h3>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <el-icon class="nav-icon">
            <component :is="item.icon" />
          </el-icon>
          <span class="nav-text">{{ item.title }}</span>
          <span v-if="item.badge" class="badge">{{ item.badge }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="status-info">
          <div class="status-dot"></div>
          <span class="status-text">在线</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Home as HomeIcon,
  Document,
  Calendar,
  DataAnalysis,
  Notification,
  Setting as SettingIcon,
  ChatLineRound
} from '@element-plus/icons-vue'

const menuItems = computed(() => [
  {
    path: '/home',
    title: '首页',
    icon: HomeIcon
  },
  {
    path: '/reports',
    title: '每日报告',
    icon: Document
  },
  {
    path: '/contacts',
    title: '通讯录',
    icon: ChatLineRound
  },
  {
    path: '/tasks',
    title: '任务打卡',
    icon: Calendar
  },
  {
    path: '/info',
    title: '公告通知',
    icon: Notification,
    badge: 5
  },
  {
    path: '/dashboard',
    title: '大屏展示',
    icon: DataAnalysis
  },
  {
    path: '/settings',
    title: '系统设置',
    icon: SettingIcon
  }
])
</script>

<style scoped lang="scss">
.app-sidebar {
  position: fixed;
  top: $header-height;
  left: 0;
  bottom: 0;
  width: $sidebar-width;
  background: $bg-primary;
  box-shadow: $shadow-md;
  z: 10;
  overflow-y: auto;

  .sidebar-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    padding: $spacing-lg;
    border-bottom: 1px solid #E0E0E0;

    h3 {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
    }
  }

  .sidebar-nav {
    flex: 1;
    padding: $spacing-sm 0;
  }

  .nav-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md $spacing-lg;
    color: $text-secondary;
    margin: $spacing-xs $spacing-sm;
    border-radius: $border-radius-md;
    transition: all $transition-normal;

    &:hover {
      background: $bg-orange-light;
      color: $primary-orange;
    }

    &.active {
      background: linear-gradient(135deg, $primary-orange, $dark-orange);
      color: $text-white;
    }

    .nav-icon {
      font-size: $font-size-xl;
    }

    .nav-text {
      flex: 1;
      font-size: $font-size-md;
    }

    .badge {
      min-width: 20px;
      height: 20px;
      padding: 0 $spacing-xs;
      background: $accent-color;
      color: $text-primary;
      font-size: $font-size-xs;
      font-weight: 600;
      border-radius: $border-radius-full;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .sidebar-footer {
    padding: $spacing-lg;
    border-top: 1px solid #E0E0E0;

    .status-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .status-dot {
        width: 8px;
        height: 8px;
        background: #10B981;
        border-radius: $border-radius-full;
        animation: pulse 2s infinite;
      }

      .status-text {
        font-size: $font-size-sm;
        color: $text-secondary;
      }
    }
  }
}

@media (max-width: $breakpoint-mobile) {
  .app-sidebar {
    display: none;
  }
}
</style>
