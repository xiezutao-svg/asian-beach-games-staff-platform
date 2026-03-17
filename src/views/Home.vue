<template>
  <div class="home-page">
    <AppHeader />
    <AppSidebar />
    <AppMobileNav />

    <main class="main-content">
      <div class="welcome-section">
        <h1 class="welcome-title">欢迎回来</h1>
        <p class="welcome-text">{{ userStore.userInfo?.name || '工作人员' }}，今天是美好的一天</p>
      </div>

      <div class="modules-grid">
        <div
          v-for="module in modules"
          :key="module.path"
          class="module-card"
          @click="navigateTo(module.path)"
        >
          <div class="module-icon">
            <el-icon :size="40">
              <component :is="module.icon" />
            </el-icon>
          </div>
          <h3 class="module-title">{{ module.title }}</h3>
          <p class="module-description">{{ module.description }}</p>
          <div class="module-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2 class="section-title">快捷操作</h2>
        <div class="actions-grid">
          <el-button
            v-for="action in quickActions"
            :key="action.path"
            type="primary"
            plain
            size="large"
            @click="navigateTo(action.path)"
          >
            <el-icon class="action-icon">
              <component :is="action.icon" />
            </el-icon>
            {{ action.title }}
          </el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import {
  Document,
  Calendar,
  ChatLineRound,
  DataAnalysis,
  Notification,
  User as UserIcon,
  Management,
  ArrowRight
} from '@element-plus/icons-vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import AppMobileNav from '@/components/common/AppMobileNav.vue'

const router = useRouter()
const userStore = useUserStore()

const modules = [
  {
    path: '/reports',
    title: '每日报告',
    description: '提交和查看工作日报',
    icon: Document
  },
  {
    path: '/contacts',
    title: '通讯录',
    description: '查找联系人和部门信息',
    icon: UserIcon
  },
  {
    path: '/tasks',
    title: '任务打卡',
    description: '管理任务和记录打卡',
    icon: Calendar
  },
  {
    path: '/info',
    title: '公告通知',
    description: '查看最新公告和通知',
    icon: Notification
  },
  {
    path: '/dashboard',
    title: '大屏展示',
    description: '数据可视化展示',
    icon: DataAnalysis
  },
  {
    path: '/management',
    title: '系统管理',
    description: '用户和系统设置',
    icon: Management
  }
]

const quickActions = [
  {
    path: '/tasks',
    title: '开始打卡',
    icon: Calendar
  },
  {
    path: '/reports',
    title: '写日报',
    icon: ChatLineRound
  },
  {
    path: '/contacts',
    title: '查找联系人',
    icon: UserIcon
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background: $bg-secondary;
}

.main-content {
  margin-top: $header-height;
  min-height: calc(100vh - $header-height);
  padding: $spacing-xxl $spacing-lg;
  padding-bottom: calc($mobile-nav-height + $spacing-xl);

  @media (min-width: $breakpoint-mobile + 1) {
    margin-left: $sidebar-width;
    padding-bottom: $spacing-xl;
  }
}

.welcome-section {
  text-align: center;
  margin-bottom: $spacing-xxl;

  .welcome-title {
    font-size: $font-size-xxl;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 $spacing-sm 0;
  }

  .welcome-text {
    font-size: $font-size-lg;
    color: $text-secondary;
    margin: 0;
  }
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-xl;
  margin-bottom: $spacing-xxl;
}

.module-card {
  background: $bg-primary;
  border-radius: $border-radius-xl;
  padding: $spacing-xl;
  box-shadow: $shadow-sm;
  transition: all $transition-normal;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-lg;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, $primary-orange, $dark-orange);
    transform: scaleX(0);
    transition: transform $transition-normal;
  }

  &:hover::before {
    transform: scaleX(1);
  }

  .module-icon {
    width: 80px;
    height: 80px;
    background: $bg-orange-light;
    border-radius: $border-radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $spacing-lg;
    color: $primary-orange;
  }

  .module-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 $spacing-sm 0;
  }

  .module-description {
    font-size: $font-size-md;
    color: $text-secondary;
    margin: 0 0 $spacing-lg 0;
    line-height: 1.5;
  }

  .module-arrow {
    display: flex;
    justify-content: flex-end;
    color: $primary-orange;
    opacity: 0;
    transition: opacity $transition-normal;
  }

  &:hover .module-arrow {
    opacity: 1;
  }
}

.quick-actions {
  .section-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 $spacing-lg 0;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-md;

    .el-button {
      height: 56px;
      font-size: $font-size-md;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;

      .action-icon {
        font-size: $font-size-lg;
      }

      &:hover {
        border-color: $primary-orange;
        color: $primary-orange;
      }
    }
  }
}

@media (max-width: $breakpoint-mobile) {
  .main-content {
    padding: $spacing-lg;
  }

  .welcome-section {
    margin-bottom: $spacing-lg;

    .welcome-title {
      font-size: $font-size-xl;
    }

    .welcome-text {
      font-size: $font-size-md;
    }
  }

  .modules-grid {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;
  }

  .module-card {
    padding: $spacing-lg;

    .module-icon {
      width: 60px;
      height: 60px;
      margin-bottom: $spacing-md;
    }

    .module-title {
      font-size: $font-size-lg;
    }

    .module-description {
      font-size: $font-size-sm;
    }
  }

  .quick-actions {
    .actions-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
