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
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(req => {
      return req.data
    })
  },
  getPosts () {
    return this.execute('get', '/posts')
  },
  getPost (id) {
    return this.execute('get', `/posts/${id}`)
  },
  createPost (data) {
    return this.execute('post', '/posts', data)
  },
  updatePost (id, data) {
    return this.execute('put', `/posts/${id}`, data)
  },
  deletePost (id) {
    return this.execute('delete', `/posts/${id}`)
  },

  getManyREST (item) {
    return this.execute('get', '/'+item)
  },
  getSingleREST (item, id) {
    return this.execute('get', '/'+item+`/${id}`)
  },
  createREST (item,data) {
    return this.execute('post', '/'+item, data)
  },
  updateREST (item, id, data) {
    return this.execute('put', '/'+item+`/${id}`, data)
  },
  deleteREST (item, id) {
    return this.execute('delete', '/'+item+`/${id}`)
  },
  
}