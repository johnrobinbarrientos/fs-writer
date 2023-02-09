<template>
<div v-if="page.is_ready" class="es-page-main page-chapter-listing">
    <div class="es-page-head-2">
        <div class="row-head">
            <div>
              <h4 class="main-title"><i class="fas fa-folder mr-1"></i> {{ book.title }}</h4>
              <small>{{$t('BELOW_ARE_THE_LIST_OF_SCENES_UNDER')}} {{ book.title }}</small>
            </div>
        </div>
    </div>
    <!-- <div class="es-page-breadcrumbs">
        <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
        /
        <button class="current">{{ $t('CHAPTERS') }}</button>
    </div> -->
    <div class="es-page-content" id="custom-scrollbar">

        <ul class="es-breadcrumb">
            <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">{{ book.title }}</a></li>
            <li><a href="javascript:void(0);" style="padding-right: 20px;">{{$t('CHAPTERS')}}</a></li>
        </ul>

        <draggable v-model="chapters" draggable=".none" class="row kj-row">
        <div class="col-md-3 col-sm-12 kj-col fadeIn animated" v-for="chapter in chapters" v-bind:key="chapter.id">
            <div class="es-card">
                <div class="es-card-content">
                    <div class="es-card-actions">
                        <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + chapter.uuid, tabComponent: 'books-i-read-chapter-details',  tabData: { book: book, chapter: chapter }, tabTitle: $t('VIEW')+ ' - ' + chapter.title})"><i class="lar la-eye"></i></button>
                    </div>
                    <p class="title ellipsis-2">{{ displayTitle(chapter.title) }}</p>
                    <i class="description ellipsis-2">{{ chapter.short_description || $t('NO_SHORT_DESCRIPTION') + '...' }}</i>
                </div>
                <div class="es-card-footer">
                    <small>{{$t('SCENES')}}: {{ $store.getters.getScenesByChapter(chapter.uuid).length }}</small>
                    <span>&bull;</span>
                    <small>{{$t('VERSIONS')}}: {{ $store.getters.getChapterVersions(chapter.uuid).length }}</small>
                    <span>&bull;</span>
                    <small style="float:right;">{{$t('WORD_COUNT')}}: {{ WORD_COUNT($store.getters.getChapterContent(chapter.uuid)) }}</small>
                </div>
            </div>
        </div>
        </draggable>
    </div>
</div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'books-i-read-chapter-listing',
  props: ['properties'],
  components: {
    draggable
  },
  data: function () {
    return {
      page: {
        is_ready: false
      },
      bookUUID: ''
    }
  },
  computed: {
    book: function () {
      return this.properties
    },
    chapters: {
      get () {
        let scope = this
        let chapters = scope.$store.getters.getChaptersByBook(scope.bookUUID)
        /*
         * Only show in Book-I-Read Chapters that are hidden=0
         * */
        let chapterList = []
        for (let chaptersKey in chapters) {
          if (chapters[chaptersKey].hidden === 0) {
            scope.$store.dispatch('loadScenesByChapter', chapters[chaptersKey].uuid)
            scope.$store.dispatch('loadVersionsByChapter', chapters[chaptersKey].uuid)
            chapterList.push(chapters[chaptersKey])
          }
        }
        return chapterList
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
    }
  },
  mounted () {
    var scope = this
    scope.bookUUID = scope.properties.uuid

    setTimeout(function () {
      scope.page.is_ready = true
    }, 100)
  }
}
</script>
