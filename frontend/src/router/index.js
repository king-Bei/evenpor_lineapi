import { createRouter, createWebHistory } from 'vue-router';
import CheckIn from '../views/liff/CheckIn.vue';
import Dashboard from '../views/admin/Dashboard.vue';

const routes = [
  {
    path: '/',
    redirect: '/liff'
  },
  {
    path: '/liff',
    name: 'CheckIn',
    component: CheckIn,
    meta: { title: '旅客實名報到' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: Dashboard,
    meta: { title: '管理員後台' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
