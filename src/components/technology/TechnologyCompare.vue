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
                                <a :href="compareTech1.source">
                                    <img class="card-img-selected" src="/static/img/icons/apple-touch-icon-180x180.png" alt="card image collar">
                                </a>
                             </div>
                              <div class="col-xs-6 ml-4">
                                <p class="card-title-selected" href="compareTech1.source">{{compareTech1.name}} <span class="card-purpose-selected">{{compareTech1.purpose}}</span></p>
                                <p class="card-text-selected">{{compareTech1.description}}</p>
                                <p class="card-text-selected">Cost: {{compareTech1.cost}}</p>
                                <p class="card-text-selected">Largest user count: {{compareTech1.bestScalibility}}</p>
                                <a v-if="compareTech1.source != null" class="card-text-selected" :href="compareTech1.source">{{compareTech1.source}}</a>
                                <p v-if="compareTech1.source == null" class="card-text-selected" >No available website link</p>
                              </div>
                        </div>
                        
                    <hr>
                    <p class="card-title-header">Categories {{tech1chosenCategories.length}}</p>
                    <div class="row item-row ml-1">

                            <div v-for="category in tech1chosenCategories" :key="category.id">
                                <p class="mt-2 card-text-selected"> <span class="card-categories-selected">{{category.text}}: {{category.frequency}}</span></p>
                            </div>
                    </div>

                    <hr>
                    <p class="card-title-header">CTF Events {{tech1assignEvents.length}}</p>
                    <div style="overflow-y: scroll; height:232px;" class="row item-row">
                            <div class="col-md-4 mb-3 mt-3" v-for="assignEvent in tech1assignEvents" :key="assignEvent.id">
                                <b-card class="card-item-compare">
                                            <img class="card-img-compare" src="/static/img/icons/apple-touch-icon-180x180.png" alt="card image collar">
                                            <p class="card-title-compare">{{assignEvent.name}}</p>
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
                                <a :href="compareTech2.source">
                                    <img class="card-img-selected" src="/static/img/icons/apple-touch-icon-180x180.png" alt="card image collar">
                                </a>
                             </div>
                              <div class="col-xs-6 ml-4">
                                <p class="card-title-selected" href="compareTech2.source">{{compareTech2.name}} <span class="card-purpose-selected">{{compareTech2.purpose}}</span></p>
                                <p class="card-text-selected">{{compareTech2.description}}</p>
                                <p class="card-text-selected">Cost: {{compareTech2.cost}}</p>
                                <p class="card-text-selected">Largest user count: {{compareTech2.bestScalibility}}</p>
                                <a v-if="compareTech2.source != null" class="card-text-selected" :href="compareTech2.source">{{compareTech2.source}}</a>
                                <p v-if="compareTech2.source == null" class="card-text-selected" >No available website link</p>
                              </div>
                        </div>
                        
                    <hr>
                    <p class="card-title-header">Categories {{tech2chosenCategories.length}}</p>
                    <div class="row item-row ml-1">
                        <div v-for="category in tech2chosenCategories" :key="category.id">
                            <p class="mt-2 card-text-selected"> <span class="card-categories-selected">{{category.text}}: {{category.frequency}}</span></p>
                        </div>
                    </div>

                    <hr>
                    <p class="card-title-header">CTF Events {{tech2assignEvents.length}}</p>
                    <div style="overflow-y: scroll; height:232px;" class="row item-row">
                            <div class="col-md-4 mb-3 mt-3" v-for="assignEvent in tech2assignEvents" :key="assignEvent.id">
                                <b-card class="card-item-compare">
                                    <img class="card-img-compare" src="/static/img/icons/apple-touch-icon-180x180.png" alt="card image collar">
                                    <p class="card-title-compare">{{assignEvent.name}}</p>
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
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      techs: [],
      assignments: [],
      events: [],
      tech1chosenCategories: [],
      tech1assignEvents: [],
      tech2chosenCategories: [],
      tech2assignEvents: [],
      assignEvents: [],
      bestScalibility: 0,
      assignedCategories: {},
    }
  },
  props: ['compareTech1','compareTech2'],
  watch: {
      compareTech1 : function() {
        this.refresh()
      }
  },
  async created () {
    this.refresh()
  },
  methods: {
    async refresh () {
        this.loading = false
        this.getPurpose()
        this.techs = await api.getManyREST("techs")
        this.events = await api.getManyREST("events")
        this.assignments = await api.getManyREST("eventTechnologies")
        this.chosenCategories = []
        this.categories = {}
        await this.getEvents()
        this.loading = true
    },
    async getCategories(id, tech){
        var event = []
        event = await api.getManyREST('categoryEvents')
        
        for (var e in event){
          if (event[e].event_id == id && tech == 'tech1'){

              var catObject = await api.getSingleREST('categories', event[e].category_id)
              var found = false
              var foundIndex = 0
              
              for (var key in this.tech1chosenCategories){
                  if (this.tech1chosenCategories[key].id == catObject.id){
                      found = true
                      foundIndex = key
              }

              }
              if (!found){
                  this.tech1chosenCategories.push(catObject)
                  catObject.frequency = 1
                  
              }
              else{
                  this.tech1chosenCategories[foundIndex].frequency += 1
              }
          }

           if (event[e].event_id == id && tech == 'tech2'){

              var catObject = await api.getSingleREST('categories', event[e].category_id)
              var found = false
              var foundIndex = 0
              
              for (var key in this.tech2chosenCategories){
                  if (this.tech2chosenCategories[key].id == catObject.id){
                      found = true
                      foundIndex = key
              }

              }
              if (!found){
                  this.tech2chosenCategories.push(catObject)
                  catObject.frequency = 1
                  
              }
              else{
                  this.tech2chosenCategories[foundIndex].frequency += 1
              }
          }
        }
    },
    async getPurpose(){
        this.compareTech1.purpose = (await api.getSingleREST("purposes", this.compareTech1.purpose_id)).text
        this.compareTech2.purpose = (await api.getSingleREST("purposes", this.compareTech2.purpose_id)).text
    },
    async getEvents (){
        this.tech1assignEvents = []
        this.compareTech1.bestScalibility = 0

        this.tech2assignEvents = []
        this.compareTech2.bestScalibility = 0

        for (var as in this.assignments){
            for (var ev in this.events){

                if(this.assignments[as].technology_id == this.compareTech1.id){
                    if (this.events[ev].id == this.assignments[as].event_id){

                        this.tech1assignEvents.push(this.events[ev])

                        if (this.events[ev].num_of_users > this.compareTech1.bestScalibility){
                            this.compareTech1.bestScalibility = this.events[ev].num_of_users
                        }

                        await this.getCategories(this.events[ev].id, 'tech1')
                    }
                }

                if(this.assignments[as].technology_id == this.compareTech2.id){
                    if (this.events[ev].id == this.assignments[as].event_id){

                        this.tech2assignEvents.push(this.events[ev])

                        if (this.events[ev].num_of_users > this.compareTech2.bestScalibility){
                            this.compareTech2.bestScalibility = this.events[ev].num_of_users
                        }

                        await this.getCategories(this.events[ev].id, 'tech2')
                    }
                }
            }

            
        }
    },
    async viewDetails(id){
        
    }
  }
}
</script>