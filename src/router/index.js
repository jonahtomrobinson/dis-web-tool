import Vue from 'vue'
import Router from 'vue-router'
import Technologies from '@/components/technology/Technologies'
import CtfEvents from '@/components/event/CtfEvents'
import Infrastructures from '@/components/infrastructure/Infrastructures'
import Admin from '@/components/admin/Admin'
import Auth from '@okta/okta-vue'

// Authenticaion details.
Vue.use(Auth, {
    issuer: 'https://dev-715478.okta.com/oauth2/default',
    client_id: '0oagr3dglwp1CJEYp356',
    redirect_uri: 'http://localhost:8080/implicit/callback',
    scope: 'openid profile email'
})

// Router for webpages.
Vue.use(Router)
let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: '/technologies',
            component: Technologies
        },
        {
            path: '/implicit/callback',
            component: Auth.handleCallback()
        },
        {
            path: '/technologies',
            name: 'Technologies',
            component: Technologies
        },
        {
            path: '/ctf-events',
            name: 'CtfEvents',
            component: CtfEvents
        },
        {
            path: '/infrastructures',
            name: 'Infrastructures',
            component: Infrastructures
        },
        {
            path: '/admin',
            name: 'Admin',
            component: Admin,
            meta: {
                requiresAuth: true
            }
        },
    ]
})

// Before for each webpage transition, check whether authentication is needed and redirect as necessary.
router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router