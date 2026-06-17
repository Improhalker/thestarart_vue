import { createRouter, createWebHistory } from 'vue-router'
// Layouts
import TryAccess from '@/components/global/access/TryAccess.vue'
import AllTheThingsSheSaid from '@/components/global/access/AllTheThingsSheSaid.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import LanguageSelector from '@/components/global/translate/LanguageSelector.vue'

import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
        {
          path: 'changelog',
          name: 'changelog',
          component: () => import('@/views/ChangelogView.vue'),
        },
        {
          path: 'diary',
          name: 'diary',
          component: () => import('@/views/themes/MiraiNikki/Diary.vue'),
        }
      ],
    },
    {
      path: '/choose-your-lang',
      name: 'choose-lang',
      component: LanguageSelector
    },
    {
      path: '/justcryatthispoint',
      name: 'justcryatthispoint',
      component: () => import('@/views/FourthView.vue'),

    },
    {
      path: '/noaccess',
      name: 'noaccess',
      component: TryAccess,

    },
    {
      path: '/AllTheThingsSheSaid',
      name: 'AllTheThingsSheSaid',
      component: AllTheThingsSheSaid,

    },

    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'admin.dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
        },
        {
          path: 'musics',
          name: 'admin.musics',
          component: () => import('@/views/admin/MusicListView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
    }
  ],
})

router.beforeEach((to, from, next) => {
  const lang = localStorage.getItem('lang')

  if (!lang && to.path !== '/choose-your-lang') {
    next({
      path: '/choose-your-lang',
      query: {
        redirect: to.fullPath
      }
    })
    return
  }

  const isLogged = localStorage.getItem('auth')

  if (to.path.startsWith('/admin') && !isLogged) {
    next('/login')
    return
  }

  next()
})

export default router