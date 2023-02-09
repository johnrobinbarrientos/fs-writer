// import Vue from 'vue'
// import axios from 'axios'

export default {
  strict: true,
  state: {
    author_personal_progress: {
      today: 0,
      monthly: 0,
      yearly: 0,
      all_time: 0
    }
  },
  getters: {
    // getAuthorPersonaProgress: state => (progress) => {
    //   return state.author_personal_progress[progress]
    //   // if (progress === 'daily') {
    //   //   totalProgress = 200
    //   // } else {
    //   //   totalProgress = 12809
    //   // }
    //   // return totalProgress.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    // }
  },
  mutations: {
    // loadAuthorPersonalProgress (state, payload) {
    //   axios
    //     .get('http://localhost:3000/authors/' + payload.authorId + '/personal-progress')
    //     .then(response => {
    //       console.log('Author personal progress loaded!')
    //       state.author_personal_progress = response.data
    //     })
    // }
  },
  actions: {
    // loadAuthorPersonalProgress ({ commit, state }, payload) {
    //   commit('loadAuthorPersonalProgress', payload)
    // }
  }
}
