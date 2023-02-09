<template>
<div class="left-side-bar no-select" :style="updateStyle()">
        <div class="header" style="display: flex; align-items: center; justify-content: center; position: relative;">
            <img v-if="$store.getters.darkmode" src="@/assets/img/es-logo-white.png">
            <img v-else src="@/assets/img/es-logo-black.png">
            <!-- <i @click="$parent.toggleMainSideBar()" class="btn-sidebar-closer las la-compress-arrows-alt"></i> -->
            <a @click="$store.commit('toggleSideNav')" class="icon-burger-close pos-absolute" href="javascript:void(0)">
              <i v-if="!$store.getters.collapsedSideNav" class="las la-angle-left"></i>
              <i class="las la-bars"></i>
            </a>
        </div>
        <div style="display:none;"  class="search-box">
            <input type="text" :placeholder = " $t('SEARCH_KEYWORD')">
            <i class="las la-search icon"></i>
        </div>
        <div class="left-sidebar-tab">
            <div v-bind:class="{'active' : tab === 'my-books' }" @click="toggleTab('my-books')" class="tab-item">
                {{$t('MY_BOOKS')}}
            </div>
            <div v-bind:class="{'active' : tab === 'books-i-read' }" @click="toggleTab('books-i-read')" class="tab-item">
                {{$t('BOOKS_I_READ')}}
            </div>
        </div>
        <div class="es-tree-view" id="custom-scrollbar">
            <ul v-bind:class="{'active' : tab === 'my-books' }"  class="left-sidebar-tab-content level-1">
                <li v-bind:class="{ 'open' : book.is_open }" v-bind:key="book.id" v-for="(book) in books">
                    <div class="label" @click="TOGGLE_BOOK(book,'book')">
                      <i v-if="book.is_open" class="fas fa-chevron-down"></i>
                      <i v-else class="fas fa-chevron-right"></i>
                      <i class="fas fa-book"></i>
                      <span>{{ book.title || 'Untitled' }}</span>
                    </div>
                    <ul v-if="book.is_open" class="level-2">
                        <book-chapters-folder :key="'tree-chapters-' + book.uuid" :properties="book"></book-chapters-folder>
                        <book-items-folder :key="'tree-items-' + book.uuid" :properties="book"></book-items-folder>
                        <book-characters-folder :key="'tree-characters-' + book.uuid" :properties="book"></book-characters-folder>
                        <book-locations-folder :key="'tree-locations-' + book.uuid" :properties="book"></book-locations-folder>
                        <book-scenes-folder :key="'tree-scenes-' + book.uuid" :properties="book"></book-scenes-folder>
                    </ul>
                </li>
            </ul>
            <ul v-bind:class="{'active' : tab === 'books-i-read' }"  class="left-sidebar-tab-content level-1">
                <li v-bind:class="{ 'open' : book.is_open }" v-bind:key="book.id" v-for="(book) in books_i_read">
                    <div class="label" @click="TOGGLE_BOOK_I_READ(book,'book')">
                      <i v-if="book.is_open" class="fas fa-chevron-down"></i>
                      <i v-else class="fas fa-chevron-right"></i>
                      <i class="fas fa-book"></i>
                      <span>{{ book.title || 'Untitled' }}</span>
                    </div>
                    <ul v-if="book.is_open" class="level-2">
                        <book-i-read-chapters-folder :key="'tree-chapters-' + book.uuid" :properties="book"></book-i-read-chapters-folder>
                        <!-- <book-i-read-scenes-folder :key="'tree-scenes-' + book.uuid" :properties="book"></book-i-read-scenes-folder> -->
                    </ul>
                </li>
            </ul>
          <div class="updateVersion" >
            <!--avaialable update-->
            <span v-if="auto_update.status == 'updateAvailable'" @click="downloadAppUpdate()" href='#' ><i class="las la-code-branch icon" v-html="auto_update.text"></i></span>
            <!--progress-->
            <span v-if="(auto_update.status == 'downloadProgress')" v-html="'Downloading v' + auto_update.version"></span>
            <b-progress v-if="(auto_update.status == 'downloadProgress')" :max="100">
              <b-progress-bar :value="(auto_update.progress < 7) ? 7 :auto_update.progress" :label="`  ${((auto_update.progress / 100) * 100).toFixed(2)}%`"></b-progress-bar>
            </b-progress>
            <!--install update-->
            <span v-if="auto_update.status == 'downloaded'" @click="installNewVersion()" href='#' ><i class="las la-code-branch icon" v-html="' Install new version: ' + auto_update.version"></i></span>
          </div>
        </div>
    </div>
</template>

<script>
import BookChaptersFolder from '@/components/tree/BookChaptersFolder'
import BookItemsFolder from '@/components/tree/BookItemsFolder'
import BookCharactersFolder from '@/components/tree/BookCharactersFolder'
import BookLocationsFolder from '@/components/tree/BookLocationsFolder'
import BookScenesFolder from '@/components/tree/BookScenesFolder'

import BookIReadChaptersFolder from '@/components/tree/BookIReadChaptersFolder'
import BookIReadScenesFolder from '@/components/tree/BookIReadScenesFolder'

const electron = window.require('electron')
const log = window.require('electron-log')
const { ipcRenderer } = electron

// In renderer process (web page).
export default {
  name: 'MainSideNavigation',
  data () {
    return {
      // chapters: [],
      scenes: [],
      items: [],
      locations: [],
      other_scenes: [],
      tab: 'my-books',
      platform: '',
      auto_update: {
        version: '',
        downloaded_version: '',
        progress: 0,
        status: '',
        text: ''
      }
    }
  },
  components: {
    BookChaptersFolder,
    BookItemsFolder,
    BookCharactersFolder,
    BookLocationsFolder,
    BookScenesFolder,
    BookIReadChaptersFolder,
    BookIReadScenesFolder
  },
  computed: {
    books: function () {
      var authorUUID = this.$store.getters.getAuthorID
      return this.$store.getters.getBooksByAuthor(authorUUID)
    },
    books_i_read: function () {
      var authorUUID = this.$store.getters.getAuthorID
      return this.$store.getters.getBooksIReadByAuthor(authorUUID)
    }
  },
  methods: {
    updateStyle: function () {
      let scope = this
      if (scope.platform === 'darwin') {
        return 'top:20px;'
      }
    },
    changeComponent: function (tabComponent, data, tabTitle = 'New Tab', newTab = false, tabIndex = 0) {
      var scope = this
      // scope.$parent.changeComponent(component, data)
      if (newTab) {
        scope.$store.dispatch('newTab', { title: tabTitle, component: tabComponent })
      } else {
        scope.$store.dispatch('changeTabContent', { title: tabTitle, component: tabComponent, data: data, index: tabIndex })
      }
    },
    toggle: function (data) {
      var scope = this
      var isOpen = !((typeof data.is_open !== 'undefined' && data.is_open))
      scope.$set(data, 'is_open', isOpen)
    },
    toggleTab: function (tab) {
      var scope = this
      scope.tab = tab
    },
    installNewVersion: function () {
      const scope = this
      let modified = scope.$store.getters.getModifiedTabs
      if (modified.length > 0) {
        var text = ''
        for (let i = 0; i < modified.length; i++) {
          let current = modified[i]
          text += '<p style="margin:0px;">' + current.title + '</p>'
        }
        window.swal.fire({
          position: 'center',
          icon: 'warning',
          title: this.$t('UNABLE_TO_INSTALL_NEW_UPDATE_YOU_HAVE_UNSAVED_CHANGES'),
          html: text + '<br/>'
        })
        return false
      }
      window.swal.fire({
        title: this.$t('ARE_YOU_SURE_YOU_WANT_TO_INSTALL_UPDATE'),
        text: this.$t('PLEASE_SAVE_ALL_YOUR_WORK_BEFORE_YOU_INSTALL') + this.$t('YOU_WONT_BE_ABLE_TO_REVERT_THIS'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('RESTART_AND_INSTALL')
      }).then((result) => {
        if (result.value) {
          log.info('Quit and install update triggered')
          ipcRenderer.send('install-update')
        }
      })
    },
    downloadAppUpdate: function () {
      ipcRenderer.send('AUTO_UPDATE:downloadAppUpdate')
    },
    checkAppUpdate: function () {
      var scope = this
      // check available update
      ipcRenderer.send('AUTO_UPDATE:checkUpdateAvailable')
      ipcRenderer.on('AUTO_UPDATE:updateAvailable', function (event, data) {
        // show downloaded version if the downloaded version is not the same as the update version
        // log.info('scope.auto_update.downloaded_version !== data.version: ' + (scope.auto_update.downloaded_version !== data.version))
        // log.info('scope.auto_update.status !== downloadProgress: ' + (scope.auto_update.status !== 'downloadProgress'))
        // log.info('scope.auto_update.status !== downloaded: ' + (scope.auto_update.status !== 'downloaded'))
        if (
          scope.auto_update.downloaded_version !== data.version &&
          scope.auto_update.status !== 'downloadProgress' &&
          scope.auto_update.status !== 'downloaded'
        ) {
          scope.auto_update.status = 'updateAvailable'
          scope.auto_update.version = data.version
          scope.auto_update.text = 'Download new version: ' + data.version
        }
      })

      // show prepate since there is a time delay in downloading
      ipcRenderer.on('AUTO_UPDATE:prepareDownload', function (event, data) {
        scope.auto_update.text = 'Preparing download ...'
      })

      // show error via notification
      ipcRenderer.on('AUTO_UPDATE:error', function (event, data) {
        log.warn(data.error)
        scope.auto_update.status = 'updateAvailable'
        ipcRenderer.send('AUTO_UPDATE:checkUpdateAvailable')
        scope.$notify({
          group: 'notification',
          title: 'Downloading new version Failed!',
          text: data.error,
          type: 'warn'
        })
      })

      // show download progress
      ipcRenderer.on('AUTO_UPDATE:downloadProgress', function (event, data) {
        scope.auto_update.status = 'downloadProgress'
        scope.auto_update.progress = data.progress
        if (scope.auto_update.progress >= 100) {
          scope.auto_update.status = 'downloaded'
        }
      })

      // after 100 and checking after app is re-open with finish download
      ipcRenderer.on('AUTO_UPDATE:downloaded', function (event, data) {
        scope.auto_update.status = 'downloaded'
        scope.auto_update.downloaded_version = data.version
      })
    }
  },
  mounted () {
    var scope = this
    scope.checkAppUpdate()
    ipcRenderer.send('GET_PROCESS_PLATFORM')
    ipcRenderer.on('PROCESS_PLATFORM', function (event, data) {
      scope.platform = data.platform
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.new-book { font-family: 'Crimson Roman'; color:#abc4d7; font-size: 14px; cursor: pointer }
.new-book:hover  { color:#fff; }

.updateVersion{ padding-left:5px;width:325px;background: #324553;position: fixed;bottom: 0;left: 0;text-align: center;margin-left: -5px;}
.updateVersion span{ font-family: 'Crimson Roman'; color:#abc4d7; font-size: 14px; cursor: pointer }
.updateVersion span:hover  { color:#fff; }
.es-tree-view {
  margin-bottom: 64px;
}
</style>
