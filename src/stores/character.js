import Vue from 'vue'
import axios from 'axios'

export default {
  strict: true,
  state: {
    characters: {},
    character_relations: {}
  },
  getters: {
    getCharactersByBook: state => (bookUUID) => {
      if (state.characters.hasOwnProperty(bookUUID)) {
        return state.characters[bookUUID].rows
      }
      return []
    },
    getRelationsByCharacter: state => (characterUUID) => {
      if (state.character_relations.hasOwnProperty(characterUUID)) {
        return state.character_relations[characterUUID].rows
      }
      return []
    },
    findCharacter: state => (payload) => {
      let bookUUID = payload.book_id
      let characterUUID = payload.uuid
      console.log('store characters.js')
      // console.log(payload)
      if (state.characters[bookUUID] !== undefined) {
        for (let i = 0; i < state.characters[bookUUID].rows.length; i++) {
          let current = state.characters[bookUUID].rows[i]
          if (current.uuid === characterUUID) {
            return state.characters[bookUUID].rows[i]
          }
        }
      }
      return null
    }
  },
  mutations: {
    loadRelationsByCharacter (state, payload) {
      let characterUUID = payload
      Vue.set(state.character_relations, characterUUID, { rows: [] })
      axios
        .get('http://localhost:3000/characters/' + characterUUID + '/relations')
        .then(response => {
          state.character_relations[characterUUID] = {rows: response.data}
        })
    },
    loadCharactersByBook (state, payload) {
      let bookID = payload.book_id
      let characters = payload.characters
      Vue.set(state.characters, bookID, { rows: [] })
      state.characters[bookID] = { is_open: false, rows: characters.data }
    },
    addCharacterToList (state, payload) {
      let bookID = payload.book_id
      // use this to get the total number of chapters under book
      let count = state.characters[bookID].rows.length
      state.characters[bookID].rows.push({})
      Vue.set(state.characters[bookID].rows, count, payload)
    },
    updateCharacterFromList (state, payload) {
      let bookID = payload.book_id
      for (let i = 0; i < state.characters[bookID].rows.length; i++) {
        if (state.characters[bookID].rows[i].uuid === payload.uuid) {
          Vue.set(state.characters[bookID].rows, i, payload)
        }
      }
    },
    removeCharacterFromList (state, payload) {
      let bookID = payload.book_id
      for (var i = 0; i < state.characters[bookID].rows.length; i++) {
        if (state.characters[bookID].rows[i].uuid === payload.uuid) {
          state.characters[bookID].rows.splice(i, 1)
        }
      }
    },
    updateCharacterList (state, payload) {
      let bookUUID = payload.book_id
      if (!state.characters[bookUUID]) {
        Vue.set(state.characters, bookUUID, { rows: [] })
        // add row
        state.characters[bookUUID].rows.push({})
        Vue.set(state.characters[bookUUID].rows, 0, payload)
        return
      }

      for (let i = 0; i <= (state.characters[bookUUID].rows.length - 1); i++) {
        let current = state.characters[bookUUID].rows[i]
        if (current.uuid === payload.uuid) {
          Vue.set(state.characters[bookUUID].rows, i, payload)
          break
        } else if (i === (state.characters[bookUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of characters under book
          let count = state.characters[bookUUID].rows.length
          state.characters[bookUUID].rows.push({})
          Vue.set(state.characters[bookUUID].rows, count, payload)
        }
      }
    }
  },
  actions: {
    async loadCharactersByBook ({ commit, state }, payload) {
      let bookID = payload
      let characters = await axios.get('http://localhost:3000/books/' + bookID + '/characters')
      commit('loadCharactersByBook', { book_id: payload, characters: characters })
    },
    loadRelationsByCharacter ({ commit, state }, payload) {
      commit('loadRelationsByCharacter', payload)
    },
    addCharacterToList ({ commit, state }, payload) {
      commit('addCharacterToList', payload)
    },
    updateCharacterFromList ({ commit, state }, payload) {
      commit('updateCharacterFromList', payload)
    },
    updateCharacterList ({ commit, state }, payload) {
      commit('updateCharacterList', payload)
    },
    removeCharacterFromList ({ commit, state }, payload) {
      commit('removeCharacterFromList', payload)
    }
  }
}
