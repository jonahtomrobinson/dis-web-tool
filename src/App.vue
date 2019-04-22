<template>
  <div id="app">
    <b-navbar toggleable="md">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <!--<b-navbar-brand to="/">Dissertation web-tool</b-navbar-brand>-->
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="mt-3">
          <b-nav-item to="/technologies">Technologies</b-nav-item>
          <b-nav-item to="/ctf-events">CTF Events</b-nav-item>
          <b-nav-item to="/infrastructures">Infrastructures</b-nav-item>
          <b-nav-item class="auth-nav" href="#" @click.prevent="login" v-if="!activeUser">Login</b-nav-item>
          <b-nav-item class="auth-nav" href="#" @click.prevent="logout" v-else>Logout</b-nav-item>
          <b-nav-item v-if="activeUser" to="/admin">Admin</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="container-fluid m-3">
    <!-- routes will be rendered here -->
    <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
        loggedin:false,
        activeUser: null
    }
  },
  async created () {
    await this.refreshActiveUser()
  },
  watch: {
    // Wverytime a route is changed refresh the activeUser.
    '$route': 'refreshActiveUser'
  },
  methods: {
    login () {
      this.$auth.loginRedirect()
    },
    async refreshActiveUser () {
      this.activeUser = await this.$auth.getUser()
    },
    async logout () {
      await this.$auth.logout()
      await this.refreshActiveUser()
      this.$router.push('/')
    }
  }
}
</script>