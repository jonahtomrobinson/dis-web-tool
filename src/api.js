import Vue from 'vue'
import axios from 'axios'


const client = axios.create({
  baseURL: 'http://localhost:8081/',
  json: true
})

export default {
  async execute (method, resource, data) {
    // inject the accessToken for each request
    let accessToken = await Vue.prototype.$auth.getAccessToken()
    return client({
      method,
      url: resource,
      data,
      headers:{
        Authorization: `Bearer ${accessToken}`
      },
      config: {
        headers: {
            'Content-Type': 'multipart/form-data' ,
        }
    }
    }).then(req => {
      return req.data
    })
  },
  getManyREST (item) {
    return this.execute('get', '/'+item)
  },
  getSingleREST (item, id) {
    return this.execute('get', '/'+item+`/${id}`)
  },
  createREST (item, data) {
    return this.execute('post', '/'+item, data)
  },
  updateREST (item, id, data) {
    return this.execute('put', '/'+item+`/${id}`, data)
  },
  deleteREST (item, id) {
    return this.execute('delete', '/'+item+`/${id}`)
  },

}