import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserInfo {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>('')
  const isLoggedIn = ref(false)

  // 方法
  function setUserInfo(info: UserInfo) {
    userInfo.value = info
  }

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function login(user: UserInfo, auth_token: string) {
    userInfo.value = user
    token.value = auth_token
    isLoggedIn.value = true
    localStorage.setItem('token', auth_token)
  }

  function logout() {
    userInfo.value = null
    token.value = ''
    isLoggedIn.value = false
    localStorage.removeItem('token')
  }

  function checkAuth() {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      isLoggedIn.value = true
    }
    return isLoggedIn.value
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    setUserInfo,
    setToken,
    login,
    logout,
    checkAuth
  }
})
