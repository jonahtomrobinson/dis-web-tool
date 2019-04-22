
<template>
  <div>
    <!-- Buttons allowing traversal of admin component options. -->
    <div id="body">
      <b-button class="mr-1" @click="swapComponent(0)">Technologies</b-button>
      <b-button class="mr-1" @click="swapComponent(1)">CTF Events</b-button>
      <b-button class="mr-1" @click="swapComponent(2)">Assign Techs / Events</b-button>
      <b-button class="mr-1" @click="swapComponent(3)">Challenge Categories</b-button>
      <b-button class="mr-1" @click="swapComponent(4)">Purposes</b-button>
      <div :is="currentComponent"></div>
    </div>
  </div>
</template>

<script>
// Importing components.
import AdminTechnologies from "./AdminTechnologies";
import AdminCtfEvents from "./AdminCtfEvents";
import AdminAssign from "./AdminAssign";
import AdminPurposes from "./AdminPurposes";
import AdminCategories from "./AdminCategories";
export default {
  name: "body",
  data() {
    return {
      currentComponent: null, // Currently selected component.
      componentsArray: [
        "AdminTechnologies",
        "AdminCtfEvents",
        "AdminAssign",
        "AdminCategories",
        "AdminPurposes"
      ] // Array of possible component options.
    };
  },
  async created() {
    this.swapComponent(0);
  },
  components: {
    AdminTechnologies,
    AdminCtfEvents,
    AdminAssign,
    AdminPurposes,
    AdminCategories
  },
  methods: {
    // Swap selected component based on button click.
    swapComponent: function(index) {
      this.currentComponent = this.componentsArray[index];
    }
  }
};
</script>
