<template>
<div v-if="page.is_ready" class="page-chapter-scenes ">
        <div style="padding:0px 10px; text-align:right; margin-bottom:20px;">
            <button @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + chapter.uuid, tabComponent: 'scene-form',  tabData: { book: book, chapter: chapter, scene: null }, tabTitle: 'New Scene', newTab: true})" class="btn-new-scene">
                <i class="las la-plus"></i> {{$t('ADD_NEW_SCENE').toUpperCase()}}
            </button>
        </div>
    <draggable v-model="scenes" draggable=".es-col" class="es-row">
        <div class="es-col " v-for="scene in scenes" v-bind:key="scene.id">
            <div class="es-card">
                <div class="es-card-content">
                    <div class="es-card-actions">
                        <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + scene.uuid, tabComponent: 'scene-form',  tabData: { book: book, scene: scene, chapter: chapter}, tabTitle: 'Edit ' + scene.title, newTab: true })"><i class="las la-pencil-alt"></i></button>
                        <button class="btn-circle" @click="deleteScene(scene)"><i class="las la-trash-alt"></i></button>
                        <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + scene.uuid, tabComponent: 'scene-details',  tabData: { book: book, scene: scene, chapter: chapter}, tabTitle: scene.title, newTab: true })"><i class="lar la-eye"></i></button>
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
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'chapter-scenes',
  props: ['properties'],
  data: function () {
    return {
      page: {
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
        let scope = this
        let scenes = scope.$store.getters.getScenesByChapter(scope.chapter.uuid)
        return scenes
      },
      set (value) {
        let scope = this
        this.$store.dispatch('sortScenes', { PARENT: scope.chapter.uuid, data: value })
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
  beforeUpdate () {
    // var scope = this
  },
  async mounted () {
    var scope = this
    try {
      await scope.$store.dispatch('loadScenesByChapter', scope.chapter.uuid)
    } finally {
      scope.page.is_ready = true
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .scene-listing { background:transparent; }
    .scene-listing .btn-new-scene { background:#fff; color:#324553; border:1px solid #496d7d; height:30px; line-height:30px; padding:0px 10px; }
    .scene-listing .es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    .scene-listing .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
    .scene-listing .es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; padding-right:110px; }
    .scene-listing .es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

    .scene-listing .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }

    .scene-listing .es-card .es-card-footer { position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 0px; border-top:1px solid #e0e5ee; }
    .scene-listing .es-card .es-card-footer button { font-weight:600; background:transparent; border:none; height:40px; line-height:32px; text-align:center; font-size:14px; padding:0px 8px; }
    .scene-listing .es-card .es-card-footer button:hover { background:#e0e5ee; }
    .scene-listing .es-card .es-card-footer button i { font-size:18px; }
    .scene-listing .es-card .es-card-footer button.btn-delete { font-weight:600; color:#8f2c39; border-left:1px solid #e0e5ee; position:absolute; top:0px; right:0px; }

    .scene-listing .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }
    .scene-listing .es-card .es-card-content .es-card-actions .btn-circle { background:transparent; border:1px solid #e0e5ee; border-radius:50%; width:30px; height:30px; line-height:22px; text-align:center; font-size:15px; }
    .scene-listing .es-card .es-card-footer { background:#f5f8fa; height:40px; line-height:40px; padding:0px 20px; border-top:1px solid #e0e5ee; }
</style>
