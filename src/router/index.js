import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/compress',
      name: 'compress',
      component: () => import('../views/CompressView.vue')
    },
    {
      path: '/crop',
      name: 'crop',
      component: () => import('../views/CropView.vue')
    },
    {
      path: '/convert',
      name: 'convert',
      component: () => import('../views/ConvertView.vue')
    },
    {
      path: '/rename',
      name: 'rename',
      component: () => import('../views/RenameView.vue')
    },
    {
      path: '/batch-crop',
      name: 'batchCrop',
      component: () => import('../views/BatchCropView.vue')
    },
    {
      path: '/pdf',
      name: 'pdf',
      component: () => import('../views/PdfView.vue')
    }
  ]
})

export default router