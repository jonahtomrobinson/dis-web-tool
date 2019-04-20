<template>
  <div class="test">
    <div>
        <b-button v-if="currentComponent" class="mr-1" @click="currentComponent = null">Close</b-button>

        <div v-cloak v-bind:modal="false" v-bind:selectedEvent="selectedEvent"  v-bind:compareEvent1="compareEvent1" v-bind:compareEvent2="compareEvent2" :is="currentComponent"></div>
        
        <div v-if="!currentComponent" class="row card-row">
            <div class="col-md-4 mb-3 mt-3">
                <b-card class="card-item-filter">
                    <div class="row ml-1">
                        <div class="col-xs-6 mr-2">
                            <p class="card-title-header">Filter</p>
                        </div>
                        <div class="col-xs-6 mr-2">
                            <b-button v-if="filterCriteria" class="mr-1" @click="filterCriteria = null; filterValue = null">Reset</b-button>
                        </div>
                    </div>
                        <div class="row ml-1">
                            <div class="col-xs-6 mr-2">
                                <b-form-group label="Criteria">
                                    <b-form-select v-model="filterCriteria">
                                        <option :value="'style'">Event Style</option>
                                        <option :value="'categories'">Categories</option>
                                        <option :value="'attendees'">Attendees</option>
                                    </b-form-select>
                                </b-form-group>
                            </div>

                            <div class="col-xs-6 mr-2">
                                <b-form-group label="Value">
                                    <div v-if="filterCriteria == 'style'">
                                        <b-form-select v-model="filterValue">
                                            <option :value="'Jeopardy'">Jeopardy</option>
                                            <option :value="'Attack-Defence'">Attack-Defence</option>
                                            <option :value="'Mixed'">Mixed</option>
                                            <option :value="'Other'">Other</option>
                                        </b-form-select>
                                    </div>

                                    <div v-if="filterCriteria == 'categories'">
                                        <b-form-select v-model="filterValue">
                                            <option  v-for="category in categories" :key="category.id" :value="category.id">{{category.text}}</option>
                                        </b-form-select>
                                    </div>

                                    <div v-if="filterCriteria == 'attendees'">
                                        <b-form-select v-model="filterStatus">
                                            <option :value="'more'">more than</option>
                                            <option :value="'less'">less than</option>
                                        </b-form-select>
                                    </div>
                                </b-form-group>
                            </div>

                            <div class="col-xs-6">
                                <div v-if="filterCriteria == 'attendees'">
                                    <b-form-group label="*">
                                        <b-form-input type="text" v-model="filterValue"></b-form-input>
                                    </b-form-group>
                                </div>
                            </div>
                        </div>
                </b-card>
            </div>

            <div class="col-md-4 mb-3 mt-3">
                <b-card class="card-item-filter">
                        <p class="card-title-header">Compare</p>
                        <div class="row ml-1">

                            <div class="col-xs-6 mr-2">
                                <b-form-group label="Technology 1">
                                    <b-form-select v-model="compareEvent1" >
                                        <option  v-for="event in filteredEvents" :key="event.id" :value="event">{{event.name}}</option>
                                    </b-form-select>
                                </b-form-group>
                            </div>

                            <div class="col-xs-6 mr-3 ml-3 pt-4">
                                    <p class="pt-3">VS</p>
                            </div>

                            <div class="col-xs-6 ml-2">
                                <b-form-group label="Technology 2">
                                    <b-form-select v-model="compareEvent2" >
                                        <option  v-for="event in filteredEvents" :key="event.id" :value="event">{{event.name}}</option>
                                    </b-form-select>
                                </b-form-group>
                            </div>

                            <div class="col-xs-6 mr-3 ml-3 pt-4">
                                    <b-button v-if="compareEvent1 && compareEvent2" class="mt-1" v-on:click="compareTechs()">Submit</b-button>
                            </div>
                        </div>
                </b-card>  
            </div>
        </div>

        <div v-if="currentComponent == null">
            <hr>
            <div class="row card-row">
                <div class="col-md-2 mb-3 mt-3" v-for="event in filteredEvents" :key="event.id">
                    <b-card v-on:click="viewDetails(event)" class="card-item">
                        <img class="card-img" src="/static/img/icons/apple-touch-icon-180x180.png" alt="card image collar">
                        <div class="card-body">
                            <p class="card-title">{{event.name}}</p>
                            <!--<p class="card-text"><span class="card-purpose"> {{event.purpose}}</span></p>-->
                        </div>
                    </b-card>
                </div>
            </div>
        </div>

    </div>
  </div>
</template>

<script>
import api from '@/api'
import CtfEventDetails from './CtfEventDetails'
import CtfEventCompare from './CtfEventCompare'
export default {
  data () {
    return {
      loading: false,
      events: [],
      categories: [],
      categoryEvents: [],
      filteredEvents: [],
      currentComponent: null,
      selectedEvent: {},
      filterCriteria: null,
      filterStatus : null,
      filterValue : null,
      compareEvent1: null,
      compareEvent2: null
    }
  },
   watch: {
      filterValue : function() {
        this.filterEvents()
      },
      filterCriteria : function(){
          this.filterValue = null
          this.filterStatus = null
      }
  },
  async created () {
    this.refresh()
  },
  methods: {
    async refresh () {
        this.loading = true
        this.filteredEvents = []
        this.events = await api.getManyREST("events")
        await this.filterEvents()
        this.categories = await api.getManyREST("categories")
        this.categoryEvents = await api.getManyREST('categoryEvents')
        this.loading = false
    },
    async filterEvents(){
        this.filteredEvents = []
        this.compareEvent1 = null
        this.compareEvent2 = null

        if (this.filterCriteria == "style"){
            for (var event in this.events){
                if (this.events[event].style == this.filterValue){
                    this.filteredEvents.push(this.events[event])
                }
            }
        }
        else if (this.filterCriteria == 'categories'){
            for (var e in this.categoryEvents){
                if (this.categoryEvents[e].category_id == this.filterValue){
                    for (var event in this.events){
                        if (this.events[event].id == this.categoryEvents[e].event_id){
                            this.filteredEvents.push(this.events[event])
                        }
                    }
                }
            }
        }
        else if (this.filterCriteria == "attendees"){
            if (this.filterStatus == 'more'){
                for (var event in this.events){
                    if (this.events[event].num_of_users > this.filterValue){
                        this.filteredEvents.push(this.events[event])
                    }
                }
            }
            else if (this.filterStatus == 'less'){
                for (var event in this.events){
                    if (this.events[event].num_of_users < this.filterValue){
                        this.filteredEvents.push(this.events[event])
                    }
                }
            }
        }
        else{
            this.filteredEvents = this.events
        }
        
    },
    async viewDetails(event){
        this.selectedEvent = event
        this.currentComponent = CtfEventDetails
    },
    async compareTechs(){
        this.currentComponent = CtfEventCompare
    }
  }
}
</script>