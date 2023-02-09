<template>
<div v-if="page.is_ready" class="es-page-main page-book-details">
    <div class="es-page-head-2">
        <div class="row-head" style="margin-bottom: 10px;">
            <div>
                <h4 class="main-title"><i class="fas fa-book mr-1"></i> {{ properties.title }}</h4>
            </div>
            <div class="book-panel-right">
              <button class="es-button btn-sm white" @click="markAsFinished()">{{$t('MARK_AS_FINISHED')}}</button>
              <!-- <button class="es-button-white" @click="markAsCanceled()">{{$t('MARK_AS_CANCEL')}}</button> -->
              <button class="es-button btn-sm white" @click="toggleNotes()">{{$t('MY NOTES').toUpperCase()}}</button>
              <a class="es-button btn-sm w-icon icon-left warning" href="#goToFeedbacks"><i class="las la-comments"></i> Feedbacks</a>
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
        <Note v-if="show_notes" :properties="{ book: properties, parent: properties, parent_name: 'book' }"></Note>
        <div class="es-panel">
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
import moment from 'moment'
import Note from '../../../components/Note'
import Feedback from '../../../components/Feedback'
const {ipcRenderer} = window.require('electron')

export default {
  name: 'books-i-read-book-details',
  props: ['properties'],
  data: function () {
    return {
      page: {
        is_ready: false,
        title: '',
        data: null
      },
      filter: 'all',
      selected: false,
      message: '',
      response: '',
      show_feedbacks: false,
      show_notes: false,
      export_book: this.$t('EXPORT').toUpperCase() + ' ' + this.$t('BOOK').toUpperCase()
    }
  },
  computed: {

  },
  components: {
    Note,
    Feedback
  },
  methods: {
    reloadBookIReadPage (authorId) {
      const scope = this
      const remainingBooksIRead = scope.$store.getters.getBooksIReadByAuthor(authorId)
      if (remainingBooksIRead.length) {
        scope.TOGGLE_BOOK_I_READ(remainingBooksIRead[0], 'book', authorId)
      } else {
        scope.CHANGE_COMPONENT({tabKey: 'dashboard', tabComponent: 'dashboard', tabData: null, tabTitle: 'DASHBOARD'})
      }
    },
    markAsFinished () {
      const scope = this
      window.swal.fire({
        title: scope.$t('Mark as Finished ?'),
        text: scope.$t("Are you sure you've done reading?"),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.value) {
          scope.axios.post('http://localhost:3000/readers/mark-as-finished', {
            book_id: scope.properties.uuid,
            author_id: scope.$store.getters.getAuthorID,
            status: 1
          }).then(response => {
            if (response.data) {
              // console.log(response)
              window.swal.fire({
                position: 'center',
                icon: 'success',
                title: scope.$tc('Finished reading this book'),
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                const data = {
                  uuid: response.data.book.uuid,
                  author_id: response.data.author_id
                }
                scope.$store.dispatch('removeBookIReadFromList', data)
                scope.reloadBookIReadPage(scope.$store.getters.getAuthorID)
              })
            } else {
              console.error(response.data.message)
            }
          })
        }
      })
    },
    markAsCanceled () {
      const scope = this
      window.swal.fire({
        title: scope.$t('Mark as Canceled ?'),
        text: scope.$t("Please let the author know why you weren't able to finish the book:"),
        input: 'textarea',
        inputValue: '',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!'
          }
        },
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          scope.axios.post('http://localhost:3000/readers/mark-as-canceled', {
            book_id: scope.properties.uuid,
            author_id: scope.$store.getters.getAuthorID,
            reasons: result.value,
            status: 2
          }).then(response => {
            if (response.data) {
              window.swal.fire({
                position: 'center',
                icon: 'success',
                title: scope.$tc('Successfuly canceled reading this book'),
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                const data = {
                  uuid: response.data.book.uuid,
                  author_id: response.data.author_id
                }
                scope.$store.dispatch('removeBookIReadFromList', data)
                scope.reloadBookIReadPage(scope.$store.getters.getAuthorID)
              })
            } else {
              console.error(response.data.message)
            }
          })
        }
      })
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
      scope.export_book = scope.$t('LOADING').toUpperCase() + '....'

      let book = scope.properties

      ipcRenderer.send('EXPORT-DOCX-SHOW-BOOK-WINDOW', book)

      ipcRenderer.on('CHANGE-EXPORT-BOOK-BUTTON-NAME', function (event, data) {
        scope.export_book = scope.$t('EXPORT').toUpperCase() + ' ' + scope.$t('BOOK').toUpperCase()
      })
    },
    toggleFeedbacks: function () {
      let scope = this
      scope.show_feedbacks = !scope.show_feedbacks
    },
    toggleNotes: function () {
      let scope = this
      scope.show_notes = !scope.show_notes
    },
    formatDate: function (data) {
      return moment(data.created_at).calendar()
    }
  },
  mounted () {
    var scope = this
    scope.page.title = scope.properties.title
    scope.page.data = scope.properties
    scope.page.is_ready = true
  }
}

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
