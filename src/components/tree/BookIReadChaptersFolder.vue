<template>
    <li v-if="component.is_ready" v-bind:class="{ 'open' : $store.getters.isBookIReadChaptersFolderOpen({author_id: authorUUID, book: book }) }">
        <div @click="TOGGLE_BOOK_I_READ(book,'chapters')" class="label">
            <span>
              <span v-if="$store.getters.isBookIReadChaptersFolderOpen({author_id: authorUUID, book: book })">
                  <i class="fas fa-chevron-down"></i>
                  <i class="fas fa-folder-open"></i>
              </span>
              <span v-else>
                <i class="fas fa-chevron-right"></i>
                <i  class="fas fa-folder"></i>
              </span>
              {{ $t('CHAPTERS') }}
            </span>
        </div>
        <draggable tag="ul" v-model="chapters" draggable=".none" class="level-3">
            <li v-bind:class="{ 'open' : $store.getters.isBookIReadChaptersFolderOpen({author_id: authorUUID, book: book }) }" v-bind:key="chapter.id" v-for="chapter in chapters" class="handle ellipsis-2">
              <div @click="toggleChapter(chapter)" class="label">
                <span>
                  <span>
                    <i class="fas fa-bookmark"></i>
                  </span>
                </span>
                <span> {{ chapter.title }}</span>
              </div>
              <book-i-read-chapter-scenes-folder v-if="chapter.is_open" :key="'tree-chapter-scenes-' + chapter.uuid" :properties="{book: book, chapter: chapter}"></book-i-read-chapter-scenes-folder>
            </li>
        </draggable>
    </li>
</template>
<script>
import draggable from 'vuedraggable'
import BookIReadChapterScenesFolder from '@/components/tree/BookIReadChapterScenesFolder'

export default {
  name: 'book-i-read-chapters-folder',
  props: ['properties'],
  data: function () {
    return {
      component: {
        title: '',
        is_ready: false,
        data: null
      },
      chapter: null,
      authorUUID: null
    }
  },
  components: {
    draggable,
    'book-i-read-chapter-scenes-folder': BookIReadChapterScenesFolder
  },
  computed: {
    chapters: {
      get () {
        let scope = this
        let chapters = scope.$store.getters.getChaptersByBook(scope.book.uuid)
        /*
         * Only show in Book-I-Read Chapters that are hidden=0
         * */
        let chapterList = []
        for (let chaptersKey in chapters) {
          if (chapters[chaptersKey].hidden === 0) {
            chapterList.push(chapters[chaptersKey])
          }
        }
        return chapterList
      },
      set (value) {
        let scope = this
        if (value) {
          this.$store.commit('sortChapters', {bookUUID: scope.book.uuid, data: value})
        }
      }
    },
    book: function () {
      return this.properties
    }
  },
  methods: {
    toggleChapter: function (chapter) {
      let scope = this

      let config = {
        tabKey: 'chapter-details-' + chapter.uuid,
        tabComponent: 'books-i-read-chapter-details',
        tabData: { book: scope.book, chapter: chapter },
        tabTitle: chapter.title
      }

      scope.$store.dispatch('toggleChapter', chapter)
      scope.CHANGE_COMPONENT(config)
    }
  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this
    scope.component.is_ready = true
    scope.authorUUID = this.$store.getters.getAuthorID
  }
}
</script>
