<template>
  <div class="test">
    <div>
      <!-- Close component button. -->
      <b-button v-if="currentComponent" class="mr-1" @click="currentComponent = null">Close</b-button>

      <!-- Details or Compare component bind. -->
      <div v-cloak :is="currentComponent"></div>

      <!-- Display clickable events. -->
      <div v-if="currentComponent == null">
        <hr>
        <div v-if="loading">
          <p>Loading...</p>
        </div>
        <div v-else>
          <div class="row card-row">
            <div class="col-md-6 mb-3 mt-3">
              <b-card v-on:click="viewDetails(event)" class="card-item">
                <img class="card-img" :src="event.logo" alt>
                <div class="card-body">
                  <p class="card-title">PicoCTF Framework</p>
                </div>
              </b-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import API for server access.
import api from "@/api";
// Import components.
import InfrastructureDetails from "./InfrastructureDetails";
export default {
  data() {
    return {
      loading: false,
      events: [], // Stores events.
      event: {},
      currentComponent: null
    };
  },
  async created() {
    this.refresh();
  },
  methods: {
    // Refresh data from the database.
    async refresh() {
      this.loading = true;
      this.events = await api.getManyREST("events?id=3");
      await this.convertBlobs();
      this.event = this.events[0];
      this.loading = false;
    },
    // Convert blobs/images objects from the database to a binary string for displaying.
    async convertBlobs() {
      for (var event in this.events) {
        if (this.events[event].logo != null) {
          var binary = "";
          var bytes = new Uint8Array(this.events[event].logo.data);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          this.events[event].logo = binary;
        }
      }
    },
    // Change component to CtfEventDetails.
    async viewDetails(event) {
      this.selectedEvent = event;
      this.currentComponent = InfrastructureDetails;
    }
  }
};
</script>