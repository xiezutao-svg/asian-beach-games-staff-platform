<template>
  <div class="management-page">
    <AppHeader />
    <AppSidebar />
    <AppMobileNav />

    <main class="main-content">
      <div class="container">
        <div class="header">
          <h1>ABG Staff System</h1>
          <p>员工管理系统 v1.0</p>
        </div>

        <div class="nav">
          <button :class="{ active: currentSection === 'dashboard' }" @click="showSection('dashboard')">
            仪表板
          </button>
          <button :class="{ active: currentSection === 'staff' }" @click="showSection('staff')">
            员工管理
          </button>
          <button :class="{ active: currentSection === 'schedule' }" @click="showSection('schedule')">
            排班管理
          </button>
          <button :class="{ active: currentSection === 'leave' }" @click="showSection('leave')">
            请假管理
          </button>
        </div>

        <div class="content">
          <!-- 仪表板 -->
          <div v-show="currentSection === 'dashboard'" class="section">
            <h2>系统概览</h2>
            <br>
            <div class="stats-grid">
              <div class="stat-card">
                <h4>总员工数</h4>
                <div class="number">{{ staffData.length }}</div>
              </div>
              <div class="stat-card">
                <h4>在职员工</h4>
                <div class="number">{{ activeStaffCount }}</div>
              </div>
              <div class="stat-card">
                <h4>今日排班</h4>
                <div class="number">{{ todayScheduleCount }}</div>
              </div>
              <div class="stat-card">
                <h4>待审批请假</h4>
                <div class="number">{{ pendingLeaveCount }}</div>
              </div>
            </div>

            <h3>快速操作</h3>
            <br>
            <div class="action-buttons">
              <el-button type="primary" @click="openAddStaffModal">添加员工</el-button>
              <el-button type="success" @click="showSection('schedule')">查看排班</el-button>
              <el-button type="warning" @click="showSection('leave')">请假申请</el-button>
            </div>
          </div>

          <!-- 员工管理 -->
          <div v-show="currentSection === 'staff'" class="section">
            <div class="section-header">
              <h2>员工管理</h2>
              <el-button type="primary" @click="openAddStaffModal">添加员工</el-button>
            </div>

            <el-input
              v-model="searchTerm"
              placeholder="搜索员工姓名或编号..."
              style="margin-bottom: 20px;"
            />

            <el-table :data="filteredStaffData" stripe style="width: 100%">
              <el-table-column prop="id" label="工号" width="100" />
              <el-table-column prop="name" label="姓名" width="120" />
              <el-table-column prop="dept" label="部门" width="120" />
              <el-table-column prop="position" label="职位" width="120" />
              <el-table-column prop="phone" label="电话" width="140" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                    {{ row.status === 'active' ? '在职' : '离职' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="{ $index }">
                  <el-button size="small" @click="editStaff($index)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteStaff($index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 排班管理 -->
          <div v-show="currentSection === 'schedule'" class="section">
            <div class="section-header">
              <h2>排班管理</h2>
              <el-button type="primary" @click="openAddScheduleModal">添加排班</el-button>
            </div>

            <el-table :data="scheduleData" stripe style="width: 100%">
              <el-table-column label="员工" width="200">
                <template #default="{ row }">
                  {{ getStaffName(row.staffId) }} ({{ row.staffId }})
                </template>
              </el-table-column>
              <el-table-column prop="date" label="日期" width="120" />
              <el-table-column prop="shift" label="班次" width="100" />
              <el-table-column prop="timeRange" label="时间段" width="150" />
              <el-table-column label="操作" width="100">
                <template #default="{ $index }">
                  <el-button size="small" type="danger" @click="deleteSchedule($index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 请假管理 -->
          <div v-show="currentSection === 'leave'" class="section">
            <div class="section-header">
              <h2>请假管理</h2>
              <el-button type="primary" @click="openAddLeaveModal">申请请假</el-button>
            </div>

            <el-table :data="leaveData" stripe style="width: 100%">
              <el-table-column label="员工" width="200">
                <template #default="{ row }">
                  {{ getStaffName(row.staffId) }} ({{ row.staffId }})
                </template>
              </el-table-column>
              <el-table-column prop="type" label="请假类型" width="100" />
              <el-table-column prop="startDate" label="开始日期" width="120" />
              <el-table-column prop="endDate" label="结束日期" width="120" />
              <el-table-column prop="days" label="天数" width="80" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getLeaveStatusType(row.status)">
                    {{ getLeaveStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="{ row, $index }">
                  <template v-if="row.status === 'pending'">
                    <el-button size="small" type="success" @click="approveLeave($index)">批准</el-button>
                    <el-button size="small" type="danger" @click="rejectLeave($index)">拒绝</el-button>
                  </template>
                  <el-button size="small" type="danger" @click="deleteLeave($index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </main>

    <!-- 添加/编辑员工弹窗 -->
    <el-dialog
      v-model="staffModalVisible"
      :title="isEditingStaff ? '编辑员工' : '添加员工'"
      width="500px"
    >
      <el-form :model="staffForm" label-width="80px">
        <el-form-item label="工号">
          <el-input v-model="staffForm.id" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="staffForm.name" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="staffForm.dept" placeholder="请选择部门">
            <el-option label="销售部" value="销售部" />
            <el-option label="技术部" value="技术部" />
            <el-option label="人力资源部" value="人力资源部" />
            <el-option label="财务部" value="财务部" />
            <el-option label="运营部" value="运营部" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="staffForm.position" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="staffForm.phone" />
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker v-model="staffForm.hireDate" type="date" placeholder="选择日期" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="staffModalVisible = false">取消</el-button>
        <el-button type="primary" @click="saveStaff">{{ isEditingStaff ? '更新' : '添加' }}</el-button>
      </template>
    </el-dialog>

    <!-- 添加排班弹窗 -->
    <el-dialog v-model="scheduleModalVisible" title="添加排班" width="500px">
      <el-form :model="scheduleForm" label-width="80px">
        <el-form-item label="选择员工">
          <el-select v-model="scheduleForm.staffId" placeholder="请选择员工">
            <el-option
              v-for="staff in activeStaffData"
              :key="staff.id"
              :label="`${staff.name} (${staff.id})`"
              :value="staff.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="scheduleForm.date" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="班次">
          <el-select v-model="scheduleForm.shift" placeholder="请选择班次">
            <el-option label="早班" value="早班" />
            <el-option label="中班" value="中班" />
            <el-option label="晚班" value="晚班" />
            <el-option label="夜班" value="夜班" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="scheduleModalVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSchedule">添加</el-button>
      </template>
    </el-dialog>

    <!-- 申请请假弹窗 -->
    <el-dialog v-model="leaveModalVisible" title="申请请假" width="500px">
      <el-form :model="leaveForm" label-width="80px">
        <el-form-item label="选择员工">
          <el-select v-model="leaveForm.staffId" placeholder="请选择员工">
            <el-option
              v-for="staff in activeStaffData"
              :key="staff.id"
              :label="`${staff.name} (${staff.id})`"
              :value="staff.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="请假类型">
          <el-select v-model="leaveForm.type" placeholder="请选择类型">
            <el-option label="年假" value="年假" />
            <el-option label="病假" value="病假" />
            <el-option label="事假" value="事假" />
            <el-option label="调休" value="调休" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="leaveForm.startDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="leaveForm.endDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="请假原因">
          <el-input v-model="leaveForm.reason" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="leaveModalVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLeave">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import AppMobileNav from '@/components/common/AppMobileNav.vue'

interface Staff {
  id: string
  name: string
  dept: string
  position: string
  phone: string
  hireDate: string
  status: 'active' | 'inactive'
}

interface Schedule {
  staffId: string
  date: string
  shift: string
  timeRange: string
}

interface Leave {
  staffId: string
  type: string
  startDate: string
  endDate: string
  reason: string
  days: number
  status: 'pending' | 'approved' | 'rejected'
}

const currentSection = ref('dashboard')
const searchTerm = ref('')
const staffModalVisible = ref(false)
const scheduleModalVisible = ref(false)
const leaveModalVisible = ref(false)
const isEditingStaff = ref(false)
const editingStaffIndex = ref(-1)

const staffForm = ref<Partial<Staff>>({
  id: '',
  name: '',
  dept: '',
  position: '',
  phone: '',
  hireDate: '',
  status: 'active'
})

const scheduleForm = ref<Partial<Schedule>>({
  staffId: '',
  date: '',
  shift: ''
})

const leaveForm = ref<Partial<Leave>>({
  staffId: '',
  type: '',
  startDate: '',
  endDate: '',
  reason: '',
  days: 0,
  status: 'pending'
})

const staffData = ref<Staff[]>([])
const scheduleData = ref<Schedule[]>([])
const leaveData = ref<Leave[]>([])

const activeStaffCount = computed(() => staffData.value.filter(s => s.status === 'active').length)

const todayScheduleCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return scheduleData.value.filter(s => s.date === today).length
})

const pendingLeaveCount = computed(() => leaveData.value.filter(l => l.status === 'pending').length)

const activeStaffData = computed(() => staffData.value.filter(s => s.status === 'active'))

const filteredStaffData = computed(() => {
  if (!searchTerm.value) return staffData.value
  return staffData.value.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    staff.id.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const loadData = () => {
  const storedStaff = localStorage.getItem('abg_staff')
  const storedSchedule = localStorage.getItem('abg_schedule')
  const storedLeave = localStorage.getItem('abg_leave')

  if (storedStaff) staffData.value = JSON.parse(storedStaff)
  if (storedSchedule) scheduleData.value = JSON.parse(storedSchedule)
  if (storedLeave) leaveData.value = JSON.parse(storedLeave)

  if (staffData.value.length === 0) {
    staffData.value = [
      { id: 'ABG001', name: '张三', dept: '技术部', position: '高级工程师', phone: '13800138001', hireDate: '2023-01-15', status: 'active' },
      { id: 'ABG002', name: '李四', dept: '销售部', position: '销售经理', phone: '13800138002', hireDate: '2023-03-20', status: 'active' },
      { id: 'ABG003', name: '王五', dept: '人力资源部', position: 'HR专员', phone: '13800138003', hireDate: '2023-06-10', status: 'active' }
    ]
    saveData()
  }
}

const saveData = () => {
  localStorage.setItem('abg_staff', JSON.stringify(staffData.value))
  localStorage.setItem('abg_schedule', JSON.stringify(scheduleData.value))
  localStorage.setItem('abg_leave', JSON.stringify(leaveData.value))
}

const showSection = (section: string) => {
  currentSection.value = section
}

const getStaffName = (staffId: string) => {
  const staff = staffData.value.find(s => s.id === staffId)
  return staff ? staff.name : '未知员工'
}

const getLeaveStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待审批',
    approved: '已批准',
    rejected: '已拒绝'
  }
  return statusMap[status] || status
}

const getLeaveStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

const openAddStaffModal = () => {
  isEditingStaff.value = false
  staffForm.value = {
    id: '',
    name: '',
    dept: '',
    position: '',
    phone: '',
    hireDate: '',
    status: 'active'
  }
  staffModalVisible.value = true
}

const editStaff = (index: number) => {
  isEditingStaff.value = true
  editingStaffIndex.value = index
  staffForm.value = { ...staffData.value[index] }
  staffModalVisible.value = true
}

const saveStaff = () => {
  if (!staffForm.value.id || !staffForm.value.name || !staffForm.value.dept ||
      !staffForm.value.position || !staffForm.value.phone || !staffForm.value.hireDate) {
    ElMessage.warning('请填写所有必填字段')
    return
  }

  const staff: Staff = {
    id: staffForm.value.id!,
    name: staffForm.value.name!,
    dept: staffForm.value.dept!,
    position: staffForm.value.position!,
    phone: staffForm.value.phone!,
    hireDate: staffForm.value.hireDate!,
    status: staffForm.value.status || 'active'
  }

  if (isEditingStaff.value) {
    staffData.value[editingStaffIndex.value] = staff
    ElMessage.success('员工更新成功！')
  } else {
    staffData.value.push(staff)
    ElMessage.success('员工添加成功！')
  }

  saveData()
  staffModalVisible.value = false
}

const deleteStaff = (index: number) => {
  staffData.value.splice(index, 1)
  saveData()
  ElMessage.success('员工删除成功！')
}

const openAddScheduleModal = () => {
  scheduleForm.value = {
    staffId: '',
    date: '',
    shift: ''
  }
  scheduleModalVisible.value = true
}

const saveSchedule = () => {
  if (!scheduleForm.value.staffId || !scheduleForm.value.date || !scheduleForm.value.shift) {
    ElMessage.warning('请填写所有必填字段')
    return
  }

  const shiftTimeRanges: Record<string, string> = {
    '早班': '08:00-16:00',
    '中班': '12:00-20:00',
    '晚班': '16:00-24:00',
    '夜班': '00:00-08:00'
  }

  const schedule: Schedule = {
    staffId: scheduleForm.value.staffId!,
    date: scheduleForm.value.date!,
    shift: scheduleForm.value.shift!,
    timeRange: shiftTimeRanges[scheduleForm.value.shift!]
  }

  scheduleData.value.push(schedule)
  saveData()
  scheduleModalVisible.value = false
  ElMessage.success('排班添加成功！')
}

const deleteSchedule = (index: number) => {
  scheduleData.value.splice(index, 1)
  saveData()
  ElMessage.success('排班删除成功！')
}

const openAddLeaveModal = () => {
  leaveForm.value = {
    staffId: '',
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    days: 0,
    status: 'pending'
  }
  leaveModalVisible.value = true
}

const saveLeave = () => {
  if (!leaveForm.value.staffId || !leaveForm.value.type || !leaveForm.value.startDate ||
      !leaveForm.value.endDate || !leaveForm.value.reason) {
    ElMessage.warning('请填写所有必填字段')
    return
  }

  const startDate = new Date(leaveForm.value.startDate!)
  const endDate = new Date(leaveForm.value.endDate!)
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const leave: Leave = {
    staffId: leaveForm.value.staffId!,
    type: leaveForm.value.type!,
    startDate: leaveForm.value.startDate!,
    endDate: leaveForm.value.endDate!,
    reason: leaveForm.value.reason!,
    days,
    status: 'pending'
  }

  leaveData.value.push(leave)
  saveData()
  leaveModalVisible.value = false
  ElMessage.success('请假申请提交成功！')
}

const approveLeave = (index: number) => {
  leaveData.value[index].status = 'approved'
  saveData()
  ElMessage.success('请假已批准！')
}

const rejectLeave = (index: number) => {
  leaveData.value[index].status = 'rejected'
  saveData()
  ElMessage.success('请假已拒绝！')
}

const deleteLeave = (index: number) => {
  leaveData.value.splice(index, 1)
  saveData()
  ElMessage.success('请假记录删除成功！')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.management-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
  margin-top: 70px;
  min-height: calc(100vh - 70px);
  padding: 20px;
  padding-bottom: calc(60px + 20px);

  @media (min-width: 768px + 1) {
    margin-left: 250px;
    padding-bottom: 20px;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  text-align: center;

  h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.1em;
    opacity: 0.9;
  }
}

.nav {
  display: flex;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;

  button {
    flex: 1;
    padding: 20px;
    background: transparent;
    border: none;
    font-size: 1.1em;
    cursor: pointer;
    transition: all 0.3s;
    color: #495057;

    &:hover {
      background: #e9ecef;
    }

    &.active {
      background: white;
      color: #667eea;
      border-bottom: 3px solid #667eea;
    }
  }
}

.content {
  padding: 30px;
}

.section {
  h2 {
    margin-bottom: 20px;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 15px;
  text-align: center;

  h4 {
    font-size: 0.9em;
    opacity: 0.9;
    margin-bottom: 10px;
  }

  .number {
    font-size: 2.5em;
    font-weight: bold;
  }
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }

  .header h1 {
    font-size: 1.8em;
  }

  .nav {
    flex-wrap: wrap;

    button {
      flex: 1 1 50%;
      font-size: 0.9em;
    }
  }

  .content {
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>
