
<template>
  <div>
        <div id="body">
            <b-button class="mr-1" @click="swapComponent(0)">Technologies</b-button>
            <b-button class="mr-1" @click="swapComponent(1)">CTF Events</b-button>
            <b-button class="mr-1" @click="swapComponent(3)">Assign Techs / Events</b-button>
            <b-button class="mr-1" @click="swapComponent(4)">Challenge Categories</b-button>
            <b-button class="mr-1" @click="swapComponent(5)">Purposes</b-button>
            <div :is="currentComponent"></div>
        </div>
  </div>
</template>

<script>
import AdminTechnologies from '@/components/AdminTechnologies'
import AdminCtfEvents from '@/components/AdminCtfEvents'
import AdminPurposes from '@/components/AdminPurposes'
export default {
  name: 'body',
  data () {
    return {
        currentComponent: null,
        componentsArray: ['AdminTechnologies', 'AdminCtfEvents', 'AdminAssign', 'AdminCategories', 'AdminPurposes']
    }
  },
  async created () {
    this.swapComponent(0)
  },
  components: {
        AdminTechnologies,
        AdminCtfEvents,
        AdminPurposes
    },
  methods: {
    swapComponent: function(index)
    {
        this.currentComponent = this.componentsArray[index];
    }
  }
}
</script>
