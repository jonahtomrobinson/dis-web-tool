
<template>
  <div class="container-fluid mt-4">
    <!--<div class="mt-4 mb-4">
        <h1 class="h1">Admin</h1>
        <b-button to="/admin">Admin</b-button>
        <b-button to="/admin/technologies">Techs</b-button>
    </div>-->
        <h1 class="h1">Admin</h1>

        <div id="body">
                    <div v-for="component in componentsArray" :key="component.index">
                        
                    </div>
                    <b-button @click="swapComponent(0)">Technologies</b-button>
                    <b-button @click="swapComponent(1)">CTF Events</b-button>
                <div :is="currentComponent"></div>
            </div>
  </div>
</template>

<script>
import AdminTechnologies from '@/components/AdminTechnologies'
import AdminCtfEvents from '@/components/AdminCtfEvents'
export default {
  name: 'body',
  data () {
    return {
        currentComponent: null,
        componentsArray: ['AdminTechnologies', 'AdminCtfEvents']
    }
  },
  components: {
        AdminTechnologies,
        AdminCtfEvents,
    },
  methods: {
    swapComponent: function(index)
    {
        this.currentComponent = this.componentsArray[index];
    }
  }
}
</script>
