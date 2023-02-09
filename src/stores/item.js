import Vue from 'vue'
import axios from 'axios'

export default {
  strict: true,
  state: {
    items: {}
  },
  getters: {
    getItemsByBook: state => (bookUUID) => {
      if (state.items.hasOwnProperty(bookUUID)) {
        return state.items[bookUUID].rows
      }
      return []
    },
    findItem: state => (payload) => {
      let bookUUID = payload.book_id
      if (state.items[bookUUID] !== undefined) {
        for (let i = 0; i < state.items[bookUUID].rows.length; i++) {
          let current = state.items[bookUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.items[bookUUID].rows[i]
          }
        }
      }
      return null
    }
  },
  mutations: {
    loadItemsByBook (state, payload) {
      let bookID = payload.book_id
      let items = payload.items
      Vue.set(state.items, bookID, { rows: [] })
      state.items[bookID] = { is_open: false, rows: items.data }
    },
    addItemToList (state, payload) {
      let bookID = payload.book_id
      // use this to get the total number of chapters under book
      let count = state.items[bookID].rows.length
      state.items[bookID].rows.push({})
      Vue.set(state.items[bookID].rows, count, payload)
    },
    updateItemFromList (state, payload) {
      let bookID = payload.book_id
      for (let i = 0; i < state.items[bookID].rows.length; i++) {
        if (state.items[bookID].rows[i].uuid === payload.uuid) {
          Vue.set(state.items[bookID].rows, i, payload)
        }
      }
    },
    removeItemFromList (state, payload) {
      let bookID = payload.book_id
      for (var i = 0; i < state.items[bookID].rows.length; i++) {
        if (state.items[bookID].rows[i].uuid === payload.uuid) {
          state.items[bookID].rows.splice(i, 1)
        }
      }
    },
    updateItemList (state, payload) {
      let bookUUID = payload.book_id
      if (!state.items[bookUUID]) {
        Vue.set(state.items, bookUUID, { rows: [] })
        // add row
        state.items[bookUUID].rows.push({})
        Vue.set(state.items[bookUUID].rows, 0, payload)
        return
      }

      for (let i = 0; i <= (state.items[bookUUID].rows.length - 1); i++) {
        let current = state.items[bookUUID].rows[i]
        if (current.uuid === payload.uuid) {
          Vue.set(state.items[bookUUID].rows, i, payload)
          break
        } else if (i === (state.items[bookUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of items under book
          let count = state.items[bookUUID].rows.length
          state.items[bookUUID].rows.push({})
          Vue.set(state.items[bookUUID].rows, count, payload)
        }
      }
    }
  },
  actions: {
    async loadItemsByBook ({ commit, state }, payload) {
      let bookID = payload
      let items = await axios.get('http://localhost:3000/books/' + bookID + '/items')
      commit('loadItemsByBook', { book_id: payload, items: items })
    },
    addItemToList ({ commit, state }, payload) {
      commit('addItemToList', payload)
    },
    updateItemFromList ({ commit, state }, payload) {
      commit('updateItemFromList', payload)
    },
    updateItemList ({ commit, state }, payload) {
      commit('updateItemList', payload)
    },
    removeItemFromList ({ commit, state }, payload) {
      commit('removeItemFromList', payload)
    }
  }
}
