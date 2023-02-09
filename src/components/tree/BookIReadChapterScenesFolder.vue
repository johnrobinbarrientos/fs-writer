<template>
    <draggable v-if="component.is_ready" tag="ul" v-model="scenes" draggable=".handle" class="level-4">
        <li v-bind:key="scene.id" v-for="scene in scenes" class="handle ellipsis-2">
            <div @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + scene.uuid, tabComponent: 'books-i-read-scene-details',  tabData: { book: book, scene: scene, chapter: chapter}, tabTitle: scene.title})" class="label"><span><img  src="@/assets/img/icons/scene.svg"> {{ scene.title || 'Untitled' }}</span></div>
        </li>
    </draggable>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'book-i-read-chapter-scenes-folder',
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
    book: function () {
      return this.properties.book
    },
    chapter: function () {
      return this.properties.chapter
    },
    scenes: {
      get () {
        let scenes = this.$store.getters.getScenesByChapter(this.chapter.uuid)
        return scenes
      },
      set (value) {
        if (value) {
          this.$store.commit('sortScenes', { PARENT: this.chapter.uuid, data: value })
        }
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
    // console.log(scope.properties)
    scope.component.is_ready = true
  }
}
</script>
