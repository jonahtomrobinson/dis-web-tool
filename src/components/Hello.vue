
<template>
  <div class="container-fluid mt-4">
    <!--<div class="mt-4 mb-4">
        <h1 class="h1">Admin</h1>
        <b-button to="/admin">Admin</b-button>
        <b-button to="/admin/technologies">Techs</b-button>
    </div>-->
    <div id="body">
        <div id="toReplace">
            <div :is="currentComponent"></div>
                <div v-show="!currentComponent" v-for="component in componentsArray" :key="component.index">
                    <button @click="swapComponent(component)">{{component}}</button>
                </div>
            </div>
            <button @click="swapComponent(null)">Close</button>
        </div>
  </div>
</template>

<script>
import AdminTechnologies from '@/components/AdminTechnologies'
import Admin from '@/components/Admin'
export default {
  name: 'body',
  data () {
    return {
        currentComponent: null,
    componentsArray: ['AdminTechnologies', 'Admin']
    }
  },
  components: {
        AdminTechnologies,
        Admin,
    },
  methods: {
    swapComponent: function(component)
    {
      this.currentComponent = component;
    }
  }
}
/*
new Vue({
  el: '#body',
  data: {
    currentComponent: null,
    componentsArray: ['foo', 'bar']
  },
  components: {
    'foo': {
      template: '<h1>Foo component</h1>'
    },
    'bar': {
      template: '<h1>Bar component</h1>'
    }
  },
  methods: {
    swapComponent: function(component)
    {
      this.currentComponent = component;
    }
  }
})
*/
</script>

<!--
<template>
  <div class="container-fluid mt-4">
    <div class="mt-4 mb-4">
        <h1 class="h1">Admin</h1>
        <b-button to="/admin">Admin</b-button>
        <b-button to="/admin/technologies">Techs</b-button>
    </div>
    <div id="body">
        <div id="toReplace">
            <div :is="currentComponent"></div>
                <div v-show="!currentComponent" v-for="(component,index) in componentsArray" :key="index">
                    <button @click="swapComponent(component)">{{component}}</button>
                </div>
            </div>
            <button @click="swapComponent(null)">Close</button>
        </div>
  </div>
</template>

<script>

new Vue({
  el: '#body',
  data: {
    currentComponent: null,
    componentsArray: ['foo', 'bar']
  },
  components: {
    'foo': {
      template: '<h1>Foo component</h1>'
    },
    'bar': {
      template: '<h1>Bar component</h1>'
    }
  },
  methods: {
    swapComponent: function(component)
    {
      this.currentComponent = component;
    }
  }
})

</script>
-->