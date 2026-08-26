import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n, setLocale } from './i18n'
import { setUnauthorizedHandler } from './composables/api/useApi'
import { useAuth } from './composables/useAuth'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)
setLocale(i18n.global.locale.value)

const auth = useAuth()

setUnauthorizedHandler(() => {
  auth.handleSessionExpired()

  const currentRoute = router.currentRoute.value

  if (currentRoute.name !== 'login') {
    void router.replace({
      name: 'login',
      query: {
        redirect: currentRoute.fullPath,
        reason: 'expired',
      },
    })
  }
})


app.mount('#app')
