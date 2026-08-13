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
import { applyRouteSeo, trackPageView, type SeoDefinition } from "@/composables/useSeo";

const seo = (definition: SeoDefinition) => ({ seo: definition });

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
          meta: seo({
            title: "TheStarArt_ - Animes, Arte e Programação",
            description: "Universo digital pessoal do TheStarArt: arte, programação, jogos, pensamentos e cultura da internet.",
          }),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
          meta: seo({
            title: "Sobre | TheStarArt_",
            description: "Conheça TheStarArt, artista, desenvolvedor e criador deste universo digital pessoal.",
          }),
        },
        {
          path: 'changelog',
          name: 'changelog',
          component: () => import('@/views/ChangelogView.vue'),
          meta: seo({
            title: "Changelog | TheStarArt_",
            description: "Atualizações, experimentos e mudanças no universo digital TheStarArt_.",
          }),
        },
        {
          path: 'diary',
          name: 'diary',
          component: () => import('@/views/themes/MiraiNikki/Diary.vue'),
          meta: seo({
            title: "Diário | TheStarArt_",
            description: "Anotações e experiências pessoais...",
          }),
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/views/blog/BlogView.vue'),
          meta: seo({
            title: "Blog | TheStarArt_",
            description: "Textos sobre arte, tecnologia, jogos, animes e experiências pessoais.",
          }),
        },
        {
          path: 'post/:slug',
          name: 'post.show',
          component: () => import('@/views/blog/PostView.vue'),
          meta: seo({
            title: "Post | TheStarArt_",
            description: "Leia um texto do blog TheStarArt_.",
          }),
        }
      ],
    },
    {
      path: '/choose-your-lang',
      name: 'choose-lang',
      component: LanguageSelector,
      meta: seo({ title: "Idioma | TheStarArt_", description: "Seleção de idioma do TheStarArt_", robots: "noindex, nofollow" }),
    },
    {
      path: '/star-station',
      name: 'star-station',
      component: () => import('@/features/star-station/views/StarStationView.vue'),
      meta: seo({ title: "Star Station | TheStarArt_", description: "Uma experiência interativa no universo TheStarArt_." }),
    },
    {
      path: '/thumbnail-generator',
      name: 'thumbnail-generator',
      component: () => import('@/views/ThumbnailGeneratorView.vue'),
      meta: seo({
        title: "Thumbnail Generator | TheStarArt_",
        description: "Crie thumbnails retrô em 1280 por 720 diretamente no navegador.",
      }),
    },
    {
      path: '/justcryatthispoint',
      name: 'justcryatthispoint',
      component: () => import('@/views/FourthView.vue'),
      meta: seo({ title: "TheStarArt_", description: "Área restrita", robots: "noindex, nofollow" }),

    },
    {
      path: '/noaccess',
      name: 'noaccess',
      component: TryAccess,
      meta: seo({ title: "Acesso restrito | TheStarArt_", description: "Área restrita", robots: "noindex, nofollow" }),

    },
    {
      path: '/AllTheThingsSheSaid',
      name: 'AllTheThingsSheSaid',
      component: AllTheThingsSheSaid,
      meta: seo({ title: "TheStarArt_", description: "Área restrita", robots: "noindex, nofollow" }),

    },

    {
      path: '/admin',
      component: AdminLayout,
      meta: seo({ title: "Administração | TheStarArt_", description: "Área administrativa", robots: "noindex, nofollow" }),
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
      meta: seo({ title: "Entrar | TheStarArt_", description: "Acesso administrativo", robots: "noindex, nofollow" }),
    },


    {
      path: "/error/:code",
      name: "error",
      component: ErrorView,
      props: true,
      meta: seo({ title: "Página não encontrada | TheStarArt_", description: "A página solicitada não está disponível.", robots: "noindex, nofollow" }),
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/error/404",
    },
  ],

})

router.afterEach((to) => {
  applyRouteSeo(to);
  trackPageView(to.fullPath);
});

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
