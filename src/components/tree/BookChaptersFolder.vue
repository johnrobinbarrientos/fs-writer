<template>
    <li v-if="component.is_ready" v-bind:class="{ 'open' : $store.getters.isBookChaptersFolderOpen(book) }">
        <div @click="TOGGLE_BOOK(book,'chapters')" class="label">
            <span>
              <span v-if="$store.getters.isBookChaptersFolderOpen(book)">
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
        <draggable tag="ul" v-model="chapters" draggable=".handle" class="level-3">
            <li v-bind:class="{ 'open' : $store.getters.isBookChaptersFolderOpen(book) }" v-bind:key="chapter.id" v-for="chapter in chapters" class="handle ellipsis-2">
              <div @click="toggleChapter(chapter)" class="label">
                <span>
                  <span>
                    <i class="fas fa-bookmark"></i>
                  </span>
                </span>
                <span>{{ chapter.title }}</span>
              </div>
              <chapter-scenes-folder v-if="chapter.is_open" :key="'tree-chapter-scenes-' + chapter.uuid" :properties="{book: book, chapter: chapter}"></chapter-scenes-folder>
            </li>
        </draggable>
    </li>
</template>
<script>
import draggable from 'vuedraggable'
import ChapterScenesFolder from '@/components/tree/ChapterScenesFolder'

export default {
  name: 'book-chapters-folder',
  props: ['properties'],
  data: function () {
    return {
      component: {
        title: '',
        is_ready: false,
        data: null
      },
      chapter: null
    }
  },
  components: {
    draggable,
    ChapterScenesFolder
  },
  computed: {
    chapters: {
      get () {
        let scope = this
        let chapters = scope.$store.getters.getChaptersByBook(scope.book.uuid)
        return chapters
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
        tabComponent: 'chapter-details',
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
  }
}
</script>
