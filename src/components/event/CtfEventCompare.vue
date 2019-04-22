<template>
  <div class="test">
    <div v-if="!loading">
      <p class="loading">Loading...</p>
    </div>
    <div v-else>
      <div class="row item-row">
        <div class="col-md-6 mb-3 mt-3">
          <b-card class="card-item-selected">
            <div class="card-body">
              <div class="row">
                <div class="col-xs-6 mr-2">
                  <a :href="compareEvent1.source">
                    <img
                      class="card-img-selected"
                      :height="250"
                      :src="compareEvent1.logo"
                      alt="card image collar"
                    >
                  </a>
                </div>
                <div class="col-xs-6 ml-4">
                  <p class="card-title-selected" href="compareEvent1.source">{{compareEvent1.name}}</p>
                  <p class="card-text-selected">{{compareEvent1.style}}</p>
                  <p class="card-text-selected">{{compareEvent1.date}} | {{compareEvent1.location}}</p>
                  <p class="card-text-selected">{{compareEvent1.num_of_users}} users</p>
                  <a
                    v-if="compareEvent1.source != null"
                    class="card-text-selected"
                    :href="compareEvent1.source"
                  >{{compareEvent1.source}}</a>
                  <p
                    v-if="compareEvent1.source == null"
                    class="card-text-selected"
                  >No available website link</p>
                </div>
                <div class="col-xs-6 ml-5 pl-4">
                  <p class="card-title-sub">Additional information</p>
                  <b-card class="card-item-small">
                    <p class="card-text-selected">{{compareEvent1.additional_info}}</p>
                  </b-card>
                </div>
              </div>

              <hr>
              <p class="card-title-header">Categories {{event1chosenCategories.length}}</p>
              <div class="row item-row ml-1">
                <div v-for="category in event1chosenCategories" :key="category.id">
                  <p class="mt-2 card-text-selected">
                    <span class="card-categories-selected">{{category.text}}: {{category.frequency}}</span>
                  </p>
                </div>
              </div>

              <hr>
              <p class="card-title-header">Technologies {{event1assignTechs.length}}</p>
              <div style="overflow-y: scroll; height:232px;" class="row item-row">
                <div
                  class="col-md-4 mb-3 mt-3"
                  v-for="assignTech in event1assignTechs"
                  :key="assignTech.id"
                >
                  <b-card class="card-item-compare">
                    <img
                      class="card-img-compare"
                      src="/static/img/icons/apple-touch-icon-180x180.png"
                      alt="card image collar"
                    >
                    <p class="card-title-compare">{{assignTech.name}}</p>
                  </b-card>
                </div>
              </div>
            </div>
          </b-card>
        </div>

        <div class="col-md-6 mb-3 mt-3">
          <b-card class="card-item-selected">
            <div class="card-body">
              <div class="row">
                <div class="col-xs-6 mr-2">
                  <a :href="compareEvent2.source">
                    <img
                      class="card-img-selected smaller-image"
                      :src="compareEvent2.logo"
                      alt="card image collar"
                    >
                  </a>
                </div>
                <div class="col-xs-6 ml-4 mr-5 pr-4">
                  <p class="card-title-selected" href="compareEvent2.source">{{compareEvent2.name}}</p>
                  <p class="card-text-selected">{{compareEvent2.style}}</p>
                  <p class="card-text-selected">{{compareEvent2.date}} | {{compareEvent2.location}}</p>
                  <p class="card-text-selected">{{compareEvent2.num_of_users}} users</p>
                  <a
                    v-if="compareEvent2.source != null"
                    class="card-text-selected"
                    :href="compareEvent2.source"
                  >{{compareEvent2.source}}</a>
                  <p
                    v-if="compareEvent2.source == null"
                    class="card-text-selected"
                  >No available website link</p>
                </div>
                <div class="col-xs-6">
                  <p class="card-title-sub">Additional information</p>
                  <b-card class="card-item-small">
                    <p class="card-text-selected">{{compareEvent2.additional_info}}</p>
                  </b-card>
                </div>
              </div>

              <hr>
              <p class="card-title-header">Categories {{event2chosenCategories.length}}</p>
              <div class="row item-row ml-1">
                <div v-for="category in event2chosenCategories" :key="category.id">
                  <p class="mt-2 card-text-selected">
                    <span class="card-categories-selected">{{category.text}}</span>
                  </p>
                </div>
              </div>

              <hr>
              <p class="card-title-header">Technologies {{event2assignTechs.length}}</p>
              <div style="overflow-y: scroll; height:232px;" class="row item-row">
                <div
                  class="col-md-4 mb-3 mt-3"
                  v-for="assignTech in event2assignTechs"
                  :key="assignTech.id"
                >
                  <b-card class="card-item-compare">
                    <img
                      class="card-img-compare smaller-image"
                      :src="assignTech.logo"
                      alt="card image collar"
                    >
                    <p class="card-title-compare">{{assignTech.name}}</p>
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
export default {
  data() {
    return {
      loading: false,
      techs: [],
      assignments: [],
      events: [],
      categories: [],
      categoryEvents: [],
      event1chosenCategories: [],
      event1assignTechs: [],
      event2chosenCategories: [],
      event2assignTechs: [],
      assignEvents: [],
      bestScalibility: 0,
      assignedCategories: {}
    };
  },
  props: ["compareEvent1", "compareEvent2"],
  watch: {
    compareEvent1: function() {
      this.refresh();
    }
  },
  async created() {
    this.refresh();
  },
  methods: {
    async refresh() {
      this.loading = false;
      this.techs = await api.getManyREST("techs");
      this.events = await api.getManyREST("events");
      this.assignments = await api.getManyREST("eventTechnologies");
      this.categoryEvents = await api.getManyREST("categoryEvents");
      this.categories = await api.getManyREST("categories");
      this.chosenCategories = [];
      await this.getCategories();
      await this.getTechs();
      this.loading = true;
    },
    async getCategories(id, event) {
      for (var e in this.categoryEvents) {
        if (this.categoryEvents[e].event_id == this.compareEvent1.id) {
          for (var category in this.categories) {
            if (
              this.categories[category].id == this.categoryEvents[e].category_id
            ) {
              this.event1chosenCategories.push(this.categories[category]);
            }
          }
        }

        if (this.categoryEvents[e].event_id == this.compareEvent2.id) {
          for (var category in this.categories) {
            if (
              this.categories[category].id == this.categoryEvents[e].category_id
            ) {
              this.event2chosenCategories.push(this.categories[category]);
            }
          }
        }
      }
    },
    async getTechs() {
      this.event1assignTechs = [];
      this.event2assignTechs = [];

      for (var as in this.assignments) {
        for (var t in this.techs) {
          if (this.assignments[as].event_id == this.compareEvent1.id) {
            if (this.techs[t].id == this.assignments[as].technology_id) {
              this.event1assignTechs.push(this.techs[t]);
            }
          }
          if (this.assignments[as].event_id == this.compareEvent2.id) {
            if (this.techs[t].id == this.assignments[as].technology_id) {
              this.event2assignTechs.push(this.techs[t]);
            }
          }
        }
      }
    }
  }
};
</script>