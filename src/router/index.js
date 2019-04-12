import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import PostsManager from '@/components/PostsManager'
import Technologies from '@/components/Technologies'
import CtfEvents from '@/components/CtfEvents'
import InfrastructureCreator from '@/components/InfrastructureCreator'
import Auth from '@okta/okta-vue'

Vue.use(Auth, {
  issuer: 'https://dev-715478.okta.com/oauth2/default',
  client_id: '0oagr3dglwp1CJEYp356',
  redirect_uri: 'http://localhost:8080/implicit/callback',
  scope: 'openid profile email'
})

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    },
    {
      path: '/posts-manager',
      name: 'PostsManager',
      component: PostsManager,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/technologies',
        name: 'Technologies',
        component: Technologies,
        
    },
    {
        path: '/ctf-events',
        name: 'CtfEvents',
        component: CtfEvents,
        
    },
    {
        path: '/infrastructure-creator',
        name: 'InfrastructureCreator',
        component: InfrastructureCreator,
        
    }
  ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router