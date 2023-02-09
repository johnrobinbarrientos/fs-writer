<template>
<div v-if="page.is_ready" class="es-page-main page-chapter-listing">
    <div class="es-page-head-2">
        <div class="row-head">
          <div>
              <h4 class="main-title"><i class="fas fa-folder mr-1"></i> {{ book.title }}</h4>
              <small>{{$t('BELOW_ARE_THE_LIST_OF_SCENES_UNDER')}} {{ book.title }}</small>
          </div>
          <div class="book-panel-right">
            <button class="es-button btn-sm white" @click="CHANGE_COMPONENT({tabKey: 'chapter-form', tabComponent: 'chapter-form', tabData: { book: book, chapter: null }, tabTitle: $t('NEW_CHAPTER'), newTab: true})">{{$t('NEW_CHAPTER').toUpperCase()}}</button>
            <b-button class="es-button btn-sm white" :disabled="getExportCharactersStatus.status == true"  @click="exportScenes(book.uuid)">
                <span v-if="getExportCharactersStatus.status === false"><span>{{$t('EXPORT_SCENES_LIST').toUpperCase()}}</span></span>
                <span v-else>
                  <b-spinner small type="grow"></b-spinner>
                  <span>{{exportLoading}}</span>
                </span>
            </b-button>
          </div>
        </div>
    </div>

    <div class="es-page-content" id="custom-scrollbar">

        <ul class="es-breadcrumb">
          <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">{{ book.title }}</a></li>
          <li><a href="javascript:void(0);" style="padding-right: 20px;">{{ $t('CHAPTERS') }}</a></li>
        </ul>

        <draggable v-model="chapters" draggable=".kj-col" class="row kj-row">
        <div class="col-md-3 col-sm-12 kj-col fadeIn animated" v-for="chapter in chapters" v-bind:key="chapter.id">
            <div class="es-card">
                <div class="es-card-content">
                    <div class="es-card-actions">
                        <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'chapter-form-' + chapter.uuid, tabComponent: 'chapter-form',  tabData: { book: book, chapter: chapter }, tabTitle: $t('EDIT')+ ' - ' + chapter.title, newTab: true })"><i class="las la-pencil-alt"></i></button>
                        <button class="btn-circle" @click="deleteChapter(chapter)"><i class="las la-trash-alt"></i></button>
                        <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + chapter.uuid, tabComponent: 'chapter-details',  tabData: { book: book, chapter: chapter }, tabTitle: $t('VIEW')+ ' - ' + chapter.title})"><i class="lar la-eye"></i></button>
                    </div>
                    <p class="title ellipsis-2">{{ displayTitle(chapter.title) }}</p>
                    <i class="description ellipsis-2">{{ chapter.short_description || $t('NO_SHORT_DESCRIPTION') + '...' }}</i>
                </div>
                <div class="es-card-footer">
                    <small>{{$t('SCENES')}}: {{ ($store.getters.getScenesByChapter(chapter.uuid)) ? $store.getters.getScenesByChapter(chapter.uuid).length : 0 }}</small>
                    &nbsp; &bull; &nbsp;
                    <small>{{$t('VERSIONS')}}: {{ ($store.getters.getChapterVersions(chapter.uuid)) ? $store.getters.getChapterVersions(chapter.uuid).length : 0}}</small>
                    <small style="float:right;">{{$t('WORD_COUNT')}}: {{ WORD_COUNT($store.getters.getChapterContent(chapter.uuid)) }}</small>
                </div>
            </div>
        </div>
        </draggable>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
const {ipcRenderer} = window.require('electron')
export default {
  name: 'chapter-listing',
  props: ['properties'],
  components: {
    draggable
  },
  data: function () {
    return {
      page: {
        is_ready: false
      },
      exportOnProgress: false,
      exportDefaultName: this.$t('EXPORT_SCENES_LIST').toUpperCase(),
      exportLoading: this.$t('Loading'),
      bookUUID: ''
    }
  },
  computed: {
    ...mapGetters({ getExportCharactersStatus: 'getExportCharactersStatus' }),
    book: function () {
      return this.properties
    },
    chapters: {
      get () {
        let scope = this
        let chapters = scope.$store.getters.getChaptersByBook(scope.bookUUID)
        for (let chaptersKey in chapters) {
          scope.$store.dispatch('loadScenesByChapter', chapters[chaptersKey].uuid)
          scope.$store.dispatch('loadVersionsByChapter', chapters[chaptersKey].uuid)
        }
        return chapters
      },
      set (value) {
        let scope = this
        this.$store.commit('sortChapters', { bookUUID: scope.bookUUID, data: value })
      }
    }
  },
  methods: {
    log: function (chapterUUID) {
      // console.log(chapterUUID)
      // console.log(this.list1)
      // console.log(this.list2)
    },
    displayTitle: function (title) {
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
    deleteChapter: function (chapter) {
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
            .delete('http://localhost:3000/chapters/' + chapter.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeChapterFromList', chapter)
                })
              }
            })
        }
      })
    },
    exportScenes: function () {
      const scope = this
      scope.$store.commit('exportCharactersStatusOpen')
      ipcRenderer.send('EXPORT_PDF_SHOW_SCENE', {bookUUID: scope.bookUUID, title: scope.properties.title})
    }
  },
  mounted () {
    var scope = this
    scope.bookUUID = scope.properties.uuid
    ipcRenderer.on('EXPORT_PDF_ENABLE_BUTTON', function () {
      scope.$store.commit('exportCharactersStatusClose')
    })
    setTimeout(function () {
      scope.page.is_ready = true
    }, 100)
  }
}
</script>
