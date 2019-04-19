<template>
  <div class="test">
    <div >
         <div class="row item-row">
            <div class="col-md mb-3 mt-3">

                <b-card class="card-item-selected">
                    <div class="card-body">

                        <div class="row">
                             <div class="col-xs-6 mr-2">
                                <a :href="selectedEvent.source">
                                    <img class="card-img-selected" src="/static/img/icons/apple-touch-icon-180x180.png" alt="card image collar">
                                </a>
                             </div>
                              <div class="col-xs-6 ml-4">
                                <p class="card-title-selected" href="selectedEvent.source">{{selectedEvent.name}}</p>
                                <p class="card-text-selected">{{selectedEvent.style}}</p>
                                <p class="card-text-selected">{{selectedEvent.date}} | {{selectedEvent.location}}</p>
                                <p class="card-text-selected">{{selectedEvent.num_of_users}} users</p>
                                <a v-if="selectedEvent.source != null" class="card-text-selected" :href="selectedEvent.source">{{selectedEvent.source}}</a>
                                <p v-if="selectedEvent.source == null" class="card-text-selected" >No available website link</p>
                              </div>
                              <div class="col-xs-6 ml-5 pl-4">
                                  <p class="card-title-sub" >Additional information</p>
                                  <b-card class="card-item-small">

                                    <p class="card-text-selected">{{selectedEvent.additional_info}}</p>
                                  </b-card>
                              </div>
                        </div>
                        
                    <hr>
                    <p class="card-title-header">Categories {{chosenCategories.length}}</p>
                    <div class="row item-row ml-1">

                            <div v-for="category in chosenCategories" :key="category.id">
                                <p class="mt-2 card-text-selected"> <span class="card-categories-selected">{{category.text}}: {{category.frequency}}</span></p>
                            </div>
                    </div>

                    <hr>
                    <p class="card-title-header">Technologies {{assignTechs.length}}</p>
                    <div style="overflow-y: scroll; height:232px;" class="row item-row">
                            <div class="col-md-4 mb-3 mt-3" v-for="assignTech in assignTechs" :key="assignTech.id">

                                <b-card class="card-item-small">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <img class="card-img-small" src="/static/img/icons/apple-touch-icon-180x180.png" alt="card image collar">
                                        </div>
                                        <div class="col-xs-6 ml-2">
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
import api from '@/api'
import TechnologyDetails from '@/components/TechnologyDetails'
export default {
  data () {
    return {
      loading: false,
      events: [],
      assignments: [],
      techs: [],
      chosenCategories: [],
      assignTechs: [],
      bestScalibility: 0,
      assignedCategories: {},
    }
  },
  props: ['selectedEvent'],
  watch: {
      selectedEvent : function() {
        this.refresh()
      }
  },
  async created () {
    this.refresh()
  },
  methods: {
    async refresh () {
        this.loading = false
        this.events = await api.getManyREST("events")
        this.techs = await api.getManyREST("techs")
        this.assignments = await api.getManyREST("eventTechnologies")
        this.chosenCategories = []
        this.categories = {}
        await this.getTechs()
        this.loading = true
    },
    async getCategories(id){
        var event = []
        event = await api.getManyREST('categoryEvents')
        for (var e in event){
          if (event[e].event_id == id){

              var catObject = await api.getSingleREST('categories', event[e].category_id)
              var found = false
              var foundIndex = 0
              
              for (var key in this.chosenCategories){
                  if (this.chosenCategories[key].id == catObject.id){
                      found = true
                      foundIndex = key
              }

              }
              if (!found){
                  this.chosenCategories.push(catObject)
                  catObject.frequency = 1
                  
              }
              else{
                  this.chosenCategories[foundIndex].frequency += 1
              }
          }
        }
    },
    async getTechs (){
        this.assignTechs = []
        console.log(this.selectedEvent.id);
        
        for (var as in this.assignments){
            if(this.assignments[as].event_id == this.selectedEvent.id){
                for (var ev in this.techs){
                    if (this.techs[ev].id == this.assignments[as].technology_id){
                        this.assignTechs.push(this.techs[ev])

                        //await this.getCategories()
                    }
                }
            }
        }
    },
    async viewDetails(id){
        
    },
    async showModal(id){
        var x = await api.getSingleREST("techs",id)
        this.$modal.show(TechnologyDetails, {
            selectedTechnology: x,
            modal: true,
            /*props: {
                'selectedTechnology' : 1
            },*/
        }, {
            width: 1200,
            height: 550,
            draggable: true,
            adaptive: true
        })
    }   
  }
}
</script>