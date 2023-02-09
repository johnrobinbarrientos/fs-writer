<template>
    <div style="width:calc(100% - 40px); max-width:700px; background:#fff; margin:0px auto; margin-top:120px;">
        <div style="background-color: rgba(0, 0, 0, 0.03); padding:5px 20px; border-bottom: 1px solid rgba(0, 0, 0, 0.125); font-weight:900;">
          Save to Scene
        </div>
        <div style="padding:20px 20px;">
          <div>
            <p style="margin-bottom:5px; font-weight:600;">{{ $t('SELECT_A_SCENE') }}</p>
            <multiselect class="custom-multiselect" :preselectFirst="true" :allow-empty="false" v-model="selected_scene" :options="options_scenes" :placeholder="$t('SELECT') + ' ' + $t('SCENE')" label="title" track-by="uuid" :deselectLabel="$t('SELECTED')" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
          </div>
            <div style="margin-top:20px; margin-bottom:20px; ">
            <p style="margin-bottom:5px; font-weight:600;">{{ $t('CONTENT') }}</p>
            <div style="max-height:200px; overflow-y:auto; border: 1px solid rgba(0, 0, 0, 0.125); padding:5px;" v-html="properties.scene_content"></div>
            </div>
            <div style="text-align:right;">
              <button class="es-button-white" @click="saveScene()">{{$t('SAVE')}}</button>
              <button class="es-button-white" @click="CloseMe()">{{$t('CLOSE')}}</button>
            </div>
        </div>
    </div>
</template>

<script>
const moment = require('moment')

export default {
  name: 'save-to-scene',
  props: ['properties'],
  data: function () {
    return {
      selected_scene: null,
      options_scenes: [{title: this.$t('NEW_SCENE'), uuid: '-1'}],
      data: {
        id: null,
        uuid: null,
        book_id: this.properties.book_id,
        chapter_id: this.properties.chapter_id,
        title: 'NEW SCENE',
        scene_version: {
          content: this.properties.scene_content
        },
        typeofscene: 'Action',
        importance: 'Plot',
        tags: '',
        status: 'Outline',
        notes: '',
        weather_type: 'Rainy',
        date_starts: moment(Date.now()).format('YYYY-MM-DD').toString(),
        date_ends: moment(Date.now()).format('YYYY-MM-DD').toString(),
        character_id_vp: '-1',
        viewpoint_description: ''
      },
      version: {
        id: null,
        uuid: null,
        content: ''
      }
    }
  },
  methods: {
    CloseMe: function () {
      var scope = this
      scope.$parent.closeSaveToScene()
    },
    loadScene () {
      var scope = this

      let scenes = scope.$store.getters.getScenesByChapter(scope.properties.chapter_id)

      scope.options_scenes = [{title: scope.$t('NEW_SCENE'), uuid: '-1'}]
      scenes.forEach(function (row, index) {
        scope.options_scenes.push(row)
      })
    },
    saveScene () {
      var scope = this
      if (scope.selected_scene.uuid === '-1') {
        scope.data.id = null
        scope.data.uuid = null

        scope.axios
          .post('http://localhost:3000/scenes', scope.data)
          .then(response => {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('SCENE') + ' ' + this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.$store.dispatch('loadScenesByChapter', response.data.chapter_id)
              scope.$parent.closeSaveToScene()
            })
          })
      } else {
        scope.axios
          .get('http://localhost:3000/scene-versions/' + scope.selected_scene.uuid + '/latest')
          .then(response => {
            scope.version.id = response.data.id
            scope.version.uuid = response.data.uuid
            scope.version.content = response.data.content + '<br>' + scope.properties.scene_content

            scope.axios
              .post('http://localhost:3000/scene-versions/savetoscene', {uuid: scope.version.uuid, content: scope.version.content})
              .then(response => {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('SCENE') + ' ' + this.$t('SUCCESSFULY_SAVED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$parent.closeSaveToScene()
                })
              })
          })
      }
    }
  },
  mounted () {
    var scope = this
    scope.loadScene()
  }
}
</script>

<style scoped>
    .page-content {  position: fixed; top: 0px; left: 0px;  background: rgba(31,46,58,0.8); width: 100%; height: 100vh; z-index: 999; }
    .page-content .es-card { margin-top:100px; }
    .es-card { width:calc(100% - 40px); max-width:750px; margin:0px auto; margin-top:10px; color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    /* .page-content { position: fixed; top: 0; left: 0; bottom: 0; right: 0; overflow: auto; background-color: rgba(44, 46, 47, 0.9); z-index: 2}
    .page-content .es-card { margin-top: 100px; margin-bottom: 70px; } */
</style>
