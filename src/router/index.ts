import { createRouter, createWebHistory } from 'vue-router'
// Layouts
import TryAccess from '@/components/global/access/TryAccess.vue'
import AllTheThingsSheSaid from '@/components/global/access/AllTheThingsSheSaid.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import LanguageSelector from '@/components/global/translate/LanguageSelector.vue'
import ErrorView from "@/views/ErrorView.vue";
import HomeView from '@/views/HomeView.vue'
import { useAuth } from "@/composables/useAuth";

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
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/views/blog/BlogView.vue'),
        },
        {
          path: 'post/:slug',
          name: 'post.show',
          component: () => import('@/views/blog/PostView.vue'),
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
        {
          path: 'changelog',
          name: 'admin.changelog',
          component: () => import('@/views/admin/ChangelogView.vue'),
        },
        {
          path: 'blog',
          children: [
            {
              path: '',
              name: 'admin.blog.list',
              component: () => import('@/views/admin/blog/BlogListView.vue'),
            },

            {
              path: 'editor/:id?',
              name: 'admin.blog.editor',
              component: () => import('@/views/admin/blog/BlogEditView.vue'),
            }
          ]
        }
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
    },


    {
      path: "/error/:code",
      name: "error",
      component: ErrorView,
      props: true,
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/error/404",
    },
  ],

})

router.beforeEach(async (to, from) => {
  const auth = useAuth();

  if (to.path.startsWith('/admin')) {
    // O estado em memória pode ainda não estar preenchido ao trocar entre
    // páginas administrativas (por exemplo, logo após um reload). Nesse caso,
    // confirme a sessão antes de decidir pelo redirecionamento, em vez de
    // abortar a navegação interna.
    const user = auth.isAuthenticated.value
      ? auth.user.value
      : await auth.checkSession();

    if (!user) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      };
    }
  }

  if (to.name === 'login') {
    const user = await auth.checkSession();
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/admin';

    if (user && redirect.startsWith('/') && !redirect.startsWith('//')) {
      return redirect;
    }
  }

  const lang = localStorage.getItem('lang');

  if (!lang && to.path !== '/choose-your-lang' && to.name !== 'login') {
    return {
      path: '/choose-your-lang',
      query: { redirect: to.fullPath },
    };
  }
})

export default router
