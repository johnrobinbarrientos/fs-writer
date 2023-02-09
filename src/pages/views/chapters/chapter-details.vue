<template>
<div>
    <div v-if="page.is_ready" class="es-page-main page-chapter-details">
        <div class="es-page-head-2 mb-0">
            <div class="row-head">
              <div>
                <h4 class="main-title"><i class="fas fa-bookmark mr-1"></i> {{ chapter.title }}</h4>
              </div>
              <div class="book-panel-right">
                <button class="es-button btn-sm white" @click="CHANGE_COMPONENT({tabKey: 'chapter-form', tabComponent: 'chapter-form', tabData: { book: book, chapter: null }, tabTitle: $t('NEW_CHAPTER'), newTab: true})">{{$t('NEW_CHAPTER').toUpperCase()}}</button>
                <button class="es-button btn-sm white" @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + chapter.uuid, tabComponent: 'scene-form',  tabData: { book: book, chapter: chapter, scene: null }, tabTitle: 'New Scene', newTab: true})">{{$t('ADD_NEW_SCENE').toUpperCase()}}</button>
                <!-- <button ref="button" class="es-button btn-sm white" :disabled="busy" @click="newVersion">{{$t('SAVE_AS_NEW_VERSION').toUpperCase()}}</button> -->
                <button class="es-button icon-only warning" @click="toggleFeedbacks()"><i class="las la-comments"></i><!--{{$t('FEEDBACKS').toUpperCase()}}--></button>
                <button class="es-button icon-only" @click="CHANGE_COMPONENT({ tabKey: 'chapter-form-' + chapter.uuid, tabComponent: 'chapter-form',  tabData: { book: book, chapter:  chapter }, tabTitle: $t('EDIT')+ ' - ' +  chapter.title, newTab: true })"><i class="las la-highlighter"></i><!--{{$t('EDIT').toUpperCase()}}--></button>
                <button class="es-button icon-only danger" @click="deleteChapter(chapter)"><i class="las la-trash-alt"></i><!-- {{$t('DELETE').toUpperCase()}} --></button>
              </div>
            </div>
        </div>
        <div class="es-details-tab-wrapper">
          <div class="es-details-tab">
            <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'scenes' }" @click="changeTab('scenes')" class="es-details-tab-item">{{$t('SCENES').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'versions' }" @click="changeTab('versions')" class="es-details-tab-item">{{$t('VERSIONS').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'compare-versions' }" @click="changeTab('compare-versions')" class="es-details-tab-item">{{$t('COMPARE_VERSIONS').toUpperCase()}}</div>
          </div>
          <div>
            <ul class="es-breadcrumb mb-0">
              <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">{{ book.title }}</a></li>
              <li><a @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})" href="javascript:void(0);">{{ $t('CHAPTERS') }}</a></li>
              <li><a href="javascript:void(0);" style="padding-right: 20px;">{{ chapter.title }}</a></li>
            </ul>
          </div>
        </div>
        <div style="position:relative; padding-bottom:40px; overflow: hidden;">
          <Feedback v-bind:class="{ 'show_feedbacks' : show_feedbacks }" :properties="{ book: book, parent: chapter, parent_name: 'chapter', toggleType: true }"></Feedback>
          <div style="border-top:1px solid #ccc; z-index:2000; background:#fff; height:50px; padding:0px 20px; line-height:50px; width:100%; position:absolute; bottom:0px; left:0px;">
            <button v-if="prevChapter !== null" @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + prevChapter.uuid, tabComponent: 'chapter-details',  tabData: { book: book, chapter: prevChapter }, tabTitle: $t('VIEW')+ ' - ' + prevChapter.title})" style="float:left; background:transparent; border:none;">
              <i class="las la-angle-double-left"></i> {{ $t('PREV').toUpperCase() }}
            </button>
            <button v-if="nextChapter !== null" @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + nextChapter.uuid, tabComponent: 'chapter-details',  tabData: { book: book, chapter: nextChapter }, tabTitle: $t('VIEW')+ ' - ' + nextChapter.title})" style="float:right; background:transparent; border:none;">
              {{ $t('NEXT').toUpperCase() }} <i class="las la-angle-double-right"></i>
            </button>
          </div>
          <div v-if="tab.active === 'content'"  class="es-chapter-details-tab-content" id="custom-scrollbar">
                <div class="export-content">
                <b-button class="es-button btn-sm white" :disabled="exportOnProgress"  @click="exportContent()">
                  <div v-if="exportOnProgress === false"><span>{{$t('EXPORT_CONTENT')}}</span></div>
                  <div v-else>
                    <b-spinner small type="grow"></b-spinner>
                    <span>{{exportLoading}}</span>
                  </div>
                </b-button>
                </div>
              <div v-html="getChapterContent" class="description" v-bind:id="commentbase_id"></div>
              <CommentBasePanel v-if="commentbase_dom" :dom="commentbase_dom" :params="commentbase_params"></CommentBasePanel>
          </div>
          <div v-if="tab.active === 'scenes'"  class="es-chapter-details-tab-content scene-listing" id="custom-scrollbar">
              <chapter-scenes :properties="{ book: book, chapter: chapter }"></chapter-scenes>
          </div>
          <div v-if="tab.active === 'versions'"  class="es-chapter-details-tab-content" id="custom-scrollbar">
              <chapter-versions :properties="{ chapter: chapter }"></chapter-versions>
          </div>
          <div v-if="tab.active === 'compare-versions'"  class="es-chapter-details-tab-content" id="custom-scrollbar">
              <chapter-compare-versions :properties="{ chapter: chapter }"></chapter-compare-versions>
          </div>
        </div>
    </div>

    <b-overlay :show="busy" no-wrap fixed @shown="$refs.dialog.focus()" @hidden="$refs.button.focus()">
        <template v-slot:overlay>
            <div
                id="overlay-background"
                ref="dialog"
                tabindex="-1"
                role="dialog"
                aria-modal="false"
                aria-labelledby="form-confirm-label"
                class="p-3"
            >
                <b-container class="bv-example-row">
                    <b-card-group deck>
                        <b-card :header="$t('SAVE_AS_NEW_VERSION')" class="text-center">
                            <b-row style="margin-bottom: 1rem;" class="text-left">
                                <b-col>
                                    <label>{{$t('DESCRIPTION')}}: </label>
                                    <tiny-editor :initValue="chapter_version.change_description"
                                                 v-on:getEditorContent="setDescription"
                                                 class="form-control"
                                    />
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <div class="text-right">
                                        <b-button variant="outline-dark" class="mr-2" @click="busy = !busy">{{$t('CANCEL')}}</b-button><b-button variant="dark" @click="saveNewVersion">{{$t('SAVE')}}</b-button>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-card-group>
                </b-container>
            </div>
        </template>
    </b-overlay>
</div>
</template>

<script>
import TinyMCE from '../../../components/TinyMCE'
import Feedback from '../../../components/Feedback'
import ChapterScenes from '@/pages/views/chapters/chapter-scenes'
import ChapterVersions from '@/pages/views/chapters/chapter-versions'
import ChapterCompareVersions from '@/pages/views/chapters/chapter-compare-versions'
import moment from 'moment'
import Vue from 'vue'

import CommentBasePanel from '../../../components/CommentBasePanel'

const {ipcRenderer} = window.require('electron')

export default {
  name: 'chapter-details',
  props: ['properties'],
  data: function () {
    var scope = this
    return {
      chapter_version: {
        chapter_id: null,
        content: '',
        change_description: ''
      },
      page: {
        title: '',
        is_ready: false,
        data: null
      },
      tab: {
        active: 'content'
      },
      busy: false,
      tempVersionDesc: '',
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
      },
      exportOnProgress: false,
      exportLoading: this.$t('Loading'),
      show_feedbacks: false
    }
  },
  components: {
    TinyMCE,
    Feedback,
    ChapterScenes,
    ChapterVersions,
    ChapterCompareVersions,
    CommentBasePanel
  },
  computed: {
    getChapterContent: function () {
      var scope = this
      var chapterID = scope.page.data.chapter.uuid
      return this.$store.getters.getChapterContent(chapterID)
    },
    comments: function () {
      var scope = this
      var chapterID = scope.page.data.chapter.uuid
      return this.$store.getters.getChapterComments(chapterID)
    },
    book: function () {
      return this.properties.book
    },
    chapter: function () {
      return this.properties.chapter
    },
    test: function () {
      var stillUtc = moment.utc('2020-04-09 13:51:40').toDate()
      var date = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss')
      return moment('2020-04-09 21:51:40').utc().format('YYYY-MM-DD HH:mm:ss').toString() + ' ---> ' + date
    },
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    },
    prevChapter: function () {
      let chapter = this.chapter
      return this.$store.getters.getPrevChapter(chapter)
    },
    nextChapter: function () {
      let chapter = this.chapter
      return this.$store.getters.getNextChapter(chapter)
    }
  },
  methods: {
    // Required for geting value from TinyMCE content
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
    newVersion: function () {
      var scope = this
      this.busy = true

      scope.chapter_version.change_description = ''
      if (scope.chapter_version.id) {
        delete (scope.chapter_version.id)
        delete (scope.chapter_version.uuid)
      }
    },
    saveNewVersion () {
      var scope = this

      scope.chapter_version.change_description = scope.tempVersionDesc
      scope.chapter_version.content = scope.getChapterContent
      scope.chapter_version.chapter_id = scope.page.data.chapter.uuid

      scope.axios
        .post('http://localhost:3000/chapter-versions', scope.chapter_version)
        .then(async function (response) {
          if (response.data) {
            try {
              await scope.$store.dispatch('loadVersionsByChapter', scope.page.data.chapter.uuid)
            } catch (ex) {
              console.log('Failed to load data')
            } finally {
              scope.tab.active = 'content'

              scope.busy = false
              window.swal.fire({
                position: 'center',
                icon: 'success',
                title: scope.$t('CHAPTER') + ' ' + scope.$t('VERSION') + ' ' + scope.$t('SUCCESSFULY_SAVED'),
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                scope.tab.active = 'versions'
              })
            }
          }
        })
    },
    saveComments () {
      var scope = this
      var chapterID = scope.page.data.chapter.uuid

      scope.chapter_version.chapter_id = chapterID
      scope.chapter_version.uuid = this.$store.getters.getChapterVersionUUID(chapterID)
      scope.chapter_version.change_description = scope.tempVersionDesc
      scope.chapter_version.content = this.commentbase_vm.dom.innerHTML
      scope.chapter_version.comments = this.commentbase_vm.getCommentsJSON()
      scope.chapter_version.new_comment_json = this.commentbase_vm.getLastComment()
      scope.chapter_version.new_comment_json.chapter_id = chapterID
      scope.chapter_version.new_comment_json.chapter_title = scope.page.data.chapter.title
      scope.chapter_version.new_comment_json = JSON.stringify(scope.chapter_version.new_comment_json)
      scope.axios
        .post('http://localhost:3000/chapter-versions/comment', scope.chapter_version)
        .then(response => {
          if (response.data) {
            // TODO: Insert vuex code that will refresh the chapter version
            scope.tab.active = 'content'
            // scope.$store.dispatch('loadVersionsByChapter', scope.page.data.chapter.uuid)
            this.busy = false
          }
        })
    },
    deleteChapter: function (chapter) {
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
            .delete('http://localhost:3000/chapters/' + chapter.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeChapterFromList', chapter)
                  scope.CHANGE_COMPONENT({tabKey: 'chapter-listing-' + chapter.book_id, tabComponent: 'chapter-listing', tabData: { uuid: chapter.book_id }, tabTitle: this.$t('CHAPTERS') + ' - ' + this.$t('LIST'), tabIndex: scope.$store.getters.getActiveTab})
                })
              }
            })
        }
      })
    },
    exportContent: function () {
      var scope = this
      scope.exportOnProgress = true
      ipcRenderer.send('EXPORT-CONTENT-DOCX', {content: scope.getChapterContent, defaultfilename: scope.page.title + ' - ' + this.$t('CONTENT')})
    },
    toggleFeedbacks: function () {
      let scope = this
      scope.show_feedbacks = !scope.show_feedbacks
    }
  },
  beforeUpdate () {
    // var scope = this
  },
  async mounted () {
    var scope = this

    scope.page.data = scope.properties
    scope.page.title = scope.properties.chapter.title
    // console.log('PROPERTIES')
    // console.log(scope.properties)

    try {
      await scope.$store.dispatch('loadScenesByChapter', scope.properties.chapter.uuid)
      await scope.$store.dispatch('loadVersionsByChapter', scope.properties.chapter.uuid)
    } catch (ex) {
      console.log('Failed to load data')
    } finally {
      Vue.nextTick(function () {
        scope.page.is_ready = true
        scope.changeTab('content')
      })
    }

    ipcRenderer.on('EXPORT_DOCX_ENABLE_BUTTON', function () {
      scope.exportOnProgress = false
    })
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .export-content{ text-align: right; margin-bottom: 20px;}
    .btn-edit { float:right; background:#fff; border:1px solid #506d84; }
    /*.chapter-scenes-list .item { font-family: 'Crimson Roman Bold'; border:1px solid #354350; border-top:none; padding:0px 20px; height:35px; line-height:35px}*/
    /*.chapter-scenes-list .item:first-child { border-top:1px solid #354350;  }*/

    .image-container { text-align: center; }
    .image-container img { width:100%; max-width:250px; }
</style>
