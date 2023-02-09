<template>
<div>
    <div v-if="page.is_ready" class="page-scene-details">
        <div class="es-page-head-2 mb-0">
            <div class="row-head">
                <div>
                    <div>
                        <h4><strong>{{ properties.scene.title }}</strong></h4>
                    </div>
                </div>
                <div class="book-panel-right">
                  <button class="es-button btn-sm white" @click="toggleFeedbacks()">{{$t('FEEDBACKS').toUpperCase()}}</button>
                  <button class="es-button btn-sm white" @click="toggleNotes()">{{$t('MY NOTES').toUpperCase()}}</button>
                </div>
            </div>
        </div>
        <!-- <div v-if="chapter !== null" class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'books-i-read-chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})">{{ $t('CHAPTERS') }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + book.uuid, tabComponent: 'books-i-read-chapter-details', tabData: { book: book, chapter: chapter }, tabTitle: 'VIEW - ' + chapter.title})">{{ chapter.title || 'Untitled' }}</button>
            /
            <button class="current">
                <span>{{ scene.title || 'Untitled' }}</span>
            </button>
        </div> -->

        <!-- <div v-else class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'scene-listing-' + book.uuid, tabComponent: 'books-i-read-scene-listing', tabData: book, tabTitle: $t('OTHER_SCENES') + ' - ' + book.title})">{{ $t('OTHER_SCENES') }}</button>
            /
            <button class="current">
                <span>{{ scene.title || 'Untitled' }}</span>
            </button>
        </div> -->
        <div class="es-details-tab-wrapper">
            <div class="es-details-tab">
                <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
            </div>
            <div>
            <ul v-if="chapter !== null" class="es-breadcrumb">
                <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">{{ book.title }}</a></li>
                <li><a @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'books-i-read-chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})" href="javascript:void(0);">{{ $t('CHAPTERS') }}</a></li>
                <li><a @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + book.uuid, tabComponent: 'books-i-read-chapter-details', tabData: { book: book, chapter: chapter }, tabTitle: 'VIEW - ' + chapter.title})" href="javascript:void(0);">{{ chapter.title || 'Untitled' }}</a></li>
                <li><a href="javascript:void(0);" style="padding-right: 20px;">
                    <span>{{ scene.title || 'Untitled' }}</span>
                </a></li>
            </ul>

            <ul v-else class="es-page-breadcrumbs">
                <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">{{ book.title }}</a></li>
                <li><a @click="CHANGE_COMPONENT({tabKey: 'scene-listing-' + book.uuid, tabComponent: 'books-i-read-scene-listing', tabData: book, tabTitle: $t('OTHER_SCENES') + ' - ' + book.title})" href="javascript:void(0);">{{ $t('OTHER_SCENES') }}</a></li>
                <li><a href="javascript:void(0);" style="padding-right: 20px;">
                    <span>{{ scene.title || 'Untitled' }}</span>
                </a></li>
            </ul>

            </div>
        </div>

        <div v-if="tab.active === 'content'"  class="es-scene-details-tab-content" style="position:relative;">
            <Feedback v-if="show_feedbacks" :properties="{ book: book, parent: scene, parent_name: 'scene' }"></Feedback>
            <Note v-if="show_notes" :properties="{ book: book, parent: scene, parent_name: 'scene' }"></Note>
            <div v-html="getSceneContent" class="description" v-bind:id="commentbase_id"></div>
            <CommentBasePanel v-if="commentbase_dom" :dom="commentbase_dom" :params="commentbase_params"></CommentBasePanel>
        </div>
    </div>
</div>
</template>

<script>
import Feedback from '../../../components/Feedback'
import Note from '../../../components/Note'
import CommentBasePanel from '../../../components/CommentBasePanel'

import Vue from 'vue'

export default {
  name: 'books-i-read-scene-details',
  props: ['properties'],
  data: function () {
    var scope = this
    return {
      scene_version: {
        book_scene_id: null,
        change_description: null,
        content: null
      },
      page: {
        is_ready: false,
        title: '',
        data: null
      },
      tab: {
        active: 'content'
      },
      busy: false,
      tempVersionDesc: '',
      show_feedbacks: false,
      show_notes: false,
      commentbase_id: ('cm-' + Math.random()).replace('.', ''),
      commentbase_dom: null,
      commentbase_params: {
        onMounted: (vm) => {
          scope.commentbase_vm = vm
          vm.setAuthor(this.getAuthor)
          vm.setCommentsJSON(this.comments)
        },
        onAddComment: function () {
          scope.saveComments()
        }
      }
    }
  },
  components: {
    Feedback,
    Note,
    CommentBasePanel
  },
  computed: {
    book: function () {
      return this.properties.book
    },
    scene: function () {
      return this.properties.scene
    },
    chapter: function () {
      return this.properties.chapter
    },
    getSceneContent: function () {
      var scope = this
      var sceneID = scope.page.data.scene.uuid
      return this.$store.getters.getSceneContent(sceneID)
    },
    comments: function () {
      // return '{}'
      var scope = this
      var sceneID = scope.page.data.scene.uuid
      return this.$store.getters.getSceneComments(sceneID)
    },
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    }
  },
  methods: {
    setDescription (value) {
      var scope = this
      scope.tempVersionDesc = value
    },
    changeTab: function (tab) {
      var scope = this
      scope.tab.active = tab
      Vue.nextTick(function () {
        if (tab === 'content') {
          scope.commentbase_dom = document.getElementById(scope.commentbase_id)
        } else {
          scope.commentbase_dom = null
        }
      })
    },
    // todo
    saveComments () {
      var scope = this

      var sceneID = scope.page.data.scene.uuid
      scope.scene_version.uuid = this.$store.getters.getSceneVersionUUID(sceneID)
      scope.scene_version.change_description = scope.tempVersionDesc
      scope.scene_version.content = this.commentbase_vm.dom.innerHTML
      scope.scene_version.comments = this.commentbase_vm.getCommentsJSON()
      scope.scene_version.book_scene_id = sceneID
      scope.scene_version.new_comment_json = this.commentbase_vm.getLastComment()
      scope.scene_version.new_comment_json.scene_id = sceneID
      scope.scene_version.new_comment_json.scene_title = scope.page.data.scene.title
      scope.scene_version.new_comment_json = JSON.stringify(scope.scene_version.new_comment_json)

      scope.axios
        .post('http://localhost:3000/scene-versions/comment', scope.scene_version)
        .then(response => {
          if (response.data) {
            // TODO: Insert vuex code that will refresh the chapter version
            scope.tab.active = 'content'
            this.busy = false
            // scope.$store.dispatch('updateSceneVersionList', { uuid: response.data.book_scene_id })
          }
        })
    },
    initializeData: function () {
      var scope = this
      scope.page.data = scope.properties

      // load book
      scope.$store.dispatch('loadCharactersByBook', scope.page.data.scene.book_id)
      scope.$store.dispatch('loadItemsByBook', scope.page.data.scene.book_id)
      scope.$store.dispatch('loadLocationsByBook', scope.page.data.scene.book_id)

      // load scene children
      scope.$store.dispatch('loadCharactersByScene', scope.page.data.scene)
      scope.$store.dispatch('loadItemsByScene', scope.page.data.scene)
      scope.$store.dispatch('loadLocationsByScene', scope.page.data.scene)
      scope.$store.dispatch('loadVersionsByScene', scope.page.data.scene)

      setTimeout(function () {
        scope.page.is_ready = true
        scope.changeTab('content')
      }, 500)
    },
    toggleFeedbacks: function () {
      let scope = this
      scope.show_feedbacks = !scope.show_feedbacks
    },
    toggleNotes: function () {
      let scope = this
      scope.show_notes = !scope.show_notes
    }
  },
  mounted () {
    var scope = this
    scope.initializeData()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .export-content{ text-align: right; margin-bottom: 20px;}
    .es-scene-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
    .es-scene-details-tab .es-scene-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
    .es-scene-details-tab .es-scene-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
    .es-scene-details-tab .es-scene-details-tab-item.active:after { background:#922c39;  }

    .es-scene-details-tab-content { position:relative; padding:30px; background:#fff; height:calc(100vh - 317px); overflow-y:auto; display:block; }
    .es-scene-details-tab-content.no-padding { padding:0px; }
    .es-scene-details-tab-content.active { display:block; }
</style>
