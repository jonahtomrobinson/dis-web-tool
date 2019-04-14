<template>
<div class="mt-4">
    <b-row>
      <b-col>
        <table class="table table-striped">

          <!-- Table head -->  
          <thead>
            <tr>
              <th>ID</th>
              <th>Logo</th>
              <th>Name</th>
              <th>Date</th>
              <th>Number of users</th>
              <th>Hardware info</th>
              <th>Additional info</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

            <!-- Table body -->  
          <tbody>
            <!--<b-alert :show="loading" variant="info">Loading...</b-alert>-->
            <tr v-for="event in events" :key="event.id">
              <td>{{ event.id }}</td>
              <td>{{ event.logo }}</td>
              <td>{{ event.name }}</td>
              <td>{{ event.date }}</td>
              <td>{{ event.num_of_users }}</td>
              <td>{{ event.hardware_info }}</td>
              <td>{{ event.additional_info }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="populateEventToEdit(event)">Edit</a> -
                <a href="#" @click.prevent="deleteEvent(event.id)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>

        <!-- Form -->  
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Post ID#' + model.id : 'Add new CTF event')">
          <form enctype="multipart/form-data" @submit.prevent="saveEvent">
            <b-form-group label="Logo">
              <!--<b-form-input type="blob" v-model="model.logo"></b-form-input>-->
                <div class="dropbox">
                <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                    accept="image/*" class="input-file">
                    <p v-if="isInitial">
                    Drag your file(s) here to begin<br> or click to browse
                    </p>
                    <p v-if="isSaving">
                    Uploading {{ fileCount }} files...
                    </p>
                </div>
            </b-form-group>
            <b-form-group label="Name">
              <b-form-input type="text" v-model="model.name"></b-form-input>
            </b-form-group>
            <b-form-group label="Date">
              <b-form-input type="date" v-model="model.date"></b-form-input>
            </b-form-group>
            <b-form-group label="Number of users">
              <b-form-textarea v-model="model.num_of_users"></b-form-textarea>
            </b-form-group>
            <b-form-group label="Hardware info">
              <b-form-textarea rows="2" v-model="model.hardware_info"></b-form-textarea>
            </b-form-group>
            <b-form-group label="Hardware info">
              <b-form-textarea rows="2" v-model="model.hardware_info"></b-form-textarea>
            </b-form-group>
            <b-form-group label="Additional info">
              <b-form-textarea rows="2" v-model="model.additional_info"></b-form-textarea>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save</b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
</div>
</template>

<script>
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      events: [],
      model: {}
    }
  },
  async created () {
    this.refreshEvents()
  },
  methods: {
    async refreshEvents () {
      this.loading = true
      this.events = await api.getManyREST("events")
      this.loading = false
    },
    async populateEventToEdit (event) {
      this.model = Object.assign({}, event)
    },
    async saveEvent () {
        if (this.model.id) {
            await api.updateREST("events", this.model.id,this.model)
        }
        else{
            await api.createREST("events",this.model)

            // Check new event has been added to the database.
            this.events = await api.getManyREST("events")
            if (this.events[this.events.length-1].name == this.model.name){
                alert("Eventnology added: "+this.model.name);
            }
            else{
                alert("Failed to add: "+this.model.name);
            }
        }
        this.model = {} // reset form
        this.refreshEvents()
    },
    async deleteEvent (id) {
      if (confirm('Are you sure you want to delete this event?')) {
        // if we are editing a event we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deleteREST('events', id)
        await this.refreshEvents()
      }
    }
  }
}
</script>