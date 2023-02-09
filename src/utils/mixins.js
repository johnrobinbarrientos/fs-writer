// Mixins are a flexible way to distribute reusable functionalities for Vue components.
import {isNull} from 'bootstrap-vue/esm/utils/inspect'
import moment from 'moment'

const electron = window.require('electron')
const {ipcRenderer} = electron

export default {
  name: 'mixins',
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    UNIQUE: function () {
      let key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // eslint-disable-next-line one-var
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
      return key
    },
    CHANGE_COMPONENT: function (data) {
      var scope = this
      let isNewTab = (data.newTab) ? data.newTab : false
      let tabIndex = (data.tabIndex === null || data.tabIndex === undefined) ? 0 : data.tabIndex
      let settings = { key: data.tabKey, component: data.tabComponent, data: data.tabData, title: data.tabTitle, index: tabIndex, modified: false }

      scope.CHANGE_MENU_TITLE(settings.title)

      if (isNewTab) {
        // scope.$store.dispatch('newTab', { key: key, title: tabTitle, component: tabComponent, data: tabData })
        scope.$store.dispatch('newTab', settings)
      } else {
        // scope.$store.dispatch('changeTabContent', { key: key, title: tabTitle, component: tabComponent, data: tabData, index: tabIndex })
        scope.$store.dispatch('changeTabContent', settings)
      }
    },
    TOGGLE_BOOK: function (data, model) {
      var scope = this
      scope.$store.dispatch('toggleBook', { model: model, data: data })

      if (model === 'book') {
        scope.CHANGE_COMPONENT({tabKey: 'book-details-' + data.uuid, tabComponent: 'book-details', tabData: data, tabTitle: data.title})
      } else if (model === 'chapters') {
        scope.$store.dispatch('loadChaptersByBook', data.uuid)
        scope.CHANGE_COMPONENT({tabKey: 'chapter-listing-' + data.uuid, tabComponent: 'chapter-listing', tabData: data, tabTitle: this.$t('CHAPTERS') + ' - ' + data.title})
      } else if (model === 'items') {
        scope.$store.dispatch('loadItemsByBook', data.uuid)
        scope.CHANGE_COMPONENT({tabKey: 'item-listing-' + data.uuid, tabComponent: 'item-listing', tabData: data, tabTitle: this.$t('ITEMS') + ' - ' + data.title})
      } else if (model === 'characters') {
        scope.$store.dispatch('loadCharactersByBook', data.uuid)
        scope.CHANGE_COMPONENT({tabKey: 'character-listing-' + data.uuid, tabComponent: 'character-listing', tabData: data, tabTitle: this.$t('CHARACTERS') + ' - ' + data.title})
      } else if (model === 'locations') {
        scope.$store.dispatch('loadLocationsByBook', data.uuid)
        scope.CHANGE_COMPONENT({tabKey: 'location-listing-' + data.uuid, tabComponent: 'location-listing', tabData: data, tabTitle: this.$t('LOCATIONS') + ' - ' + data.title})
      } else if (model === 'scenes') {
        scope.$store.dispatch('loadScenesByBook', data.uuid)
        scope.CHANGE_COMPONENT({tabKey: 'scene-listing-' + data.uuid, tabComponent: 'scene-listing', tabData: data, tabTitle: this.$t('OTHER_SCENES') + ' - ' + data.title})
      }
    },
    TOGGLE_BOOK_I_READ: function (data, model) {
      var scope = this
      // we use this to get the books id read of the current user
      var authorUUID = this.$store.getters.getAuthorID
      scope.$store.dispatch('toggleBookIRead', { model: model, data: data, author_id: authorUUID })

      if (model === 'book') {
        scope.CHANGE_COMPONENT({tabKey: 'book-details-' + data.uuid, tabComponent: 'books-i-read-book-details', tabData: data, tabTitle: data.title})
      } else if (model === 'chapters') {
        scope.$store.dispatch('loadChaptersByBook', data.uuid)
        scope.CHANGE_COMPONENT({tabKey: 'chapter-listing-' + data.uuid, tabComponent: 'books-i-read-chapter-listing', tabData: data, tabTitle: this.$t('CHAPTERS') + ' - ' + data.title})
      } else if (model === 'scenes') {
        scope.$store.dispatch('loadScenesByBook', data.uuid)
        scope.CHANGE_COMPONENT({tabKey: 'scene-listing-' + data.uuid, tabComponent: 'books-i-read-scene-listing', tabData: data, tabTitle: this.$t('OTHER_SCENES') + ' - ' + data.title})
      }
    },
    TOGGLE_TREE: function (model, index, isOpen, data) {
      var scope = this
      scope.$store.dispatch('toggleTree', { model: model, index: index })

      // only change componenent when opening
      if (!isOpen) {
        if (model === 'books') {
          scope.CHANGE_COMPONENT({tabKey: 'book-details-' + data.uuid, tabComponent: 'book-details', tabData: data, tabTitle: data.title})
        } else if (model === 'chapters') {
          scope.CHANGE_COMPONENT({tabKey: 'chapter-listing-' + data.uuid, tabComponent: 'chapter-listing', tabData: data, tabTitle: this.$t('CHAPTERS') + ' - ' + data.title})
        } else if (model === 'items') {
          scope.CHANGE_COMPONENT({tabKey: 'item-listing-' + data.uuid, tabComponent: 'item-listing', tabData: data, tabTitle: this.$t('ITEMS') + ' - ' + data.title})
        } else if (model === 'locations') {
          scope.CHANGE_COMPONENT({tabKey: 'location-listing-' + data.uuid, tabComponent: 'location-listing', tabData: data, tabTitle: this.$t('LOCATIONS') + ' - ' + data.title})
        } else if (model === 'characters') {
          scope.CHANGE_COMPONENT({tabKey: 'character-listing-' + data.uuid, tabComponent: 'character-listing', tabData: data, tabTitle: this.$t('CHARACTERS') + ' - ' + data.title})
        } else if (model === 'scenes') {
          scope.CHANGE_COMPONENT({tabKey: 'scene-listing-' + data.uuid, tabComponent: 'scene-listing', tabData: data, tabTitle: this.$t('OTHER_SCENES') + ' - ' + data.title})
        }
      }
    },
    CHANGE_TAB: function (index) {
      var scope = this

      let next = this.$store.getters.getTabsByID(index)
      scope.CHANGE_MENU_TITLE(next.title)

      scope.$store.dispatch('changeTab', index)
    },
    REMOVE_TAB: function (index) {
      var scope = this
      if (!scope.$store.getters.tabIsModified(index)) {
        scope.$store.dispatch('removeTab', index)
        return
      }
      window.swal.fire({
        position: 'center',
        icon: 'warning',
        title: this.$t('WOULD_YOU_LIKE_TO_CLOSE_THIS_TAB_WITHOUT_SAVING_YOUR_CHANGES'),
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: this.$t('CANCEL')
      }).then((result) => {
        if (result.value) {
          let next = this.$store.getters.getTabsByID(index - 1)
          scope.CHANGE_MENU_TITLE(next.title)
          scope.$store.dispatch('removeTab', index)
        }
      })
    },
    MARK_TAB_AS_MODIFIED: function (index) {
      var scope = this
      console.log('INDEX: ' + index + ' IS MODIFIED ')
      scope.$store.dispatch('markTabAsModified', index)
    },
    UNMARK_TAB_AS_MODIFIED: function (index) {
      var scope = this
      scope.$store.dispatch('unmarkTabAsModified', index)
    },
    GET_BOOKS_BY_AUTHOR: function (uuid = '') {
      return this.$store.getters.getBooks
    },
    GET_CHAPTERS_BY_BOOK: function (uuid = '') {
      return this.$store.getters.getChaptersByBook(uuid)
    },
    GET_CHAPTER_HISTORY: function (uuid = '') {
      return this.$store.getters.getChapterHistory(uuid)
    },
    GET_ITEMS_BY_BOOK: function (uuid = '') {
      return this.$store.getters.getItemsByBook(uuid)
    },
    GET_LOCATIONS_BY_BOOK: function (uuid = '') {
      return this.$store.getters.getLocationsByBook(uuid)
    },
    GET_CHARACTERS_BY_BOOK: function (uuid = '') {
      return this.$store.getters.getCharactersByBook(uuid)
    },
    GET_SCENES_BY_BOOK: function (uuid = '') {
      return this.$store.getters.getScenesByBook(uuid)
    },
    GET_SCENES_BY_CHAPTER: function (uuid = '') {
      return this.$store.getters.getScenesByChapter(uuid)
    },
    GET_SCENE_HISTORY: function (uuid = '') {
      return this.$store.getters.getSceneHistory(uuid)
    },
    GET_CHAPTER_VERSIONS_BY_CHAPTER: function (uuid = '') {
      return this.$store.getters.getChapterVersions(uuid)
    },
    GET_SCENE_VERSIONS_BY_SCENE: function (uuid = '') {
      return this.$store.getters.getSceneVersions(uuid)
    },
    GET_SCENE_LOCATIONS_BY_SCENE: function (uuid = '') {
      return this.$store.getters.getSceneLocations(uuid)
    },
    GET_SCENE_ITEMS_BY_SCENE: function (uuid = '') {
      return this.$store.getters.getSceneItems(uuid)
    },
    GET_SCENE_CHARACTERS_BY_SCENE: function (uuid = '') {
      return this.$store.getters.getSceneCharacters(uuid)
    },
    REMOVE_HTML: function (content = '') {
      if (isNull(content)) {
        // TODO: John needs to add this string to be translated
        return '<em>No content</em>'
      }
      // eslint-disable-next-line no-useless-escape
      var stripedHtml = content.replace(/<br\s*[\/]?>/gi, '\n')
      stripedHtml = stripedHtml.replace(/<[^>]+>/g, '') // Remove html tags

      return stripedHtml
    },
    WORD_COUNT: function (content = '') {
      if (!content) {
        return 0
      }
      // eslint-disable-next-line no-useless-escape
      var stripedHtml = content.replace(/<br\s*[\/]?>/gi, ' ')
      stripedHtml = stripedHtml.replace(/<[^>]+>/g, '') // Remove html tags
      // stripedHtml = stripedHtml.replace(/[0-9]/gi, '') // Remove numbers
      stripedHtml = stripedHtml.replace(/\n/g, ' ') // exclude newline with a start spacings
      stripedHtml = stripedHtml.replace(/(^\s*)|(\s*$)/gi, '')// exclude  start and end white-space
      stripedHtml = stripedHtml.replace(/[ ]{2,}/gi, ' ')// 2 or more space to 1
      stripedHtml = stripedHtml.replace(/[^\w\s] [^\w\s] /gi, ' ') // Remove all special char

      return stripedHtml.split(' ').filter(function (str) { return str !== '' }).length
    },
    GET_AUTHOR_PERSONAL_PROGRESS: function (progress = 'all_time') {
      return this.$store.getters.getAuthorPersonaProgress(progress)
    },
    LOAD_LIST: function (model = '', data) {
      var scope = this
      scope.$store.dispatch('loadList', {model: model, data: data})
    },
    ADD_TO_LIST: function (model = '', data) {
      var scope = this
      scope.$store.dispatch('addToList', {model: model, data: data})
    },
    UPDATE_FROM_LIST: function (model = '', data) {
      var scope = this
      scope.$store.dispatch('updateFromList', {model: model, data: data})
    },
    DELETE_FROM_LIST: function (model = '', data) {
      var scope = this

      window.swal.fire({
        title: this.$t('ARE_YOU_SURE'),
        text: this.$t('YOU_WONT_BE_ABLE_TO_REVERT_THIS'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('YES_DELETE_IT'),
        cancelButtonText: this.$t('CANCEL')
      }).then((result) => {
        if (result.value) {
          scope.axios
            .delete('http://localhost:3000/' + model + '/' + data.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeFromList', {model: model, data: data})
                })
              }
            })
        }
      })
    },
    CHANGE_MENU_TITLE: function (title) {
      ipcRenderer.send('SET_TITLE', title)
    },
    DISPLAY_TITLE: function (title) {
      if (title === null) {
        return 'Untitled'
      }
      if (title.length > 70) {
        return title.slice(0, 70) + '...'
      } else if (title.length < 1) {
        return 'Untitled'
      } else {
        return title.slice(0, 39)
      }
    },
    CHECK_VALID_IMAGE: function (image) {
      const allowedExt = ['.png', '.jpg', '.jpeg']
      let imageExt = (image) ? image.split('.').pop() : false
      return imageExt && (allowedExt.indexOf('.' + imageExt) > -1)
    },
    IS_OBJECT (object) {
      return object != null && typeof object === 'object'
    },
    DEEP_EQUAL (object1, object2) {
      const keys1 = Object.keys(object1)
      const keys2 = Object.keys(object2)

      if (keys1.length !== keys2.length) {
        return false
      }

      for (const key of keys1) {
        const val1 = object1[key]
        const val2 = object2[key]
        const areObjects = this.IS_OBJECT(val1) && this.IS_OBJECT(val2)

        // eslint-disable-next-line no-mixed-operators
        if (areObjects && !this.DEEP_EQUAL(val1, val2) || !areObjects && val1 !== val2) {
          return false
        }
      }

      return true
    },
    formatDate: function (date, format) {
      return moment(date).format(format)
    }
  }
}
