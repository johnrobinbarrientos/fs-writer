<template>
<div class="page-book-form">
    <div class="es-page-head-2">
        <div class="row-head">
            <div>
                <div v-if="properties != null">
                    <h4>{{ properties.title }}</h4>
                    <small>{{$t('DATE_MODIFIED')}}: {{ properties.created_at }}</small>
                </div>
                <div v-else>
                    <h4>{{$t('CREATE_NEW_BOOK')}}</h4>
                </div>
            </div>
            <div class="book-panel-right">
                <button v-if="properties != null" class="es-button btn-sm white" @click="saveBook()">{{$t('SAVE_CHANGES')}}</button>
                <button v-else class="es-button btn-sm white" @click="saveBook()">{{$t('SAVE')}}</button>
            </div>
        </div>
    </div>
    <div class="es-page-content">
        <div class="container">
            <div class="es-panel">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label>{{$t('TITLE')}}: </label>
                            <input @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)" v-model="data.title" type="text" class="form-control" :placeholder= "$t('TITLE')">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label>{{$t('GENRE')}}: </label>
                            <multiselect v-model="genre_collection" @select="selectGenre" @remove="removeGenre" :multiple="true" :taggable="true" label="name" track-by="uuid" :options="genres" :placeholder = "$t('SELECT_OPTION')" :deselectLabel="$t('PLEASE_ENTER_TO_DESELECT')" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')" :selectedLabel="$t('SELECTED')"></multiselect>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label>{{$t('ABOUT')}}: </label>
                            <!-- <div class='import-doc-container'><button @click="getImport()">Import Docx</button></div> -->
                            <button @click="getImport()">Import Docx</button>
                            <tiny-editor :initValue="data.about" v-on:getEditorContent="setAboutValue" class="form-control" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import TinyMCE from '@/components/TinyMCE'
const {ipcRenderer} = window.require('electron')

export default {
  name: 'book-form',
  props: ['properties'],
  data: function () {
    return {
      data: {
        id: null,
        uuid: null,
        author_id: null,
        title: '',
        book_genre_collection: [],
        about: ''
      },
      tempAbout: '',
      genre_collection: [],
      genres: []
    }
  },
  components: {
    TinyMCE,
    Multiselect
  },
  methods: {
    // Required for geting value from TinyMCE content
    setAboutValue (value) {
      var scope = this
      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      scope.tempAbout = value
    },
    removeGenre ({uuid}) {
      var scope = this
      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      if (scope.data.book_genre_collection.find(x => (x.genre_id === uuid && x.deleted_at === undefined)) !== undefined) {
        scope.data.book_genre_collection.find(x => x.genre_id === uuid).deleted_at = window.moment().format('YYYY-MM-DD hh:mm:ss').toString()
      }
    },
    selectGenre ({uuid}) {
      var scope = this
      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      if (scope.data.book_genre_collection.find(x => (x.genre_id === uuid && x.deleted_at !== undefined)) !== undefined) {
        delete scope.data.book_genre_collection.find(x => x.genre_id === uuid).deleted_at
      }
    },
    getImport: function () {
      var scope = this
      ipcRenderer.send('IMPORT-DOCX', 'book')

      ipcRenderer.on('GET-DOCX-CONTENT-BOOK', function (event, data) {
        scope.data.about = data
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
        scope.tempAbout = data
      })
    },
    getGenre: function () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/books/genres')
        .then(response => {
          scope.genres = response.data
        })
    },
    saveBook: function () {
      var scope = this
      scope.data.about = scope.tempAbout

      scope.genre_collection.forEach(function (item, index) {
        if (scope.data.book_genre_collection.find(x => x.genre_id === item.uuid) === undefined) {
          scope.data.book_genre_collection.push({
            genre_id: item.uuid
          })
        }
      })

      scope.axios
        .post('http://localhost:3000/books', scope.data)
        .then(response => {
          if (response.data) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('BOOK') + ' ' + this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              /*
              var userUUID = this.$store.getters.getUserID
              var authorUUID = this.$store.getters.getAuthorID
              scope.$store.dispatch('loadBooksByAuthor', {userUUID: userUUID, authorUUID: authorUUID})
              */
              scope.UNMARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
              scope.$store.dispatch('updateBookList', response.data)
              if (scope.data.id !== null) {
                scope.$store.dispatch('changeTabTitle', {
                  key: 'book-form-' + response.data.uuid,
                  title: this.$t('EDIT') + ' - ' + response.data.title
                })
              } else {
                scope.data.id = response.data.id
                scope.data.uuid = response.data.uuid
                scope.CHANGE_COMPONENT({
                  tabKey: 'book-details-' + response.data.uuid,
                  tabComponent: 'book-details',
                  tabData: response,
                  tabTitle: response.data.title,
                  tabIndex: scope.$store.getters.getActiveTab
                })
              }
              // var userID = this.$store.getters.getUserID
              // scope.$store.dispatch('getBooksByAuthorID', userID)
            })
          }
        })
    },
    loadBook: function () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/books/' + scope.data.uuid)
        .then(response => {
          let book = response.data
          scope.data.title = book.title
          scope.data.about = book.about

          book.book_genre_collection.forEach(function (item, index) {
            scope.data.book_genre_collection.push({
              id: item.id,
              uuid: item.uuid,
              book_id: item.book_id,
              genre_id: item.genre_id
            })

            if (scope.genres.find(x => (x.uuid === item.genre_id)) !== undefined) {
              var selectedGenre = scope.genres.find(x => (x.uuid === item.genre_id))
              scope.genre_collection.push({
                uuid: selectedGenre.uuid,
                name: selectedGenre.name
              })
            }
          })
        })
    }
  },
  beforeMount () {
    var scope = this
    scope.data.author_id = this.$store.getters.getAuthorID
    if (scope.properties !== null) {
      scope.$set(scope.data, 'id', scope.properties.id)
      scope.$set(scope.data, 'uuid', scope.properties.uuid)
    }
  },
  mounted () {
    var scope = this
    scope.getGenre()
    if (scope.data.id !== null) {
      scope.loadBook()
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
  .page-title h3 { font-size:35px; }
  .import-doc-container {text-align:right;}
</style>
