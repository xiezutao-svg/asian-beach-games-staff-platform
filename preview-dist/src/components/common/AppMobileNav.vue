<template>
  <nav class="mobile-nav">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Home as HomeIcon,
  Document,
  Calendar,
  ChatLineRound,
  DataAnalysis,
  Notification
} from '@element-plus/icons-vue'

const menuItems = computed(() => [
  {
    path: '/home',
    title: '首页',
    icon: HomeIcon
  },
  {
    path: '/reports',
    title: '报告',
    icon: Document
  },
  {
    path: '/contacts',
    title: '通讯',
    icon: ChatLineRound
  },
  {
    path: '/tasks',
    title: '打卡',
    icon: Calendar
  },
  {
    path: '/info',
    title: '公告',
    icon: Notification,
    badge: 5
  },
  {
    path: '/dashboard',
    title: '大屏',
    icon: DataAnalysis
  }
])
</script>

<style scoped lang="scss">
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: $mobile-nav-height;
  background: $bg-primary;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: $z-index-sticky;

  .nav-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex: 1;
    height: 100%;
    padding: $spacing-xs 0;
    color: $text-secondary;
    transition: all $transition-normal;

    &:hover {
      color: $primary-orange;
    }

    &.active {
      color: $primary-orange;
    }

    .nav-icon {
      font-size: $font-size-xl;
    }

    .nav-text {
      font-size: $font-size-xs;
      font-weight: 500;
    }

    .badge {
      position: absolute;
      top: $spacing-xs;
      right: 20%;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      background: $accent-color;
      color: $text-primary;
      font-size: 10px;
      font-weight: 600;
      border-radius: $border-radius-full;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

@media (min-width: $breakpoint-mobile + 1) {
  .mobile-nav {
    display: none;
  }
}
</style>
