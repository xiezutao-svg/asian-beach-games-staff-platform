<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo-section">
        <div class="logo">
          <span class="logo-icon">ABG</span>
        </div>
        <h1 class="app-title">亚沙会工作人员平台</h1>
      </div>

      <!-- 桌面端导航 -->
      <nav class="desktop-nav">
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
          <span>{{ item.title }}</span>
        </router-link>
      </nav>

      <!-- 用户信息 -->
      <div class="user-section">
        <el-dropdown @command="handleCommand" trigger="click">
          <div class="user-info">
            <el-avatar :size="32" :src="userStore.userInfo?.avatar">
              {{ userStore.userInfo?.name?.[0] || 'U' }}
            </el-avatar>
            <span class="username desktop-only" v-if="userStore.userInfo">{{ userStore.userInfo.name }}</span>
            <el-icon class="dropdown-icon">
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人信息
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import {
  House as HomeIcon,
  Document,
  Calendar,
  DataAnalysis,
  ArrowDown,
  User,
  Setting,
  SwitchButton,
  Notification
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

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
    icon: User
  },
  {
    path: '/tasks',
    title: '任务打卡',
    icon: Calendar
  },
  {
    path: '/info',
    title: '公告通知',
    icon: Notification
  },
  {
    path: '/dashboard',
    title: '大屏展示',
    icon: DataAnalysis
  }
])

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped lang="scss">
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: $header-height;
  background: linear-gradient(135deg, $primary-orange, $dark-orange);
  box-shadow: $shadow-md;
  z-index: $z-index-sticky;

  .header-container {
    max-width: $breakpoint-desktop;
    margin: 0 auto;
    padding: 0 $spacing-lg;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    .logo {
      width: 40px;
      height: 40px;
      background: $text-white;
      border-radius: $border-radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: $shadow-sm;

      .logo-icon {
        font-size: $font-size-sm;
        font-weight: bold;
        color: $primary-orange;
      }
    }

    .app-title {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-white;
      margin: 0;
    }
  }

  .desktop-nav {
    display: flex;
    gap: $spacing-xs;

    .nav-item {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-sm $spacing-md;
      color: rgba(255, 255, 255, 0.9);
      border-radius: $border-radius-md;
      transition: all $transition-normal;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }

      &.active {
        background: $text-white;
        color: $primary-orange;
      }

      .nav-icon {
        font-size: $font-size-lg;
      }
    }
  }

  .user-section {
    .user-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-xs;
      cursor: pointer;
      border-radius: $border-radius-full;
      transition: all $transition-normal;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }

      .username {
        color: $text-white;
        font-size: $font-size-sm;
      }

      .dropdown-icon {
        color: $text-white;
        font-size: $font-size-sm;
      }
    }
  }
}

@media (max-width: $breakpoint-mobile) {
  .app-header {
    .logo-section {
      .app-title {
        font-size: $font-size-md;
      }
    }

    .desktop-nav {
      display: none;
    }

    .user-section {
      display: none;
    }
  }

  .desktop-only {
    display: none;
  }
}
</style>
