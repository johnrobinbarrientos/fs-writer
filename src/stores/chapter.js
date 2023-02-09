import Vue from 'vue'
import axios from 'axios'

export default {
  strict: true,
  state: {
    chapters: {},
    chapter_versions: { rows: [] },
    chapter_history: { rows: [] },
    chapter_author_personal_progress: {}
  },
  getters: {
    isChapterFolderOpen: state => (bookUUID) => {
      if (state.chapters.hasOwnProperty(bookUUID) && state.chapters[bookUUID].is_open) {
        return true
      } else {
        return false
      }
    },
    getChaptersByBook: state => (bookUUID) => {
      if (state.chapters.hasOwnProperty(bookUUID)) {
        return state.chapters[bookUUID].rows
      }
      return []
    },
    getChapterHistory: state => (chapterUUID) => {
      if (state.chapter_history.hasOwnProperty(chapterUUID)) {
        return state.chapter_history[chapterUUID].rows
      }
      return []
    },
    getChapterVersions: state => (chapterUUID) => {
      if (state.chapter_versions.hasOwnProperty(chapterUUID)) {
        return state.chapter_versions[chapterUUID].rows
      }
      return []
    },
    getChapterContent: state => (chapterUUID) => {
      if (state.chapter_versions[chapterUUID] && state.chapter_versions[chapterUUID].rows.length > 0) {
        var index = state.chapter_versions[chapterUUID].rows.length - 1
        return state.chapter_versions[chapterUUID].rows[index].content
      } else {
        return ''
      }
    },
    getChapterComments: state => (chapterUUID) => {
      if (state.chapter_versions[chapterUUID] && state.chapter_versions[chapterUUID].rows.length > 0) {
        var index = state.chapter_versions[chapterUUID].rows.length - 1
        return state.chapter_versions[chapterUUID].rows[index].comments
      } else {
        return ''
      }
    },
    getChapterVersionUUID: state => (chapterUUID) => {
      if (state.chapter_versions[chapterUUID] && state.chapter_versions[chapterUUID].rows.length > 0) {
        var index = state.chapter_versions[chapterUUID].rows.length - 1
        return state.chapter_versions[chapterUUID].rows[index].uuid
      } else {
        return ''
      }
    },
    getChapterVersionContent: state => (chapterVersionUUID) => {
      if (state.chapter_versions[chapterVersionUUID] !== undefined && state.chapter_versions[chapterVersionUUID].rows.length > 0) {
        var index = state.chapter_versions[chapterVersionUUID].rows.length - 1
        return state.chapter_versions[chapterVersionUUID].rows[index].content
      } else {
        return ''
      }
    },
    findLatestChapterVersionByChapter: state => (payload) => {
      let chapterUUID = payload.uuid

      if (state.chapter_versions[chapterUUID] !== 'undefined' && state.chapter_versions[chapterUUID].rows.length > 0) {
        var index = state.chapter_versions[chapterUUID].rows.length - 1
        return state.chapter_versions[chapterUUID].rows[index]
      }
      return null
    },
    getTodayAuthorPersonalProgressForChapter: state => (payload) => {
      let chapterUUID = payload.uuid

      if (state.chapter_author_personal_progress[chapterUUID] !== 'undefined') {
        return state.chapter_author_personal_progress[chapterUUID]
      }
      return null
    },
    findChapter: state => (payload) => {
      let bookUUID = payload.book_id
      if (state.chapters[bookUUID] !== undefined) {
        for (let i = 0; i < state.chapters[bookUUID].rows.length; i++) {
          let current = state.chapters[bookUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.chapters[bookUUID].rows[i]
          }
        }
      }
      return null
    },
    getChapterIndex: state => (chapter) => {
      if (state.chapters.hasOwnProperty(chapter.book_id)) {
        let rows = state.chapters[chapter.book_id].rows
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i]
          if (row.uuid === chapter.uuid) {
            return i
          }
        }
      }
      return null
    },
    getPrevChapter: state => (chapter, isHiddenIncluded = true) => {
      if (state.chapters.hasOwnProperty(chapter.book_id)) {
        let rows = state.chapters[chapter.book_id].rows
        var index = 0
        for (var i = 0; i < rows.length; i++) {
          let row = rows[i]
          if (row.uuid === chapter.uuid) {
            index = i
            break
          }
        }
        console.log('HERE ' + isHiddenIncluded)

        if (index > 0) {
          for (let x = (index - 1); x >= 0; x--) {
            let row = rows[x]
            if (isHiddenIncluded) {
              return row
            } else if (!isHiddenIncluded && !row.hidden) {
              return row
            } else if (x <= 0) {
              return null
            }
          }
        } else {
          return null
        }
      }
      return null
    },
    getNextChapter: state => (chapter, isHiddenIncluded = true) => {
      if (state.chapters.hasOwnProperty(chapter.book_id)) {
        let rows = state.chapters[chapter.book_id].rows
        var index = 0
        for (var i = 0; i < rows.length; i++) {
          let row = rows[i]
          if (row.uuid === chapter.uuid) {
            index = i
            break
          }
        }
        console.log('HERE ' + isHiddenIncluded)
        if (index < rows.length) {
          for (let x = (index + 1); x < rows.length; x++) {
            let row = rows[x]
            if (isHiddenIncluded) {
              return row
            } else if (!isHiddenIncluded && !row.hidden) {
              return row
            } else if (x <= 0) {
              return null
            }
          }
        } else {
          return null
        }
      }
      return null
    }
  },
  mutations: {
    toggleChapter (state, payload) {
      let chapter = payload
      for (let i = 0; i < state.chapters[chapter.book_id].rows.length; i++) {
        let pointed = state.chapters[chapter.book_id].rows[i]
        if (chapter.uuid === pointed.uuid) {
          let isOpen = state.chapters[chapter.book_id].rows[i].is_open
          Vue.set(state.chapters[chapter.book_id].rows[i], 'is_open', !isOpen)
          break
        }
      }
    },
    loadChaptersByBook (state, payload) {
      let bookID = payload.book_id
      let chapters = payload.chapters

      Vue.set(state.chapters, bookID, { rows: [] })
      state.chapters[bookID] = { is_open: false, rows: chapters.data }
      for (let i = 0; i < state.chapters[bookID].rows.length; i++) {
        Vue.set(state.chapters[bookID].rows[i], 'is_open', false)
      }
    },
    loadChaptersWithScenesByBook (state, payload) {
      let bookUUID = payload.book_id
      let chaptersRelations = payload.chapters_relations
      Vue.set(state.chapters, bookUUID, { rows: [] })
      state.chapters[bookUUID] = { is_open: false, rows: chaptersRelations.data }
      for (let i = 0; i < state.chapters[bookUUID].rows.length; i++) {
        Vue.set(state.chapters[bookUUID].rows[i], 'is_open', false)
      }
    },
    loadChapterHistory (state, payload) {
      let chapterID = payload.chapter_id
      Vue.set(state.chapter_history, chapterID, { rows: [] })
      state.chapter_history[chapterID] = { rows: payload.chapter_history }
    },
    loadVersionsByChapter (state, payload) {
      let chapterID = payload.chapter_id
      Vue.set(state.chapter_versions, chapterID, { rows: [] })
      state.chapter_versions[chapterID] = { rows: payload.chapter_versions }
    },
    loadTodayAuthorPersonalProgressForChapter (state, payload) {
      let chapterID = payload.chapter_id
      Vue.set(state.chapter_author_personal_progress, chapterID, {})
      state.chapter_author_personal_progress[chapterID] = payload.chapter_author_personal_progress
    },
    addChapterToList (state, payload) {
      let bookID = payload.book_id
      // use this to get the total number of chapters under book
      let count = state.chapters[bookID].rows.length
      state.chapters[bookID].rows.push({})
      Vue.set(state.chapters[bookID].rows, count, payload)
    },
    updateChapterFromList (state, payload) {
      let bookID = payload.book_id
      for (let i = 0; i <= (state.chapters[bookID].rows.length - 1); i++) {
        if (state.chapters[bookID].rows[i].uuid === payload.uuid) {
          Vue.set(state.chapters[bookID].rows, i, payload)
        }
      }
    },
    removeChapterFromList (state, payload) {
      let bookID = payload.book_id
      for (var i = 0; i <= (state.chapters[bookID].rows.length - 1); i++) {
        if (state.chapters[bookID].rows[i].uuid === payload.uuid) {
          state.chapters[bookID].rows.splice(i, 1)
        }
      }
    },
    updateChapterList (state, payload) {
      let bookUUID = payload.book_id
      if (!state.chapters[bookUUID]) {
        Vue.set(state.chapters, bookUUID, { rows: [] })
        // add row
        state.chapters[bookUUID].rows.push({})
        Vue.set(state.chapters[bookUUID].rows, 0, payload)
        return
      }

      for (let i = 0; i <= (state.chapters[bookUUID].rows.length - 1); i++) {
        let current = state.chapters[bookUUID].rows[i]
        if (current.uuid === payload.uuid) {
          let isOpen = current.is_open
          Vue.set(state.chapters[bookUUID].rows, i, payload)
          Vue.set(state.chapters[bookUUID].rows[i], 'is_open', isOpen)
          break
        } else if (i === (state.chapters[bookUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of chapters under book
          let count = state.chapters[bookUUID].rows.length
          state.chapters[bookUUID].rows.push({})
          Vue.set(state.chapters[bookUUID].rows, count, payload)
        }
      }
    },
    updateChapterVersionList (state, payload) {
      let chapterUUID = payload.chapter_id
      console.log('updateChapterVersionList')
      console.log(payload)
      if (!state.chapter_versions[chapterUUID]) {
        Vue.set(state.chapter_versions, chapterUUID, { rows: [] })
        // add row
        state.chapter_versions[chapterUUID].rows.push({})
        Vue.set(state.chapter_versions[chapterUUID].rows, 0, payload)
        return
      }

      for (let i = 0; i <= (state.chapter_versions[chapterUUID].rows.length - 1); i++) {
        let current = state.chapter_versions[chapterUUID].rows[i]
        if (current.uuid === payload.uuid) {
          Vue.set(state.chapter_versions[chapterUUID].rows, i, payload)
          break
        } else if (i === (state.chapter_versions[chapterUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of chapters under book
          let count = state.chapter_versions[chapterUUID].rows.length
          state.chapter_versions[chapterUUID].rows.push({})
          Vue.set(state.chapter_versions[chapterUUID].rows, count, payload)
        }
      }
    },
    sortChapters (state, payload) {
      axios
        .post('http://localhost:3000/chapters/sort', payload.data)
        .then(response => {
          console.log('chapters sorted!')
        })
      state.chapters[payload.bookUUID].rows = payload.data
    }
  },
  actions: {
    toggleChapter ({ commit, state }, payload) {
      commit('toggleChapter', payload)
    },
    async loadChaptersByBook ({ commit, state }, payload) {
      let bookID = payload
      let chapters = await axios.get('http://localhost:3000/books/' + bookID + '/chapters')
      commit('loadChaptersByBook', { book_id: payload, chapters: chapters })
    },
    async loadChaptersWithScenesByBook ({ commit, state }, payload) {
      let bookUUID = payload
      let chaptersRelations = await axios.get('http://localhost:3000/chapters/' + bookUUID + '/chapters-with-scenes-with-relations')
      commit('loadChaptersWithScenesByBook', { book_id: payload, chapters_relations: chaptersRelations })
    },
    async loadChapterHistory ({ commit, state }, payload) {
      let chapterID = payload
      let chapterHistory = await axios.get('http://localhost:3000/chapters/' + chapterID + '/history')
      commit('loadChapterHistory', { chapter_id: chapterID, chapter_history: chapterHistory.data })
    },
    async loadVersionsByChapter ({ commit, state }, payload) {
      let chapterID = payload
      let chapterVersions = await axios.get('http://localhost:3000/chapters/' + chapterID + '/versions')
      commit('loadVersionsByChapter', { chapter_id: chapterID, chapter_versions: chapterVersions.data })
    },
    async loadTodayAuthorPersonalProgressForChapter ({ commit, state, rootGetters }, payload) {
      let chapterID = payload
      let todayAuthorPersonalProgress = await axios.get('http://localhost:3000/authors/' + rootGetters.getAuthorID + '/chapter/' + chapterID + '/personal-progress/today')
      commit('loadTodayAuthorPersonalProgressForChapter', { chapter_id: payload, chapter_author_personal_progress: todayAuthorPersonalProgress.data })
    },
    addChapterToList ({ commit, state }, payload) {
      commit('addChapterToList', payload)
    },
    updateChapterFromList ({ commit, state }, payload) {
      commit('updateChapterFromList', payload)
    },
    updateChapterList ({ commit, state }, payload) {
      commit('updateChapterList', payload)
    },
    updateChapterVersionList ({ commit, state }, payload) {
      commit('updateChapterVersionList', payload)
    },
    removeChapterFromList ({ commit, state }, payload) {
      commit('removeChapterFromList', payload)
    },
    sortChapters ({ commit, state }, payload) {
      commit('sortChapters', payload)
    }
  }
}
