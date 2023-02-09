<template>
<div v-if="page.is_ready" class="es-page-main page-book-details">
    <div class="es-page-head-2">
      <div class="row-head" style="margin-bottom: 10px;">
          <div>
            <h4 class="main-title"><i class="fas fa-book mr-1"></i> {{ properties.title }}</h4>
          </div>
          <div class="book-panel-right">
            <button class="es-button btn-sm white" @click="CHANGE_COMPONENT({tabKey: 'storyboard-' + page.data.uuid, tabComponent: 'storyboard',  tabData: page.data, tabTitle: 'Story Board - ' + properties.title, newTab: true})">Story Board</button>
            <button class="es-button btn-sm white" :disabled="getExportBookStatus.export_book_status"  @click="exportBook()">
              <span v-if="getExportBookStatus.export_book_status === false"><span>{{export_book}}</span></span>
              <span v-else>
                <b-spinner small type="grow"></b-spinner>
                <span>{{exportLoading}}</span>
              </span>
            </button>
            <button class="es-button btn-sm white" @click="getImport()">{{ $t('IMPORT_MULTIPLE_CHAPTERS') }}</button>
            <a class="es-button icon-only warning" href="#goToFeedbacks"><i class="las la-comments"></i><!--{{$t('FEEDBACKS').toUpperCase()}}--></a>
            <button class="es-button icon-only" @click="CHANGE_COMPONENT({tabKey: 'book-form-' + page.data.uuid, tabComponent: 'book-form',  tabData: page.data, tabTitle: $t('EDIT') + ' - ' + properties.title, newTab: true})"><i class="las la-highlighter"></i></button>
            <button class="es-button icon-only danger" @click="deleteBook()"><i class="las la-trash-alt"></i></button>
          </div>
      </div>
      <div class="row-head">
          <div>
            <span class="book-genre" v-for="genre in properties.genre" :key="genre.uuid">{{ genre.name }}</span>
          </div>
          <div class="d-flex align-items-center">
            <i class="las la-cog" style="font-size: 18px; margin-right: 4px;"></i><small> {{ $t('DATE_MODIFIED') }}: {{ properties.created_at }}</small>
          </div>
      </div>
    </div>
    <div class="es-page-content" id="custom-scrollbar">
        <div class="mb-5">
            <h4>{{ $t('ABOUT') }}</h4>
            <div v-html="properties.about"></div>
        </div>
        <div id="goToFeedbacks">
          <Feedback :properties="{ book: properties, parent: properties, parent_name: 'book', toggleType: false }"></Feedback>
        </div>
    </div>
</div>
</template>

<script>
// import moment from 'moment'
import axios from 'axios'
import { mapGetters } from 'vuex'
import Feedback from '../../../components/Feedback'
const {ipcRenderer} = window.require('electron')

export default {
  name: 'book-details',
  props: ['properties'],
  data: function () {
    return {
      page: {
        is_ready: false,
        title: '',
        data: null
      },
      export_book: this.$t('EXPORT_BOOK'),
      exportOnProgress: false,
      exportLoading: this.$t('Loading'),
      data: [],
      selected_book_id: null,
      filter: 'all',
      selected: false,
      message: '',
      response: '',
      show_feedbacks: true,
      show_notes: false,
      feedbacks: []
    }
  },
  computed: {
    ...mapGetters({ getExportBookStatus: 'getExportBookStatus' })
  },
  components: {
    Feedback
  },
  methods: {
    getImport: function () {
      var scope = this
      ipcRenderer.send('IMPORT-DOCX-MULTI-CHAPTERS', scope.properties)
    },
    updateBook () {
      var scope = this
      // scope.$parent.getBooks()
      // scope.$parent.changeComponent('book-form', scope.properties)
      scope.$parent.changeComponent('book-form', scope.properties, scope.properties.title, true)
      scope.$store.commit('addTab', { title: scope.properties.title, component: 'book-form', data: scope.properties })
    },

    deleteBook () {
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
            .delete('http://localhost:3000/books/' + scope.properties.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeBookFromList', scope.properties)
                  scope.CHANGE_COMPONENT({tabKey: 'dashboard', tabComponent: 'dashboard', tabData: null, tabTitle: 'DASHBOARD'})
                })
              }
            })
        }
      })
    },

    exportBook: function () {
      const scope = this
      scope.$store.commit('exportBookStatusOpen')

      let book = scope.properties

      ipcRenderer.send('EXPORT-DOCX-SHOW-BOOK-WINDOW', book)

      ipcRenderer.on('CHANGE-EXPORT-BOOK-BUTTON-NAME', function (event, data) {
        scope.exportOnProgress = false
        scope.export_book = scope.$t('EXPORT_BOOK')
      })
    }
  },
  mounted () {
    var scope = this
    scope.page.title = scope.properties.title
    scope.page.data = scope.properties
    scope.page.is_ready = true

    ipcRenderer.on('SET-EXPORT-BOOK-BUTTON-ENABLE', function (event, data) {
      scope.$store.commit('exportBookStatusClose')
    })
  }
}

ipcRenderer.on('GET-DOCX-CONTENT-MULTI-CHAPTERS-2', function (event, data) {
  let chapters = []
  let wholeChapter = []

  const contents = window.$.parseHTML(data.html)

  window.$.each(contents, function (i, node) {
    const outerHtml = window.$(node).get(0).outerHTML
    if (window.$.inArray(node.nodeName.toLowerCase(), ['h1']) > -1) {
      chapters.push({title: window.$(node).get(0).innerHTML, fileContent: ''})
      return true
    }

    if (chapters[chapters.length - 1] !== undefined) {
      // exclude element with &nbsp; content
      if (window.$(node).html() === '&nbsp;' || window.$(node).is(':empty') || window.$(node).html() === '<br>') {
        return true
      }
      // concat all element outerHtml/text after h1
      chapters[chapters.length - 1]['fileContent'] += outerHtml
    }
  })

  for (var i = 0; i < chapters.length; i++) {
    wholeChapter.push({book_id: data.book.uuid, title: chapters[i].title, chapter_version: {content: chapters[i].fileContent}})
    axios
      .post('http://localhost:3000/chapters', wholeChapter[i])
      .then(response => {
        if (response.data) {
        }
      })
  }

  wholeChapter = []

  window.swal.fire({
    position: 'center',
    icon: 'success',
    title: window.vm.$t('CHAPTERS') + ' ' + window.vm.$t('SUCCESSFULY_IMPORTED'),
    showConfirmButton: false,
    timer: 1500
  })
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.book-stats { padding-left:30px; }
.book-stats .heading { font-family:'Gotham Bold'; }
.book-stats ul { margin-top:5px; }
.book-genre { padding:3px 10px; font-size:12px; font-size:10px; font-family:'Crimson Roman Bold'; text-transform: uppercase; margin-right: 3px; }
.book-genre:nth-child(odd) { background:#e1e7fe; color:#9098c5; }
.book-genre:nth-child(even) { background:#feedda; color:#d6a67f; }

.es-page-head {
  height: 110px;
}

@media only screen and (max-width: 968px) {
  .book-stats { display:none; }
}
</style>
