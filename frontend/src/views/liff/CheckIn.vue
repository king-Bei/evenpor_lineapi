<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center p-4">
    <!-- Header -->
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
      <div class="bg-indigo-600 p-6 text-white text-center">
        <h1 class="text-2xl font-bold">旅客實名報到</h1>
        <p class="text-indigo-100 text-sm mt-1">請填寫正確資訊以完成報到程序</p>
      </div>

      <!-- Profile Preview -->
      <div v-if="profile" class="p-6 border-b border-gray-100 flex items-center space-x-4">
        <img :src="profile.pictureUrl" class="w-16 h-16 rounded-full border-2 border-indigo-500 shadow-sm" alt="Profile" />
        <div>
          <h2 class="font-semibold text-gray-800">{{ profile.displayName }}</h2>
          <p class="text-xs text-gray-500">LINE 已連線</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- Form -->
      <div v-else class="p-6">
        <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
          <el-form-item label="真實姓名" prop="name">
            <el-input v-model="form.name" placeholder="請輸入您的真實姓名" size="large">
              <template #prefix><el-icon><User /></el-icon></template>
            </el-input>
          </el-form-item>

          <el-form-item label="手機號碼" prop="phone">
            <el-input v-model="form.phone" placeholder="例如: 0912345678" size="large">
              <template #prefix><el-icon><Iphone /></el-icon></template>
            </el-input>
          </el-form-item>

          <el-form-item label="身分證字號 / 護照號碼" prop="idNumber">
            <el-input 
              v-model="form.idNumber" 
              placeholder="用於身份核對" 
              size="large"
              show-password
            >
              <template #prefix><el-icon><Postcard /></el-icon></template>
            </el-input>
          </el-form-item>

          <el-form-item label="出生年月日" prop="birthday">
            <el-input 
              v-model="form.birthday" 
              placeholder="請輸入 8 位數字，例如: 19900101" 
              size="large"
              maxlength="8"
            >
              <template #prefix><el-icon><Calendar /></el-icon></template>
            </el-input>
          </el-form-item>

          <div class="mt-8">
            <el-button 
              type="primary" 
              class="w-full !h-12 !text-lg !rounded-xl !bg-indigo-600 hover:!bg-indigo-700 transition-all shadow-md"
              @click="handleSubmit"
              :loading="submitting"
            >
              確認報到
            </el-button>
          </div>
        </el-form>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-8 text-center text-gray-400 text-xs">
      <p>© 2024 Evenpor LINE 報到系統</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { initLiff, getProfile, closeWindow } from '../../utils/liff';
import { ElMessage } from 'element-plus';
import { User, Iphone, Postcard, Calendar } from '@element-plus/icons-vue';
import axios from 'axios';

const loading = ref(true);
const submitting = ref(false);
const profile = ref(null);
const formRef = ref(null);

const form = reactive({
  name: '',
  phone: '',
  idNumber: '',
  birthday: '',
});

const rules = {
  name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '請輸入手機號碼', trigger: 'blur' },
    { pattern: /^09\d{8}$/, message: '請輸入正確的手機格式', trigger: 'blur' }
  ],
  idNumber: [{ required: true, message: '請輸入身分證或護照號碼', trigger: 'blur' }],
  birthday: [
    { required: true, message: '請輸入出生年月日', trigger: 'blur' },
    { len: 8, message: '請輸入 8 位數字格式 (如 19900101)', trigger: 'blur' },
    { pattern: /^\d{8}$/, message: '請輸入正確的日期格式', trigger: 'blur' }
  ]
};

onMounted(async () => {
  try {
    // 使用您的 LIFF ID
    const LIFF_ID = import.meta.env.VITE_LIFF_ID || 'YOUR_LIFF_ID';
    if (LIFF_ID === 'YOUR_LIFF_ID') {
      console.warn('Please set VITE_LIFF_ID in .env');
    }
    
    await initLiff(LIFF_ID);
    profile.value = await getProfile();
  } catch (err) {
    ElMessage.error('系統初始化失敗，請稍後再試');
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true;
      try {
        // 將 19900101 轉換為 1990-01-01 以符合資料庫 DATE 格式
        const formattedBirthday = form.birthday.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        
        const payload = {
          ...form,
          birthday: formattedBirthday,
          lineUid: profile.value?.userId,
          lineDisplayName: profile.value?.displayName
        };
        
        // 實際後端 API 路徑
        const API_URL = import.meta.env.VITE_API_URL || '';
        const response = await axios.post(`${API_URL}/api/passenger/checkin`, payload);
        
        if (response.data.success) {
          ElMessage.success(response.data.message || '報到成功！');
          setTimeout(() => {
            closeWindow();
          }, 2000);
        }
      } catch (err) {
        console.error('Submit Error:', err);
        const errorMsg = err.response?.data?.error || '提交失敗，請聯繫工作人員';
        ElMessage.error(errorMsg);
      } finally {
        submitting.value = false;
      }
    }
  });
};
</script>

<style scoped>
:deep(.el-input__wrapper) {
  @apply !rounded-xl !shadow-none !border-gray-200;
}
:deep(.el-form-item__label) {
  @apply !font-medium !text-gray-700 !mb-1;
}
</style>
