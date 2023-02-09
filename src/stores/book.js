import Vue from 'vue'
import axios from 'axios'

export default {
  strict: true,
  state: {
    books: {},
    books_i_read: {}
  },
  getters: {
    getBooksByAuthor: state => (authorUUID) => {
      if (state.books.hasOwnProperty(authorUUID)) {
        return state.books[authorUUID].rows
      }
      return []
    },
    getBooksIReadByAuthor: state => (authorUUID) => {
      if (state.books_i_read.hasOwnProperty(authorUUID)) {
        return state.books_i_read[authorUUID].rows
      }
      return []
    },
    isBookChaptersFolderOpen: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i].is_chapters_folder_open
          }
        }
      }
      return false
    },
    isBookCharactersFolderOpen: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i].is_characters_folder_open
          }
        }
      }
      return false
    },
    isBookItemsFolderOpen: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i].is_items_folder_open
          }
        }
      }
      return false
    },
    isBookLocationsFolderOpen: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i].is_locations_folder_open
          }
        }
      }
      return false
    },
    isBookScenesFolderOpen: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i].is_scenes_folder_open
          }
        }
      }
      return false
    },
    isBookIReadChaptersFolderOpen: state => (payload) => {
      // authententicated author_id, we use this to get "book i read" of the authenticated user
      let authorUUID = payload.author_id
      let book = payload.book

      if (state.books_i_read[authorUUID] !== undefined) {
        for (let i = 0; i < state.books_i_read[authorUUID].rows.length; i++) {
          let current = state.books_i_read[authorUUID].rows[i]
          if (current.uuid === book.uuid) {
            return state.books_i_read[authorUUID].rows[i].is_chapters_folder_open
          }
        }
      }
      return false
    },
    isBookIReadScenesFolderOpen: state => (payload) => {
    // authententicated author_id, we use this to get "book i read" of the authenticated user
      let authorUUID = payload.author_id
      let book = payload.book

      if (state.books_i_read[authorUUID] !== undefined) {
        for (let i = 0; i < state.books_i_read[authorUUID].rows.length; i++) {
          let current = state.books_i_read[authorUUID].rows[i]
          if (current.uuid === book.uuid) {
            return state.books_i_read[authorUUID].rows[i].is_chapters_folder_open
          }
        }
      }
      return false
    },
    findBook: state => (payload) => {
      let authorUUID = payload.author_id
      if (state.books[authorUUID] !== undefined) {
        for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
          let current = state.books[authorUUID].rows[i]
          if (current.uuid === payload.uuid) {
            return state.books[authorUUID].rows[i]
          }
        }
      }
      return null
    }
  },
  mutations: {
    loadBooksByAuthor (state, payload) {
      var authorUUID = payload.authorUUID
      var books = payload.books
      Vue.set(state.books, authorUUID, { rows: [] })
      state.books[authorUUID].rows = books.data

      for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
        Vue.set(state.books[authorUUID].rows[i], 'is_open', false)
        Vue.set(state.books[authorUUID].rows[i], 'is_chapters_folder_open', false)
        Vue.set(state.books[authorUUID].rows[i], 'is_items_folder_open', false)
        Vue.set(state.books[authorUUID].rows[i], 'is_locations_folder_open', false)
        Vue.set(state.books[authorUUID].rows[i], 'is_characters_folder_open', false)
        Vue.set(state.books[authorUUID].rows[i], 'is_scenes_folder_open', false)
      }
    },
    loadBooksIReadByAuthor (state, payload) {
      var authorUUID = payload.authorUUID
      let bookIRead = payload.bookIRead

      Vue.set(state.books_i_read, authorUUID, { rows: [] })
      state.books_i_read[authorUUID].rows = bookIRead.data

      for (let i = 0; i < state.books_i_read[authorUUID].rows.length; i++) {
        Vue.set(state.books_i_read[authorUUID].rows[i], 'is_open', false)
        Vue.set(state.books_i_read[authorUUID].rows[i], 'is_chapters_folder_open', false)
        Vue.set(state.books_i_read[authorUUID].rows[i], 'is_items_folder_open', false)
        Vue.set(state.books_i_read[authorUUID].rows[i], 'is_locations_folder_open', false)
        Vue.set(state.books_i_read[authorUUID].rows[i], 'is_characters_folder_open', false)
        Vue.set(state.books_i_read[authorUUID].rows[i], 'is_scenes_folder_open', false)
      }
    },
    reloadBooksIReadByAuthor (state, payload) {
      var userUUID = payload.userUUID // this is for requesting purposes
      var authorUUID = payload.authorUUID
      let oldRows = state.books_i_read[authorUUID].rows
      Vue.set(state.books_i_read, authorUUID, { rows: [] })
      axios
        .get('http://localhost:3000/users/' + userUUID + '/books-i-read')
        .then(response => {
          state.books_i_read[authorUUID].rows = response.data
          for (let i = 0; i < state.books_i_read[authorUUID].rows.length; i++) {
            // check the _open base on the beforeSync rows vs afterSync rows
            for (let oldRowsKey in oldRows) {
              if (oldRows[oldRowsKey].uuid === state.books_i_read[authorUUID].rows[i].uuid) {
                Vue.set(state.books_i_read[authorUUID].rows[i], 'is_open', oldRows[oldRowsKey].is_open)
              }
            }
          }
        })
    },
    toggleBook (state, payload) {
      let book = payload.data
      let model = payload.model

      for (let i = 0; i < state.books[book.author_id].rows.length; i++) {
        let pointed = state.books[book.author_id].rows[i]
        if (book.uuid === pointed.uuid && model === 'book') {
          let isOpen = state.books[book.author_id].rows[i].is_open
          Vue.set(state.books[book.author_id].rows[i], 'is_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'chapters') {
          let isOpen = state.books[book.author_id].rows[i].is_chapters_folder_open
          Vue.set(state.books[book.author_id].rows[i], 'is_chapters_folder_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'items') {
          let isOpen = state.books[book.author_id].rows[i].is_items_folder_open
          Vue.set(state.books[book.author_id].rows[i], 'is_items_folder_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'locations') {
          let isOpen = state.books[book.author_id].rows[i].is_locations_folder_open
          Vue.set(state.books[book.author_id].rows[i], 'is_locations_folder_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'characters') {
          let isOpen = state.books[book.author_id].rows[i].is_characters_folder_open
          Vue.set(state.books[book.author_id].rows[i], 'is_characters_folder_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'scenes') {
          let isOpen = state.books[book.author_id].rows[i].is_scenes_folder_open
          Vue.set(state.books[book.author_id].rows[i], 'is_scenes_folder_open', !isOpen)
          break
        }
      }
    },
    toggleBookIRead (state, payload) {
      // authententicated author_id, we use this to get "book i read" of the authenticated user
      let authorUUID = payload.author_id
      let book = payload.data
      let model = payload.model

      for (let i = 0; i < state.books_i_read[authorUUID].rows.length; i++) {
        let pointed = state.books_i_read[authorUUID].rows[i]
        if (book.uuid === pointed.uuid && model === 'book') {
          let isOpen = state.books_i_read[authorUUID].rows[i].is_open
          Vue.set(state.books_i_read[authorUUID].rows[i], 'is_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'chapters') {
          let isOpen = state.books_i_read[authorUUID].rows[i].is_chapters_folder_open
          Vue.set(state.books_i_read[authorUUID].rows[i], 'is_chapters_folder_open', !isOpen)
          break
        } else if (book.uuid === pointed.uuid && model === 'scenes') {
          let isOpen = state.books_i_read[authorUUID].rows[i].is_scenes_folder_open
          Vue.set(state.books_i_read[authorUUID].rows[i], 'is_scenes_folder_open', !isOpen)
          break
        }
      }
    },
    updateBookList (state, payload) {
      let authorUUID = payload.author_id
      if (!state.books[authorUUID] || !state.books.hasOwnProperty(authorUUID) || state.books[authorUUID].rows.length < 1) {
        console.log('ADDED AUTHOR!')
        Vue.set(state.books, authorUUID, { rows: [] })
        // add row
        state.books[authorUUID].rows.push({})
        Vue.set(state.books[authorUUID].rows, 0, payload)
        Vue.set(state.books[authorUUID].rows[0], 'is_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_chapters_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_items_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_locations_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_characters_folder_open', false)
        Vue.set(state.books[authorUUID].rows[0], 'is_scenes_folder_open', false)
        return
      }

      for (let i = 0; i < state.books[authorUUID].rows.length; i++) {
        let current = state.books[authorUUID].rows[i]
        if (current.uuid === payload.uuid) {
          for (var key in payload) {
            if (state.books[authorUUID].rows[i][key]) {
              state.books[authorUUID].rows[i][key] = payload[key]
            }
          }
          break
        } else if (i === (state.books[authorUUID].rows.length - 1) && current.uuid !== payload.uuid) {
          // use this to get the total number of chapters under book
          Vue.set(payload, 'is_open', false)
          Vue.set(payload, 'is_chapters_folder_open', false)
          Vue.set(payload, 'is_items_folder_open', false)
          Vue.set(payload, 'is_locations_folder_open', false)
          Vue.set(payload, 'is_characters_folder_open', false)
          Vue.set(payload, 'is_scenes_folder_open', false)

          state.books[authorUUID].rows.push(payload)
          // let count = state.books[authorUUID].rows.length
        }
      }
    },
    updateBooksIReadList (state, payload) {
      // authententicated author_id, we use this to get "book i read" of the authenticated user
      let authorUUID = payload.author_id
      let book = payload.book
      if (!state.books_i_read[authorUUID] || !state.books_i_read.hasOwnProperty(authorUUID) || state.books_i_read[authorUUID].rows.length < 1) {
        console.log('ADDED AUTHOR!')
        Vue.set(state.books_i_read, authorUUID, { rows: [] })
        // add row
        state.books_i_read[authorUUID].rows.push({})
        Vue.set(state.books_i_read[authorUUID].rows, 0, book)
        Vue.set(state.books_i_read[authorUUID].rows[0], 'is_open', false)
        Vue.set(state.books_i_read[authorUUID].rows[0], 'is_chapters_folder_open', false)
        Vue.set(state.books_i_read[authorUUID].rows[0], 'is_items_folder_open', false)
        Vue.set(state.books_i_read[authorUUID].rows[0], 'is_locations_folder_open', false)
        Vue.set(state.books_i_read[authorUUID].rows[0], 'is_characters_folder_open', false)
        Vue.set(state.books_i_read[authorUUID].rows[0], 'is_scenes_folder_open', false)
        return
      }

      for (let i = 0; i < state.books_i_read[authorUUID].rows.length; i++) {
        let current = state.books_i_read[authorUUID].rows[i]
        if (current.uuid === book.uuid) {
          for (var key in book) {
            if (state.books_i_read[authorUUID].rows[i][key]) {
              state.books_i_read[authorUUID].rows[i][key] = book[key]
            }
          }
          break
        } else if (i === (state.books_i_read[authorUUID].rows.length - 1) && current.uuid !== book.uuid) {
          // use this to get the total number of chapters under book
          Vue.set(book, 'is_open', false)
          Vue.set(book, 'is_chapters_folder_open', false)
          Vue.set(book, 'is_items_folder_open', false)
          Vue.set(book, 'is_locations_folder_open', false)
          Vue.set(book, 'is_characters_folder_open', false)
          Vue.set(book, 'is_scenes_folder_open', false)

          state.books_i_read[authorUUID].rows.push(book)
          // let count = state.books[authorUUID].rows.length
        }
      }
    },
    removeBookFromList (state, payload) {
      let authorUUID = payload.author_id
      for (var i = 0; i <= (state.books[authorUUID].rows.length - 1); i++) {
        if (state.books[authorUUID].rows[i].uuid === payload.uuid) {
          state.books[authorUUID].rows.splice(i, 1)
        }
      }
    },
    removeBookIReadFromList (state, payload) {
      let authorUUID = payload.author_id
      for (var i = 0; i <= (state.books_i_read[authorUUID].rows.length - 1); i++) {
        if (state.books_i_read[authorUUID].rows[i].uuid === payload.uuid) {
          state.books_i_read[authorUUID].rows.splice(i, 1)
        }
      }
    }
  },
  actions: {
    async loadBooksByAuthor ({ commit, state }, payload) {
      var userUUID = payload.userUUID // this is for requesting purposes
      var authorUUID = payload.authorUUID
      let books = await axios.get('http://localhost:3000/users/' + userUUID + '/books')
      commit('loadBooksByAuthor', { authorUUID: authorUUID, books: books })
    },
    async loadBooksIReadByAuthor ({ commit, state }, payload) {
      var userUUID = payload.userUUID // this is for requesting purposes
      var authorUUID = payload.authorUUID

      let bookIRead = await axios.get('http://localhost:3000/users/' + userUUID + '/books-i-read')
      commit('loadBooksIReadByAuthor', { authorUUID: authorUUID, bookIRead: bookIRead })
    },
    reloadBooksIReadByAuthor ({ commit, state }, payload) {
      commit('reloadBooksIReadByAuthor', payload)
    },
    updateBookList ({ commit, state }, payload) {
      commit('updateBookList', payload)
    },
    updateBooksIReadList ({ commit, state }, payload) {
      commit('updateBooksIReadList', payload)
    },
    removeBookFromList ({ commit, state }, payload) {
      commit('removeBookFromList', payload)
    },
    toggleBook ({ commit, state }, payload) {
      commit('toggleBook', payload)
    },
    toggleBookIRead ({ commit, state }, payload) {
      commit('toggleBookIRead', payload)
    },
    removeBookIReadFromList ({ commit, state }, payload) {
      commit('removeBookIReadFromList', payload)
    }
  }
}
