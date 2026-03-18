<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <span class="logo-icon">ABG</span>
        </div>
        <h1 class="login-title">亚沙会工作人员平台</h1>
        <p class="login-subtitle">工作人员打卡汇报系统</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <div class="form-options">
            <el-checkbox v-model="form.remember">记住我</el-checkbox>
            <el-link type="primary">忘记密码？</el-link>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="construction-notice">
        <el-icon><InfoFilled /></el-icon>
        <span>演示平台：任意用户名密码均可登录</span>
      </div>
    </div>

    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    loading.value = true

    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟登录成功
    userStore.login(
      {
        id: 1,
        name: form.username,
        email: `${form.username}@example.com`,
        role: 'staff',
        avatar: undefined
      },
      'demo-token-' + Date.now()
    )

    ElMessage.success('登录成功')
    router.push('/home')
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $bg-bg-secondary 0%, $bg-orange-light 100%);
  position: relative;
  overflow: hidden;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: $bg-primary;
  padding: $spacing-xxl;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-lg;

  .login-header {
    text-align: center;
    margin-bottom: $spacing-xl;

    .logo {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, $primary-orange, $dark-orange);
      border-radius: $border-radius-lg;
      margin: 0 auto $spacing-md;
      display: flex;
      align-items: center;
;
      justify-content: center;
      box-shadow: $shadow-orange;

      .logo-icon {
        font-size: $font-size-lg;
        font-weight: bold;
        color: $text-white;
      }
    }

    .login-title {
      font-size: $font-size-xxl;
      font-weight: 700;
      color: $text-primary;
      margin-bottom: $spacing-xs;
    }

    .login-subtitle {
      font-size: $font-size-md;
      color: $text-secondary;
      margin: 0;
    }
  }

  .login-form {
    margin-bottom: $spacing-lg;

    .form-options {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .login-btn {
      width: 100%;
      height: 48px;
      font-size: $font-size-lg;
      font-weight: 600;
      background: $primary-orange;
      border-color: $primary-orange;
      border-radius: $border-radius-md;

      &:hover {
        background: $dark-orange;
        border-color: $dark-orange;
      }
    }
  }

  .construction-notice {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    background: $bg-orange-light;
    border-radius: $border-radius-md;
    color: $primary-orange;
    font-size: $font-size-sm;

    .el-icon {
      font-size: $font-size-lg;
    }
  }
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;

  .circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;

    &.circle-1 {
      width: 400px;
      height: 400px;
      background: $primary-orange;
      top: -100px;
      right: -100px;
    }

    &.circle-2 {
      width: 300px;
      height: 300px;
      background: $light-orange;
      bottom: -50px;
      left: -50px;
    }

    &.circle-3 {
      width: 200px;
      height: 200px;
      background: $accent-color;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

@media (max-width: $breakpoint-mobile) {
  .login-container {
    margin: $spacing-lg;
    padding: $spacing-xl;

    .login-header {
      .login-title {
        font-size: $font-size-xl;
      }

      .login-subtitle {
        font-size: $font-size-sm;
      }
    }
  }
}
</style>
