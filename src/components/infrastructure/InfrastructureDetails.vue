<template>
  <div class="test">
    <div v-if="loading">
      <p class="loading">Loading...</p>
    </div>
    <div v-else>
      <div class="row item-row">
        <div class="col-md mb-3 mt-3">
          <b-card class="card-item-selected">
            <div class="card-body">
              <!-- Event details. -->
              <div class="row">
                <b-card class="card-infrastructures-clear">
                  <div class="col-xs-6 mr-2">
                    <a v-if="event != null" :href="event.source">
                      <img class="infrastruture-image" :src="event.logo" alt="card image collar">
                    </a>
                  </div>
                </b-card>
              </div>
              <hr class="clear">
              <b-card class="card-infrastructures-requirements">
                <h1>Requirements</h1>
                <ul>
                  <li>
                    Vagrant, which can be found at :
                    <a
                      href="https://www.vagrantup.com/"
                    >https://www.vagrantup.com/</a>
                  </li>
                  <li>
                    Git, which can be found at :
                    <a
                      href="https://git-scm.com/downloads"
                    >https://git-scm.com/downloads</a>
                  </li>
                </ul>
              </b-card>

              <hr class="clear">
              <b-card class="card-infrastructures-instructions">
                <h1>Instructions</h1>
                <ol>
                  <li>BASH : git clone -c core.autocrlf=false https://github.com/picoCTF/picoCTF.git</li>
                  <li>BASH : cd picoCTF</li>
                  <li>BASH : vagrant up</li>
                  <li>Navigate to : <a
                    href="http://192.168.2.2/"
                  >http://192.168.2.2/</a></li>
                  <li>Register an account (this user will be the site administrator)</li>
                </ol>
              </b-card>

              <hr class="clear">
              <b-card class="card-infrastructures-requirements">
                <h1>Additional Information</h1>
                <p>
                  PicoCTF wiki :
                  <a
                    href="https://github.com/picoCTF/picoCTF/wiki"
                  >https://github.com/picoCTF/picoCTF/wiki</a>
                </p>
              </b-card>
              <b-card class="card-infrastructures-clear">
                <img
                  src="https://raw.githubusercontent.com/picoCTF/picoCTF/master/docs/architecture.png"
                >
              </b-card>

              <!-- Technologies assigned to the event. -->
              <hr>
              <h1>Technologies</h1>
              <div style="overflow-y: scroll; height:232px;" class="row item-row">
                <div
                  class="col-md-4 mb-3 mt-3"
                  v-for="assignTech in assignTechs"
                  :key="assignTech.id"
                >
                  <b-card class="card-item-small">
                    <div class="row">
                      <div class="col-xs-6">
                        <img
                          class="card-img-small smaller-image"
                          :src="assignTech.logo"
                          alt="No logo"
                        >
                      </div>
                      <div class="col-xs-6 ml-3 mt-3">
                        <p class="card-title-small">{{assignTech.name}}</p>
                        <b-button class="mr-1" @click="showModal(assignTech.id)">See Details</b-button>
                      </div>
                    </div>
                  </b-card>
                </div>
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </div>
    <modals-container/>
  </div>
</template>

<script>
// Import API for server access.
import api from "@/api";
// Import components.
import TechnologyDetails from "@/components/technology/TechnologyDetails";
export default {
  data() {
    return {
      loading: false,
      events: [], // Stores events.
      event: null,
      assignments: [], // Stores eventTechnology assignments.
      techs: [], // Stores technologies.
      categoryEvents: [], // Stores assigned categories.
      categories: [], // Stores categories.
      chosenCategories: [], // Stores the assigned categories for this event.
      assignTechs: [] // Stores the assigned technologies for this event.
    };
  },
  watch: {
    selectedEvent: function() {
      this.refresh();
    }
  },
  async created() {
    this.refresh();
  },
  methods: {
    // Refresh data from the database.
    async refresh() {
      this.loading = true;
      this.events = await api.getManyREST("events?id=3");
      this.techs = await api.getManyREST("techs");
      this.assignments = await api.getManyREST("eventTechnologies");
      this.event = await this.events[0];
      this.techs = await this.getTechs();
      await this.convertBlobs();
      this.loading = false;
    },
    // Convert blobs/images objects from the database to a binary string for displaying.
    async convertBlobs() {
      for (var e in this.events) {
        if (this.events[e].logo != null) {
          var binary = "";
          var bytes = new Uint8Array(this.events[e].logo.data);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          this.events[e].logo = binary;
        }
      }
      for (var tech in this.assignTechs) {
        if (this.assignTechs[tech].logo != null) {
          var binary = "";
          var bytes = new Uint8Array(this.assignTechs[tech].logo.data);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          this.assignTechs[tech].logo = binary;
        }
      }
    },
    async getTechs() {
      this.assignTechs = [];
      for (var as in this.assignments) {
        if (this.assignments[as].event_id == this.event.id) {
          for (var ev in this.techs) {
            if (this.techs[ev].id == this.assignments[as].technology_id) {
              this.assignTechs.push(this.techs[ev]);
            }
          }
        }
      }
    },
    async showModal(id) {
      var x = await api.getSingleREST("techs", id);
      this.$modal.show(
        TechnologyDetails,
        {
          selectedTechnology: x,
          modal: true
        },
        {
          width: 750,
          height: 750
        }
      );
      //this.$modal.hide;
      //this.modal = false
    }
  }
};
</script>