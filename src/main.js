import { createApp } from 'vue'
import { createRouter, createWebHistory} from 'vue-router'

//Composables
import useAuthUser from './composables/UseAuthUser'

//Pages
import App from './App.vue'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import PasswordUpdateSuccess from './pages/PasswordUpdateSuccess.vue'
import VerifyEmail from './pages/VerifyEmail.vue'
import Deck from './pages/Deck.vue'
import CardBuilder from './pages/CardBuilder.vue'
import Study from './pages/Study.vue'

//UI Frameworks
import Equal from 'equal-vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VMdEditor from '@kangc/v-md-editor'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import hljs from 'highlight.js'
import enUS from '@kangc/v-md-editor/lib/lang/en-US'

import vueShortkey from 'vue-shortkey'

VMdEditor.lang.use('en-US', enUS)
VMdPreview.use(githubTheme, {
    Hljs: hljs
})


//Dark mode
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
isDark.value = false

//CSS
import 'equal-vue/dist/style.css'
import './styles/element-plus-theme.scss'
import './styles/index.css'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'

//Auth functions
const { userIsLoggedIn, setAuthStateChangedListener } = useAuthUser()

//Vue Router routes
const routes = [
    { name: 'Home', path: '/flashcards-app/', component: Home, meta: { requiresAuth: true } },
    { name: 'Login', path: '/flashcards-app/login', component: Login },
    { name: 'Register', path: '/flashcards-app/register', component: Register },
    { name: 'Verify Email', path: '/flashcards-app/verify', component: VerifyEmail },
    { name: 'Password Updated Successfully', path: '/passwordupdated', component: PasswordUpdateSuccess },
    { name: 'View Deck', path: '/flashcards-app/deck/:deckId', component: Deck },
    { name: 'Create Cards', path: '/flashcards-app/deck/:deckId/cards/add', component: CardBuilder },
    { name: 'Edit Card', path: '/flashcards-app/deck/:deckId/cards/:noteId/edit', component: CardBuilder},
    { name: 'Study Deck', path: '/flashcards-app/deck/:deckId/study', component: Study }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

//Authentication nav guard
router.beforeEach((to) => {
    
    if (!userIsLoggedIn() && to.meta.requiresAuth) return { path: '/login' }
    else if (userIsLoggedIn() && (to.path == '/login') ) return { path: '/' }
})

//Keep authentication up-to-date
setAuthStateChangedListener((event, session) => {
    if (event == 'SIGNED_OUT') router.go('/login')
})

//App creation
const app = createApp(App)

VMdEditor.use(githubTheme, {
    Hljs: hljs,
});

//Using
app.use(router)
app.use(Equal)
app.use(ElementPlus)
app.use(VMdEditor)
app.use(VMdPreview)
app.use(vueShortkey)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//Mount
app.mount('#app')