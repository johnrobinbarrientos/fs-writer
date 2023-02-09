<template>
  <li v-if="component.is_ready" v-bind:class="{ 'open' : $store.getters.isBookIReadScenesFolderOpen(book) }">
    <div @click="TOGGLE_BOOK_I_READ(book,'scenes')" class="label">
      <span v-if="$store.getters.isBookIReadScenesFolderOpen(book)">
        <i class="fas fa-chevron-down"></i>
        <i class="fas fa-folder-open"></i>
      </span>
      <span v-else>
        <i class="fas fa-chevron-right"></i>
        <i  class="fas fa-folder"></i>
      </span>
      {{ $t('OTHER_SCENES') }}
    </div>
    <draggable tag="ul"  v-model="scenes" draggable=".handle" class="level-3">
      <li  v-bind:key="scene.id" v-for="scene in scenes" class="handle ellipsis-2">
        <div @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + scene.uuid, tabComponent: 'scene-details', tabData: { book: book, scene: scene, chapter: null }, tabTitle: scene.title})" class="label"><span><img  src="@/assets/img/icons/scene.svg"> {{ scene.title || 'Untitled' }}</span></div>
      </li>
    </draggable>
  </li>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'book-i-read-scenes-folder',
  props: ['properties'],
  data: function () {
    return {
      component: {
        title: '',
        is_ready: false,
        data: null
      }
    }
  },
  components: {
    draggable
  },
  computed: {
    scenes: {
      get () {
        let scenes = this.$store.getters.getScenesByBook(this.book.uuid)
        return scenes
      },
      set (value) {
        this.$store.commit('sortScenes', { PARENT: this.book.uuid, data: value })
      }
    }
  },
  methods: {

  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this
    scope.book = scope.properties

    scope.component.is_ready = true
  }
}
</script>
