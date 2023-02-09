import axios from 'axios'

export default {
  strict: true, // make sure everything us mutated, no direct editing of state
  name: 'auth',
  state: {
    user: {
      data: [],
      author: []
    },
    author_personal_progress: {
      today: 0,
      monthly: 0,
      yearly: 0,
      all_time: 0
    },
    isAuthenticated: false
  },
  getters: {
    isAuthenticated: state => {
      return state.isAuthenticated
    },
    getAuthorID: state => {
      return state.user.author.uuid
    },
    getUserID: state => {
      return state.user.data.uuid
    },
    getUserToken: state => {
      return state.user.data.token
    },
    getAuthorName: state => {
      return state.user.author.first_name
    },
    getAuthorFullName: state => {
      return state.user.author.first_name + ' ' + state.user.author.last_name
    },
    getAuthor: state => {
      return state.user.author
    },
    getUserSyncedDate: state => {
      return state.user.data.synced_at
    },
    getAuthorPersonaProgress: state => (progress) => {
      return state.author_personal_progress[progress]
    }
  },
  mutations: {
    authenticate (state, payload) {
      state.isAuthenticated = true
      state.user.data = payload.user
      state.user.author = payload.author
    },
    updateSyncedAt (state, payload) {
      state.user.data.synced_at = payload.syncedAt
    },
    loadAuthorPersonalProgress (state, payload) {
      axios
        .get('http://localhost:3000/authors/' + payload.authorId + '/personal-progress')
        .then(response => {
          console.log('Author personal progress loaded!')
          state.author_personal_progress = response.data
        })
    }
  },
  actions: {
    loadAuthorPersonalProgress ({ commit, state }, payload) {
      commit('loadAuthorPersonalProgress', payload)
    }
  }
}
