import Vue from 'vue'
import Router from 'vue-router'
import Technologies from '@/components/technology/Technologies'
import CtfEvents from '@/components/event/CtfEvents'
import InfrastructureCreator from '@/components/InfrastructureCreator'
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
            path: '/infrastructure-creator',
            name: 'InfrastructureCreator',
            component: InfrastructureCreator
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

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router