import Vue from 'vue'
import axios from 'axios'

export default {
  strict: true,
  state: {
    scenes: {},
    scene_characters: {},
    scene_items: {},
    scene_locations: {},
    scene_versions: {},
    scene_author_personal_progress: {},
    scene_history: {}
  },
  getters: {
    getScenesByBook: state => (bookUUID) => {
      if (state.scenes.hasOwnProperty(bookUUID)) {
        return state.scenes[bookUUID].rows
      }
      return []
    },
    getScenesByChapter: state => (chapterUUID) => {
      if (state.scenes.hasOwnProperty(chapterUUID)) {
        return state.scenes[chapterUUID].rows
      }
      return []
    },
    getSceneLocations: state => (sceneUUID) => {
      if (state.scene_locations.hasOwnProperty(sceneUUID)) {
        return state.scene_locations[sceneUUID].rows
      }
      return []
    },
    getSceneItems: state => (sceneUUID) => {
      if (state.scene_items.hasOwnProperty(sceneUUID)) {
        return state.scene_items[sceneUUID].rows
      }
      return []
    },
    getSceneCharacters: state => (sceneUUID) => {
      if (state.scene_characters.hasOwnProperty(sceneUUID)) {
        return state.scene_characters[sceneUUID].rows
      }
      return []
    },
    getSceneHistory: state => (sceneUUID) => {
      if (state.scene_history.hasOwnProperty(sceneUUID)) {
        return state.scene_history[sceneUUID].rows
      }
      return []
    },
    getSceneVersions: state => (sceneUUID) => {
      if (state.scene_versions.hasOwnProperty(sceneUUID)) {
        return state.scene_versions[sceneUUID].rows
      }
      return []
    },
    getSceneContent: state => (sceneUUID) => {
      if (state.scene_versions[sceneUUID] && state.scene_versions[sceneUUID].rows.length > 0) {
        var index = state.scene_versions[sceneUUID].rows.length - 1
        return state.scene_versions[sceneUUID].rows[index].content
      } else {
        return ''
      }
    },
    getSceneComments: state => (sceneUUID) => {
      if (state.scene_versions[sceneUUID] && state.scene_versions[sceneUUID].rows.length > 0) {
        var index = state.scene_versions[sceneUUID].rows.length - 1
        return state.scene_versions[sceneUUID].rows[index].comments
      } else {
        return ''
      }
    },
    getSceneVersionUUID: state => (sceneUUID) => {
      if (state.scene_versions[sceneUUID] !== 'undefined' && state.scene_versions[sceneUUID].rows.length > 0) {
        var index = state.scene_versions[sceneUUID].rows.length - 1
        return state.scene_versions[sceneUUID].rows[index].uuid
      } else {
        return ''
      }
    },
    findLatestSceneVersionByScene: state => (payload) => {
      let sceneUUID = payload.uuid

      if (state.scene_versions[sceneUUID] !== 'undefined' && state.scene_versions[sceneUUID].rows.length > 0) {
        var index = state.scene_versions[sceneUUID].rows.length - 1
        return state.scene_versions[sceneUUID].rows[index]
      }
      return null
    },
    getTodayAuthorPersonalProgressForScene: state => (payload) => {
      let sceneUUID = payload.uuid

      if (state.scene_author_personal_progress[sceneUUID] !== 'undefined') {
        return state.scene_author_personal_progress[sceneUUID]
      }
      return null
    },
    findScene: state => (payload) => {
      let parentUUID = (payload.chapter_id !== null && payload.chapter_id !== '') ? payload.chapter_id : payload.book_id
      if (state.scenes[parentUUID] !== undefined) {
        for (let i = 0; i < state.scenes[parentUUID].rows.length; i++) {
          let current = state.scenes[parentUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.scenes[parentUUID].rows[i]
          }
        }
      }
      return null
    }
  },
  mutations: {
    loadScenesByBook (state, payload) {
      let bookID = payload.book_id
      let otherScenes = payload.other_scenes
      Vue.set(state.scenes, bookID, { rows: [] })
      state.scenes[bookID] = { is_open: false, rows: otherScenes.data }
    },
    loadScenesByChapter (state, payload) {
      let chapterUUID = payload.chapter_id
      let scenes = payload.scenes
      Vue.set(state.scenes, chapterUUID, { rows: [] })
      state.scenes[chapterUUID] = { is_open: false, rows: scenes.data }
    },
    loadCharactersByScene (state, payload) {
      let sceneID = payload.scene.uuid
      let characters = payload.characters
      Vue.set(state.scene_characters, sceneID, { rows: [] })
      state.scene_characters[sceneID] = { rows: characters.data }
    },
    loadItemsByScene (state, payload) {
      let sceneID = payload.scene.uuid
      let items = payload.items
      Vue.set(state.scene_items, sceneID, { rows: [] })
      state.scene_items[sceneID] = { rows: items.data }
    },
    loadLocationsByScene (state, payload) {
      let sceneID = payload.scene.uuid
      let locations = payload.locations
      Vue.set(state.scene_locations, sceneID, { rows: [] })
      state.scene_locations[sceneID] = { rows: locations.data }
    },
    loadSceneHistory (state, payload) {
      let sceneID = payload.scene_id
      let history = payload.history
      Vue.set(state.scene_history, sceneID, { rows: [] })
      state.scene_history[sceneID] = { rows: history.data }
    },
    loadVersionsByScene (state, payload) {
      let sceneID = payload.scene.uuid
      let versions = payload.versions
      Vue.set(state.scene_versions, sceneID, { rows: [] })
      state.scene_versions[sceneID] = { rows: versions.data }
    },
    loadTodayAuthorPersonalProgressForScene (state, payload) {
      let sceneID = payload.scene_id
      let authorPersonalProgress = payload.authorPersonalProgress
      Vue.set(state.scene_author_personal_progress, sceneID, {})
      state.scene_author_personal_progress[sceneID] = authorPersonalProgress.data
    },
    addSceneToList (state, payload) {
      let parentUUID = (payload.chapter_id !== null && payload.chapter_id !== '') ? payload.chapter_id : payload.book_id
      // use this to get the total number of chapters under book
      let count = state.scenes[parentUUID].rows.length
      state.scenes[parentUUID].rows.push({})
      Vue.set(state.scenes[parentUUID].rows, count, payload)
    },
    addSceneCharacterToList (state, payload) {
      let sceneID = payload.book_scene_id
      if (state.scene_characters[sceneID] === 'undefined' || state.scene_characters[sceneID] === null) {
        Vue.set(state.scene_characters, sceneID, { rows: [] })
      }
      state.scene_characters[sceneID].rows.push(payload)
    },
    addSceneItemToList (state, payload) {
      let sceneID = payload.book_scene_id
      if (state.scene_items[sceneID] === 'undefined' || state.scene_items[sceneID] === null) {
        Vue.set(state.scene_items, sceneID, { rows: [] })
      }
      state.scene_items[sceneID].rows.push(payload)
    },
    addSceneLocationToList (state, payload) {
      let sceneID = payload.book_scene_id
      if (state.scene_locations[sceneID] === 'undefined' || state.scene_locations[sceneID] === null) {
        Vue.set(state.scene_locations, sceneID, { rows: [] })
      }
      state.scene_locations[sceneID].rows.push(payload)
    },
    addSceneVersionToList (state, payload) {
      let sceneID = payload.book_scene_id
      if (state.scene_versions[sceneID] === 'undefined' || state.scene_versions[sceneID] === null) {
        Vue.set(state.scene_versions, sceneID, { rows: [] })
      }
      state.scene_versions[sceneID].rows.push(payload)
    },
    updateSceneFromList (state, payload) {
      let parentUUID = (payload.chapter_id !== null && payload.chapter_id !== '') ? payload.chapter_id : payload.book_id
      for (let i = 0; i < state.scenes[parentUUID].rows.length; i++) {
        if (state.scenes[parentUUID].rows[i].uuid === payload.uuid) {
          Vue.set(state.scenes[parentUUID].rows, i, payload)
        }
      }
    },
    removeSceneFromList (state, payload) {
      // check whether the scene is under the book or chapter
      let parentUUID = (payload.chapter_id !== null && payload.chapter_id !== '') ? payload.chapter_id : payload.book_id
      for (var i = 0; i < state.scenes[parentUUID].rows.length; i++) {
        if (state.scenes[parentUUID].rows[i].uuid === payload.uuid) {
          state.scenes[parentUUID].rows.splice(i, 1)
        }
      }
    },
    removeSceneCharacterFromList (state, payload) {
      // check whether the scene is under the book or chapter
      let sceneID = payload.book_scene_id
      for (var i = 0; i < state.scene_characters[sceneID].rows.length; i++) {
        if (state.scene_characters[sceneID].rows[i].uuid === payload.uuid) {
          state.scene_characters[sceneID].rows.splice(i, 1)
        }
      }
    },
    removeSceneItemFromList (state, payload) {
      // check whether the scene is under the book or chapter
      let sceneID = payload.book_scene_id
      for (var i = 0; i < state.scene_items[sceneID].rows.length; i++) {
        if (state.scene_items[sceneID].rows[i].uuid === payload.uuid) {
          state.scene_items[sceneID].rows.splice(i, 1)
        }
      }
    },
    removeSceneLocationFromList (state, payload) {
      // check whether the scene is under the book or chapter
      let sceneID = payload.book_scene_id
      for (var i = 0; i < state.scene_locations[sceneID].rows.length; i++) {
        if (state.scene_locations[sceneID].rows[i].uuid === payload.uuid) {
          state.scene_locations[sceneID].rows.splice(i, 1)
        }
      }
    },
    sortScenes (state, payload) {
      axios
        .post('http://localhost:3000/scenes/sort', payload.data)
        .then(response => {
          console.log('scenes sorted!')
        })
      state.scenes[payload.PARENT].rows = payload.data
    },
    updateSceneList (state, payload) {
      let parentUUID = (payload.chapter_id !== null && payload.chapter_id !== '') ? payload.chapter_id : payload.book_id
      if (!state.scenes[parentUUID]) {
        Vue.set(state.scenes, parentUUID, { rows: [] })
        // add row
        state.scenes[parentUUID].rows.push({})
        Vue.set(state.scenes[parentUUID].rows, 0, payload)
        return
      }

      for (let i = 0; i <= (state.scenes[parentUUID].rows.length - 1); i++) {
        let current = state.scenes[parentUUID].rows[i]
        if (current.uuid === payload.uuid) {
          Vue.set(state.scenes[parentUUID].rows, i, payload)
          break
        } else if (i === (state.scenes[parentUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of locations under book
          let count = state.scenes[parentUUID].rows.length
          state.scenes[parentUUID].rows.push({})
          Vue.set(state.scenes[parentUUID].rows, count, payload)
        }
      }
    },
    updateSceneVersionList (state, payload) {
      let sceneUUID = payload.book_scene_id
      if (!state.scene_versions[sceneUUID]) {
        console.log('CLEARED?')
        Vue.set(state.scene_versions, sceneUUID, { rows: [] })
        // add row
        state.scene_versions[sceneUUID].rows.push({})
        Vue.set(state.scene_versions[sceneUUID].rows, 0, payload)
        return
      }

      for (let i = 0; i < state.scene_versions[sceneUUID].rows.length; i++) {
        let current = state.scene_versions[sceneUUID].rows[i]
        if (current.uuid === payload.uuid) {
          Vue.set(state.scene_versions[sceneUUID].rows, i, payload)
          // console.log('UPDATED ' + payload.content)
          break
        } else if (i === (state.scene_versions[sceneUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of locations under book
          let count = state.scene_versions[sceneUUID].rows.length
          state.scene_versions[sceneUUID].rows.push({})
          Vue.set(state.scene_versions[sceneUUID].rows, count, payload)
        }
      }
    }
  },
  actions: {
    async loadScenesByBook ({ commit, state }, payload) {
      let bookID = payload
      let otherScenes = await axios.get('http://localhost:3000/books/' + bookID + '/scenes/other')
      commit('loadScenesByBook', { book_id: payload, other_scenes: otherScenes })
    },
    async loadScenesByChapter ({ commit, state }, payload) {
      let chapterUUID = payload
      let scenes = await axios.get('http://localhost:3000/chapters/' + chapterUUID + '/scenes')
      commit('loadScenesByChapter', { chapter_id: payload, scenes: scenes })
    },
    async loadCharactersByScene ({ commit, state }, payload) {
      let sceneID = payload.uuid
      let characters = await axios.get('http://localhost:3000/scenes/' + sceneID + '/characters')
      commit('loadCharactersByScene', { scene: payload, characters: characters })
    },
    async loadItemsByScene ({ commit, state }, payload) {
      let sceneID = payload.uuid
      let items = await axios.get('http://localhost:3000/scenes/' + sceneID + '/items')
      commit('loadItemsByScene', { scene: payload, items: items })
    },
    async loadLocationsByScene ({ commit, state }, payload) {
      let sceneID = payload.uuid
      let locations = await axios.get('http://localhost:3000/scenes/' + sceneID + '/locations')
      commit('loadLocationsByScene', { scene: payload, locations: locations })
    },
    async loadSceneHistory ({ commit, state }, payload) {
      let sceneID = payload
      let history = await axios.get('http://localhost:3000/scenes/' + sceneID + '/history')
      commit('loadSceneHistory', { scene_id: payload, history: history })
    },
    async loadVersionsByScene ({ commit, state }, payload) {
      let sceneID = payload.uuid
      let versions = await axios.get('http://localhost:3000/scenes/' + sceneID + '/versions')
      commit('loadVersionsByScene', { scene: payload, versions: versions })
    },
    async loadTodayAuthorPersonalProgressForScene ({ commit, state, rootGetters }, payload) {
      let sceneID = payload.scene_id
      let authorID = rootGetters.getAuthorID
      let authorPersonalProgress = await axios.get('http://localhost:3000/authors/' + authorID + '/scene/' + sceneID + '/personal-progress/today')
      commit('loadTodayAuthorPersonalProgressForScene', { scene_id: payload, authorPersonalProgress: authorPersonalProgress })
    },
    addSceneToList ({ commit, state }, payload) {
      commit('addSceneToList', payload)
    },
    addSceneCharacterToList ({ commit, state }, payload) {
      commit('addSceneCharacterToList', payload)
    },
    addSceneItemToList ({ commit, state }, payload) {
      commit('addSceneItemToList', payload)
    },
    addSceneLocationToList ({ commit, state }, payload) {
      commit('addSceneLocationToList', payload)
    },
    addSceneVersionToList ({ commit, state }, payload) {
      commit('addSceneVersionToList', payload)
    },
    updateSceneFromList ({ commit, state }, payload) {
      commit('updateSceneFromList', payload)
    },
    removeSceneFromList ({ commit, state }, payload) {
      commit('removeSceneFromList', payload)
    },
    removeSceneCharacterFromList ({ commit, state }, payload) {
      commit('removeSceneCharacterFromList', payload)
    },
    removeSceneItemFromList ({ commit, state }, payload) {
      commit('removeSceneItemFromList', payload)
    },
    removeSceneLocationFromList ({ commit, state }, payload) {
      commit('removeSceneLocationFromList', payload)
    },
    sortScenes ({ commit, state }, payload) {
      commit('sortScenes', payload)
    },
    updateSceneList ({ commit, state }, payload) {
      commit('updateSceneList', payload)
    },
    updateSceneVersionList ({ commit, state }, payload) {
      commit('updateSceneVersionList', payload)
    }
  }
}
