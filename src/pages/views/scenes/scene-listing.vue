<template>
<div class="es-page-main page-scene-listing">
    <div>
        <div class="es-page-head-2">
            <div class="row-head">
                <div>
                  <h4 class="main-title"><i class="fas fa-photo-video mr-1"></i> {{$t('OTHER_SCENES')}}</h4>
                  <small>{{$t('BELOW_ARE_THE_LIST_OF_SCENES_UNDER')}} {{ properties.title }}</small>
                </div>
                <div>
                  <button class="es-button btn-sm" @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + properties.uuid, tabComponent: 'scene-form', tabData: { book: book, scene: null }, tabTitle: $t('NEW_SCENE'), newTab: true})">{{$t('NEW_SCENE').toUpperCase()}}</button>
                </div>
            </div>
        </div>
        <div class="es-page-content">
            <ul class="es-breadcrumb">
              <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">{{ book.title }}</a></li>
              <li><a href="javascript:void(0);">{{ $t('OTHER_SCENES') }}</a></li>
            </ul>
            <draggable v-model="scenes" draggable=".kj-col" class="row kj-row">
                <div class="col-3 col-md-3 col-sm-12 kj-col fadeIn animated" v-for="scene in scenes" v-bind:key="scene.id">
                    <div class="es-card">
                        <div class="es-card-content">
                        <div class="es-card-actions">
                            <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + scene.uuid, tabComponent: 'scene-form',  tabData: { book: book, scene: scene, chapter: null}, tabTitle: $t('EDIT')+ ' - ' + scene.title, newTab: true })"><i class="las la-pencil-alt"></i></button>
                            <button class="btn-circle" @click="deleteScene(scene)"><i class="las la-trash-alt"></i></button>
                            <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + scene.uuid, tabComponent: 'scene-details',  tabData: { book: book, scene: scene, chapter: null}, tabTitle: $t('VIEW')+ ' - ' + scene.title })"><i class="lar la-eye"></i></button>
                        </div>
                            <p class="title ellipsis-2">{{ scene.title || 'Untitled' }}</p>
                            <i class="description ellipsis-2">{{ scene.short_description || $t('NO_SHORT_DESCRIPTION') + '...'  }}</i>
                        </div>
                        <div class="es-card-footer">
                            <small>{{$t('VERSIONS')}}: {{ scene.scene_version.length }}</small>
                            <small style="float:right;">{{$t('WORD_COUNT')}}: {{ WORD_COUNT((scene.scene_version[0]) ? scene.scene_version[0].content : 0) }}</small>
                        </div>
                    </div>
                </div>
            </draggable>
        </div>
    </div>
</div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'scene-listing',
  props: ['properties'],
  data: function () {
    return {
      otherScenes: [],
      bookUUID: ''
    }
  },
  components: {
    draggable
  },
  computed: {
    book: function () {
      return this.properties
    },
    scenes: {
      get () {
        let scope = this
        let scenes = scope.$store.getters.getScenesByBook(scope.bookUUID)
        return scenes
      },
      set (value) {
        let scope = this
        this.$store.commit('sortScenes', { PARENT: scope.bookUUID, data: value })
      }
    }
  },
  methods: {
    deleteScene: function (scene) {
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
            .delete('http://localhost:3000/scenes/' + scene.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeSceneFromList', scene)
                })
              }
            })
        }
      })
    }
  },
  mounted () {
    var scope = this
    // scope.getOtherScenes(scope.properties.id)
    scope.bookUUID = scope.properties.uuid
  }
}
</script>
