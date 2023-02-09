<template>
<div v-if="page.is_ready" class="page-scene-compare-versions ">
    <div v-if="comparing" class="scene-version-difference">
        <div class="scene-version-difference-content" v-html="diff_content"></div>
        <div class="settings">
            <span class="heading">{{$t('COMPARISON_SETTINGS').toUpperCase()}}</span>
            <br/>
            <select @change="changeSceneVersion1(),showDifference()" v-model="v1.uuid">
                <option value="null">{{$t('SELECT_A_VERSION').toUpperCase()}}</option>
                <option :value="version.uuid"  v-for="(version, index) in versions" v-bind:key="index">{{$t('VERSION')}} {{ index + 1 }}</option>
            </select>
            <select @change="changeSceneVersion2(),showDifference()" v-model="v2.uuid">
                <option value="null">{{$t('SELECT_A_VERSION').toUpperCase()}}</option>
                <option :value="version.uuid"  v-for="(version, index) in versions" v-bind:key="index">{{$t('VERSION')}} {{ index + 1 }}</option>
            </select>
            <div style="margin-top:15px;">
                <button style="display:none;" @click="showDifference()" class="btn-red btn-block">{{$t('COMPARE_VERSIONS').toUpperCase()}}</button>
                <button @click="stopComparing()" class="btn-white btn-block">{{$t('BACK').toUpperCase()}}</button>
            </div>
        </div>
    </div>
    <div v-if="!comparing" class="scene-compare-versions-options" >
        <div class="versions">
            <select @change="changeSceneVersion1()" v-model="v1.uuid">
                <option value="null">{{$t('SELECT_A_VERSION').toUpperCase()}}</option>
                <option :value="version.uuid"  v-for="(version, index) in versions" v-bind:key="index">{{$t('VERSION')}} {{ index + 1 }}</option>
            </select>
            <div class="content">
                <div v-html="v1.content" class="description" ></div>
            </div>
        </div>
        <div class="versions">
            <select @change="changeSceneVersion2()" v-model="v2.uuid">
                <option value="null">{{$t('SELECT_A_VERSION').toUpperCase()}}</option>
                <option :value="version.uuid"  v-for="(version, index) in versions" v-bind:key="index">{{$t('VERSION')}} {{ index + 1 }}</option>
            </select>
            <div class="content">
                <div v-html="v2.content" class="description" ></div>
            </div>
        </div>
    </div>
    <div v-if="!comparing" style="text-align:center; margin-top:5px;">
        <button @click="showDifference()" class="btn-dark">{{$t('COMPARE_VERSIONS').toUpperCase()}}</button>
    </div>
</div>
</template>
<script>
import TinyMCE from '../../../components/TinyMCE'
const DiffMatchPatch = require('diff-match-patch')

export default {
  name: 'scene-compare-versions',
  props: ['properties'],
  data: function () {
    return {
      page: {
        title: '',
        is_ready: false,
        data: null
      },
      scene: null,
      versions: [],
      v1: {
        id: null,
        uuid: null,
        scene_id: null,
        content: '',
        change_description: ''
      },
      v2: {
        id: null,
        uuid: null,
        scene_id: null,
        content: '',
        change_description: ''
      },
      diff_content: '',
      comparing: false
    }
  },
  components: {
    TinyMCE
  },
  computed: {
  },
  methods: {
    changeSceneVersion1: function () {
      var scope = this
      let versions = scope.versions
      for (let i = 0; i < versions.length; i++) {
        let version = versions[i]
        if (scope.v1.uuid === version.uuid) {
          scope.v1.id = version.id
          scope.v1.uuid = version.uuid
          scope.v1.change_description = version.change_description
          scope.v1.content = version.content
          break
        }
      }
    },
    changeSceneVersion2: function () {
      var scope = this
      let versions = scope.versions
      for (let i = 0; i < versions.length; i++) {
        let version = versions[i]
        if (scope.v2.uuid === version.uuid) {
          scope.v2.id = version.id
          scope.v2.uuid = version.uuid
          scope.v2.change_description = version.change_description
          scope.v2.content = version.content
          break
        }
      }
    },
    getLatestVersion: function () {
      var scope = this
      var count = scope.versions.length
      if (count < 1) {
        scope.v1.id = null
        scope.v1.uuid = null
        scope.v1.change_description = null
        scope.v1.content = null

        scope.v2.id = null
        scope.v2.uuid = null
        scope.v2.change_description = null
        scope.v2.content = null
        return
      }

      let version = scope.versions[(count - 1)]
      scope.v1.id = version.id
      scope.v1.uuid = version.uuid
      scope.v1.change_description = version.change_description
      scope.v1.content = version.content

      if (count >= 2) {
        let version = scope.versions[(count - 2)]
        scope.v2.id = version.id
        scope.v2.uuid = version.uuid
        scope.v2.change_description = version.change_description
        scope.v2.content = version.content
      }
    },
    changesceneVersion: function () {
      var scope = this
      let versions = scope.versions
      for (let i = 0; i < versions.length; i++) {
        let version = versions[i]
        if (scope.active_version.uuid === version.uuid) {
          scope.active_version.id = version.id
          scope.active_version.uuid = version.uuid
          scope.active_version.change_description = version.change_description
          scope.active_version.content = version.content
          scope.editing_version = false
          break
        }
      }
    },
    showDifference: function () {
      var scope = this
      scope.diff_content = ''
      scope.comparing = true
      // scope.btn_shw_diff_toggle = !scope.btn_shw_diff_toggle

      const dmp = new DiffMatchPatch()
      let v1Content = ''
      if (scope.v1.content) {
        v1Content = scope.v1.content
      }

      let v2Content = ''
      if (scope.v2.content) {
        v2Content = scope.v2.content
      }

      let diff = dmp.diff_main(v1Content, v2Content)
      dmp.diff_cleanupSemantic(diff)

      let content = ''
      diff.forEach(function (item) {
        if (item[0] === DiffMatchPatch.DIFF_DELETE) {
          content += '<del style="color:red">' + item[1] + '</del>'
        } else if (item[0] === DiffMatchPatch.DIFF_INSERT) {
          content += '<ins style="color: green">' + item[1] + '</ins>'
        } else {
          content += item[1]
        }
      })
      scope.diff_content = content
    },
    stopComparing: function () {
      var scope = this
      scope.comparing = false
    }
  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this
    scope.scene = scope.properties.scene
    scope.versions = scope.$store.getters.getScenesByChapter(scope.scene.uuid)

    setTimeout(function () {
      scope.getLatestVersion()
      scope.page.is_ready = true
    }, 500)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .switch-version { text-align:right; }

    .scene-compare-versions-options { display:flex; }
    .scene-compare-versions-options .versions { width:50%; padding:10px; }
    .scene-compare-versions-options .versions select { padding:5px 7px; width:100%; }
    .scene-compare-versions-options .versions .content { margin-top:10px; padding:20px; border:1px solid #ccc; height:calc(100vh - 415px); overflow-y:scroll; }

    .scene-version-difference { display:flex; justify-content: space-between; }
    .scene-version-difference .scene-version-difference-content { width:calc(100% - 320px); height:calc(100vh - 310px); overflow-y:auto; }
    .scene-version-difference .settings { width:280px; height:200px; background:#324553; border:1px solid #ccc; padding:10px 15px; }
    .scene-version-difference .settings .heading { color:#fff; font-size:14px; }
    .scene-version-difference .settings select { margin-top:10px; padding:5px 7px; width:100%; }

    .btn-dark { margin-top:5px; background:#324553; color:#fff; border:none; border-radius:3px; height:35px; line-height:35px; padding:0px 10px; }
    .btn-red { margin-top:5px; background:#892d3a; color:#fff; border:none; border-radius:3px; height:35px; line-height:35px; padding:0px 10px; }
    .btn-white { margin-top:5px; background:#fff; color:#000; border:none; border-radius:3px; height:35px; line-height:35px; padding:0px 10px; }
    .btn-block { width:100%; }
    .btn-dark:hover { opacity:0.9; }
</style>
