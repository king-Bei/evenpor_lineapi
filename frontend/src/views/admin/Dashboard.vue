<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
      <div class="p-6">
        <h1 class="text-xl font-bold flex items-center">
          <el-icon class="mr-2"><Management /></el-icon>
          Evenpor Admin
        </h1>
      </div>
      <nav class="mt-4 flex-grow">
        <div class="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">主要功能</div>
        <a href="#" class="flex items-center px-6 py-3 bg-indigo-600 text-white">
          <el-icon class="mr-3"><User /></el-icon>
          旅客管理
        </a>
        <a href="#" class="flex items-center px-6 py-3 text-gray-400 hover:bg-slate-800 hover:text-white transition-colors">
          <el-icon class="mr-3"><Setting /></el-icon>
          系統設定
        </a>
      </nav>
      <div class="p-6 border-t border-slate-800">
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">A</div>
          <div class="ml-3">
            <p class="text-sm font-medium">管理員</p>
            <p class="text-xs text-gray-500">online</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col min-w-0">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
        <h2 class="text-lg font-semibold text-gray-800">旅客報到管理</h2>
        <div class="flex items-center space-x-4">
          <el-button type="primary" plain @click="triggerFileUpload">
            <el-icon class="mr-1"><Upload /></el-icon> 匯入 Excel
          </el-button>
          <input type="file" ref="fileInput" class="hidden" accept=".xlsx, .xls" @change="handleFileChange" />
          <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        </div>
      </header>

      <!-- Dashboard Content -->
      <div class="p-8 overflow-auto">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p class="text-sm text-gray-500 mb-1">總旅客數</p>
            <h3 class="text-3xl font-bold text-gray-900">{{ tableData.length }}</h3>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p class="text-sm text-gray-500 mb-1">今日已報到</p>
            <h3 class="text-3xl font-bold text-green-600">{{ checkedInCount }}</h3>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p class="text-sm text-gray-500 mb-1">待處理</p>
            <h3 class="text-3xl font-bold text-amber-500">{{ tableData.length - checkedInCount }}</h3>
          </div>
        </div>

        <!-- Table Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-gray-800">旅客清單</h3>
            <el-input
              v-model="searchQuery"
              placeholder="搜尋姓名或身分證..."
              class="!w-64"
              clearable
            >
              <template #prefix><el-icon><Search /></template>
            </el-input>
          </div>

          <el-table :data="filteredData" style="width: 100%" v-loading="loading" height="500">
            <el-table-column prop="name" label="姓名" width="150" sortable />
            <el-table-column prop="idNumber" label="身分證/護照" width="180" />
            <el-table-column prop="phone" label="手機號碼" width="150" />
            <el-table-column prop="lineUid" label="LINE UID" min-width="200">
              <template #default="scope">
                <el-tag v-if="scope.row.lineUid" size="small" type="success">已連結</el-tag>
                <el-tag v-else size="small" type="info">未連結</el-tag>
                <span class="ml-2 text-xs text-gray-400 font-mono">{{ scope.row.lineUid || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="狀態" width="120">
              <template #default="scope">
                <el-badge :type="scope.row.lineUid ? 'success' : 'warning'" is-dot class="mr-2" />
                {{ scope.row.lineUid ? '已報到' : '未報到' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handleEdit(scope.row)">編輯</el-button>
                <el-button link type="danger" size="small">刪除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="p-4 border-t border-gray-100 flex justify-end">
            <el-pagination
              layout="total, prev, pager, next"
              :total="filteredData.length"
              :page-size="10"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { parseExcel } from '../../utils/excel';
import { ElMessage } from 'element-plus';

const fileInput = ref(null);
const loading = ref(false);
const searchQuery = ref('');

// Mock Data
const tableData = ref([
  { name: '王小明', idNumber: 'A123456789', phone: '0912345678', lineUid: 'U1234567890abcdef', status: 'checked' },
  { name: '李華', idNumber: 'B223456789', phone: '0987654321', lineUid: '', status: 'pending' },
  { name: '張三', idNumber: 'C123456789', phone: '0955666777', lineUid: '', status: 'pending' },
]);

const filteredData = computed(() => {
  if (!searchQuery.value) return tableData.value;
  const q = searchQuery.value.toLowerCase();
  return tableData.value.filter(item => 
    item.name.toLowerCase().includes(q) || 
    item.idNumber.toLowerCase().includes(q)
  );
});

const checkedInCount = computed(() => {
  return tableData.value.filter(item => !!item.lineUid).length;
});

const triggerFileUpload = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;
  try {
    const json = await parseExcel(file);
    // 預期 Excel 欄位: 姓名, 身分證, 電話
    const mappedData = json.map(row => ({
      name: row['姓名'] || row['Name'],
      idNumber: row['身分證'] || row['ID'],
      phone: row['電話'] || row['Phone'],
      lineUid: '',
      status: 'pending'
    }));
    
    tableData.value = [...tableData.value, ...mappedData];
    ElMessage.success(`成功匯入 ${mappedData.length} 筆資料`);
  } catch (err) {
    ElMessage.error('Excel 解析失敗，請檢查格式');
  } finally {
    loading.value = false;
    event.target.value = ''; // Reset input
  }
};

const handleEdit = (row) => {
  ElMessage.info(`正在編輯: ${row.name}`);
};
</script>

<style scoped>
.el-table {
  --el-table-header-bg-color: #f8fafc;
  --el-table-row-hover-bg-color: #f1f5f9;
}
</style>
