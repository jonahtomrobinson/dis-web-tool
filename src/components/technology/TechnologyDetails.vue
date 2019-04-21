<template>
  <div class="test">
    <div v-if="!loading">
      <p class="loading">Loading...</p>
    </div>
    <div v-else>
      <div class="row item-row">
        <div class="col-md mb-3 mt-3">
          <b-card class="card-item-selected">
            <div class="card-body">
              <div class="row">
                <div class="col-xs-6 mr-2">
                  <a :href="selectedTechnology.source">
                    <img
                      class="card-img-selected"
                      :height="250"
                      :src="selectedTechnology.logo"
                      alt="card image collar"
                    >
                  </a>
                </div>
                <div class="col-xs-6 ml-4">
                  <p class="card-title-selected" href="selectedTechnology.source">
                    {{selectedTechnology.name}}
                    <span class="card-purpose-selected">{{purpose.text}}</span>
                  </p>
                  <p class="card-text-selected">{{selectedTechnology.description}}</p>
                  <p class="card-text-selected">Cost: {{selectedTechnology.cost}}</p>
                  <p class="card-text-selected">Largest user count: {{bestScalibility}}</p>
                  <a
                    v-if="selectedTechnology.source != null"
                    class="card-text-selected"
                    :href="selectedTechnology.source"
                  >{{selectedTechnology.source}}</a>
                  <p
                    v-if="selectedTechnology.source == null"
                    class="card-text-selected"
                  >No available website link</p>
                </div>
              </div>

              <hr>
              <p class="card-title-header">Categories {{chosenCategories.length}}</p>
              <div class="row item-row ml-1">
                <div v-for="category in chosenCategories" :key="category.id">
                  <p class="mt-2 card-text-selected">
                    <span class="card-categories-selected">{{category.text}}: {{category.frequency}}</span>
                  </p>
                </div>
              </div>

              <hr>
              <p class="card-title-header">CTF Events {{assignEvents.length}}</p>
              <div
                v-if="modal == false"
                style="overflow-y: scroll; height:232px;"
                class="row item-row"
              >
                <div
                  class="col-md-4 mb-3 mt-3"
                  v-for="assignEvent in assignEvents"
                  :key="assignEvent.id"
                >
                  <b-card class="card-item-small">
                    <div class="row">
                      <div class="col-xs-6">
                        <img
                          class="card-img-small"
                          src="/static/img/icons/apple-touch-icon-180x180.png"
                          alt="card image collar"
                        >
                      </div>
                      <div class="col-xs-6 ml-2">
                        <p class="card-title-small">{{assignEvent.name}}</p>
                        <p class="card-text-small">{{assignEvent.style}} | {{assignEvent.date}}</p>
                        <p
                          class="card-text-small"
                        >{{assignEvent.location}} | {{assignEvent.num_of_users}} Attendees</p>
                        <b-button class="mr-1" @click="showModal(assignEvent.id)">See Details</b-button>
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
  </div>
</template>

<script>
import api from "@/api";
import CtfEventDetails from "@/components/event/CtfEventDetails";
export default {
  data() {
    return {
      loading: false,
      techs: [],
      assignments: [],
      events: [],
      chosenCategories: [],
      assignEvents: [],
      bestScalibility: 0,
      purpose: {},
      assignedCategories: {}
    };
  },
  props: ["selectedTechnology", "modal"],
  watch: {
    selectedTechnology: function() {
      this.refresh();
    }
  },
  async created() {
    if (this.selectedTechnology == undefined) {
      this.selectedTechnology = await api.getSingleREST("techs", 5);
    }
    await this.refresh();
  },
  methods: {
    async refresh() {
      this.loading = false;
      this.getPurpose();
      this.techs = await api.getManyREST("techs");
      this.events = await api.getManyREST("events");
      this.assignments = await api.getManyREST("eventTechnologies");
      this.chosenCategories = [];
      this.categories = {};
      await this.getEvents();
      this.loading = true;
    },
    async getCategories(id) {
      var event = [];
      event = await api.getManyREST("categoryEvents");
      for (var e in event) {
        if (event[e].event_id == id) {
          var catObject = await api.getSingleREST(
            "categories",
            event[e].category_id
          );
          var found = false;
          var foundIndex = 0;

          for (var key in this.chosenCategories) {
            if (this.chosenCategories[key].id == catObject.id) {
              found = true;
              foundIndex = key;
            }
          }
          if (!found) {
            this.chosenCategories.push(catObject);
            catObject.frequency = 1;
          } else {
            this.chosenCategories[foundIndex].frequency += 1;
          }
        }
      }
    },
    async getPurpose() {
      this.purpose = await api.getSingleREST(
        "purposes",
        this.selectedTechnology.purpose_id
      );
    },
    async getEvents() {
      this.assignEvents = [];
      for (var as in this.assignments) {
        if (this.assignments[as].technology_id == this.selectedTechnology.id) {
          for (var ev in this.events) {
            if (this.events[ev].id == this.assignments[as].event_id) {
              this.assignEvents.push(this.events[ev]);

              if (this.events[ev].num_of_users > this.bestScalibility) {
                this.bestScalibility = this.events[ev].num_of_users;
              }

              await this.getCategories(this.events[ev].id);
            }
          }
        }
      }
    },
    async showModal(id) {
      var x = await api.getSingleREST("events", id);
      this.$modal.show(
        CtfEventDetails,
        {
          selectedEvent: x,
          modal: true
        },
        {
          width: 750,
          height: 750,
          draggable: true,
          adaptive: true
        }
      );
      //this.modal = false
    }
  }
};
</script>