<template>
<div v-if="page.is_ready" class="page-chapter-form">
    <div class="es-page-head-2 mb-0">
        <div class="row-head">
            <div>
                <div v-if="data.id != null">
                    <h4>{{$t('EDIT')}}: <strong>{{ data.title }}</strong></h4>
                    <small>{{$t('DATE_MODIFIED')}}: {{ data.updated_at }}</small>
                </div>
                <div v-else>
                    <h4>{{$t('CREATE_NEW_CHAPTER')}}</h4>
                </div>
            </div>
            <div class="book-panel-right">
                <button ref="button" v-show="data.id != null" class="es-button btn-sm white" :disabled="version_modal_is_open" @click="newVersion">{{$t('SAVE_AS_NEW_VERSION').toUpperCase()}}</button>
                <button v-if="data.id != null" class="es-button btn-sm white" @click="toggleFeedbacks()">{{$t('FEEDBACKS').toUpperCase()}}</button>
                <button v-if="data.id != null" class="es-button btn-sm white" @click="saveChapter()">{{$t('SAVE_CHANGES')}}</button>
                <button v-else class="es-button btn-sm white" @click="saveChapter()">{{$t('SAVE')}}</button>
            </div>
        </div>
    </div>
    <!-- <div class="es-page-breadcrumbs">
        <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
        /
        <button @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})">{{ $t('CHAPTERS') }}</button>
        /
        <button class="current">
            <span v-if="chapter !== null">{{ chapter.title }}</span>
            <span v-else>{{$t('NEW_CHAPTER')}}</span>
        </button>
    </div> -->

    <div class="es-page-content" style="position:relative;">
        <ul class="es-breadcrumb">
            <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);"><span>{{ book.title }}</span></a></li>
            <li><a @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})" href="javascript:void(0);"><span>{{ $t('CHAPTERS') }}</span></a></li>
            <li><a href="javascript:void(0);" style="padding-right: 20px;">
                <span v-if="chapter !== null">{{ chapter.title }}</span>
                <span v-else>{{$t('NEW_CHAPTER')}}</span>
            </a></li>
        </ul>

        <div v-if="show_feedbacks" style="position:fixed; width:480px; height:calc(100vh - 247px); bottom:0px; right:18px; z-index:4000;">
          <div style="position:relative; height:100%;">
           <Feedback :properties="{ book: book, parent: chapter, parent_name: 'chapter' }"></Feedback>
          </div>
        </div>
        <div class="container">
            <div class="es-accordion">
                <div class="item" v-bind:class="{'active': accordion['chapter-details'] === 'active'}">
                    <div class="label" @click="toggleAccordion('chapter-details')">
                        {{$t('CHAPTER_DETAILS').toUpperCase()}}
                        <div class="icon">
                            <i v-if="accordion['chapter-details'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['chapter-details'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content ">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="input-title">{{$t('TITLE')}}: </label>
                                    <b-form-input
                                        id="input-title"
                                        v-model="data.title"
                                        :state="feedback.title.state"
                                        aria-describedby="input-live-help input-live-feedback"
                                        :placeholder="$t('CHAPTER_TITLE')"
                                        @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)"
                                        trim
                                    ></b-form-input>
                                    <!-- This will only be shown if the preceding input has an invalid state -->
                                    <b-form-invalid-feedback id="input-title-feedback">
                                        {{ feedback.title.message }}
                                    </b-form-invalid-feedback>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="input-short-description">{{$t('SHORT_DESCRIPTION')}}: </label>
                                    <b-form-input
                                        id="input-short-description"
                                        v-model="data.short_description"
                                        :state="feedback.short_description.state"
                                        aria-describedby="input-live-help input-live-feedback"
                                        :placeholder="$t('SHORT_DESCRIPTION')"
                                        @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)"
                                        trim
                                    ></b-form-input>
                                    <!-- This will only be shown if the preceding input has an invalid state -->
                                    <b-form-invalid-feedback id="input-short-description-feedback">
                                        {{ feedback.short_description.message }}
                                    </b-form-invalid-feedback>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item" v-bind:class="{'active': accordion['content'] === 'active'}">
                    <div class="label" @click="toggleAccordion('content')">
                        {{$t('CONTENT').toUpperCase()}}
                        <div class="icon">
                            <i v-if="accordion['content'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['content'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content ">
                        <button @click="getImport()">Import Docx</button>
                        <div class="row">
                            <div class="col-md-12">
                                <div v-if="chapter_history.length" class="text-right">
                                    <button class="es-button-white margin-bottom-1rem" @click="show_history = !show_history">{{$t('SHOW_HISTORY')}}</button>
                                </div>
                                <div class="form-group">
                                  <tiny-editor-chapter  :chapterData="data" :params="tiny_editor_params" :initValue="data.chapter_version.content" v-on:showOverlay="viewOverlay" v-on:getEditorContent="setContent" @getShowScene="save_to_scene=$event" class="form-control" />
                                    <CommentBasePanel v-if="commentbase_dom" :dom="commentbase_dom" :params="commentbase_params()"></CommentBasePanel>
                                </div>
                                <div v-if="show_history" class="chapter-history-items slideInRight animated">
                                    <div class="note">
                                        <i @click="show_history = !show_history" class="btn-close fas fa-times"></i>
                                        <strong>{{$t('DOUBLE_CLICK')}}</strong> {{$t('TO_VIEW_HISTORY')}}
                                    </div>
                                    <div class="chapter-history-list" >
                                        <div v-bind:key="history.uuid" v-for="history in chapter_history">
                                            <div class="history-item" @dblclick="viewHistory(history)">
                                                <div class="view-all">
                                                    <span class="float-left">{{$t('WORD_COUNT')}}: {{ WORD_COUNT(history.content) }}</span>
                                                    <em class="float-right"><span>{{ history.created_at }}</span></em>
                                                </div>
                                                <div class="clearfix"></div>
                                                <div v-html="REMOVE_HTML(history.content)" class="ellipsis-2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12" v-show="data.id != null">
                                <small>The chapter will be autosaved every ten seconds</small>
                                <small v-if="!do_auto_save" class="text-red"> | Saving ...</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <b-overlay :show="view_history" no-wrap fixed>
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
                        <b-card header="Content">
                            <template class="text-center" v-slot:header>
                                <h4 class="mb-0">{{$t('CONTENT')}}</h4>
                            </template>
                            <div class="margin-bottom-1rem">
                                <div v-html="(!(historyContent)) ? '<em>No content</em>' : historyContent" class="history-content" ></div>
                            </div>
                            <div class="text-right">
                                <button class="es-button-white" @click="useHistoryCont()">{{$t('APPLY_TO_CONTENT')}}</button>
                                <button class="es-button-white" @click="view_history = !view_history">{{$t('CLOSE')}}</button>
                            </div>
                        </b-card>
                    </b-card-group>
                </b-container>
            </div>
        </template>
    </b-overlay>
    <b-overlay :show="version_modal_is_open" no-wrap fixed @shown="$refs.dialog.focus()" @hidden="$refs.button.focus()">
      <template v-slot:overlay>
        <div
          id="overlay-save-version-background"
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
                    <tiny-editor :initValue="new_chapter_version.change_description"
                                 v-on:getEditorContent="setDescription"
                                 class="form-control"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <div class="text-right">
                      <b-button variant="outline-dark" class="mr-2" @click="version_modal_is_open = !version_modal_is_open">{{$t('CANCEL')}}</b-button><b-button variant="dark" @click="saveNewVersion">{{$t('SAVE')}}</b-button>
                    </div>
                  </b-col>
                </b-row>
              </b-card>
            </b-card-group>
          </b-container>
        </div>
      </template>
    </b-overlay>
    <div v-if="save_to_scene" class="b-overlay">
      <SavetoScene :properties="{ scene_content:scene_content,chapter_id:data.uuid,book_id:data.book_id }"></SavetoScene>
    </div>

</div>
</template>

<script>
import Feedback from '../../../components/Feedback'
import TinyMCE from '../../../components/TinyMCE'
import SavetoScene from '@/pages/views/chapters/save-to-scene'

import CommentBasePanel from '../../../components/CommentBasePanel'
const {ipcRenderer} = window.require('electron')

var component = null

export default {
  name: 'chapter-form',
  props: ['properties'],
  data: function () {
    var scope = this
    return {
      page: {
        is_ready: false,
        title: ''
      },
      data: {
        id: null,
        uuid: null,
        book_id: null,
        title: '',
        short_description: '',
        chapter_version: {
          change_description: '',
          content: ''
        }
      },
      tempChapterVersionCont: '',
      accordion: {
        'chapter-details': 'active',
        'content': 'inactive'
      },
      base_chapter_val: {},
      // Base content count is use to determine initial total number of words in content
      baseContentCount: '',
      // Author progress is use for saving author personal progress
      authorProgress: {
        author_id: '',
        relation_id: '',
        is_for: 'chapter',
        total_words: 0
      },
      // Feedback are for storing error message
      feedback: {
        title: {
          state: null,
          message: null
        },
        short_description: {
          state: null,
          message: null
        }
      },
      chapter_history: {},
      show_history: false,
      view_history: false,
      historyContent: '',
      tiny_editor_params: {
        onEditorSetup: function (ed) {
          // console.log('ed setup----->', ed, ed.contentDocument)
        },
        onEditorInit: function (ed) {
          // console.log('ed init----->', ed, ed.contentDocument, ed.getDoc())
          scope.commentbase_editor = ed
          scope.commentbase_dom = ed.getDoc()
        }
      },
      commentbase_dom: null,
      commentbase_params: function () {
        return {
          tinymce: scope.commentbase_editor,
          onMounted: (vm) => {
            scope.commentbase_vm = vm
            vm.setAuthor(this.getAuthor)
            vm.setCommentsJSON(this.comments)
          },
          onAddComment: function () {
            scope.saveChapter(true)
          }
        }
      },
      show_feedbacks: false,
      selected_chapter: null,
      options_importance: [
        {text: 'Plot', value: 'Plot'},
        {text: 'Subplot', value: 'Subplot'}
      ],
      save_to_scene: false,
      scene_content: '',
      tempVersionDesc: '',
      new_chapter_version: {
        chapter_id: null,
        change_description: null,
        content: null
      },
      auto_save_interval: null,
      version_modal_is_open: false,
      do_auto_save: true
    }
  },
  components: {
    TinyMCE,
    Feedback,
    CommentBasePanel,
    SavetoScene
  },
  computed: {
    book: function () {
      return this.properties.book
    },
    chapter: function () {
      return this.properties.chapter
    },
    comments: function () {
      var scope = this
      var chapterID = (scope.chapter) ? scope.chapter.uuid : null
      return this.$store.getters.getChapterComments(chapterID)
    },
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    }
  },
  methods: {
    // Required for geting value from TinyMCE content
    setDescription (value) {
      var scope = this
      scope.tempVersionDesc = value
    },
    closeSaveToScene: function () {
      var scope = this
      scope.save_to_scene = false
    },
    emitToParent (event) {
      this.save_to_scene = false
    },
    getImport: function () {
      var scope = this
      ipcRenderer.send('IMPORT-DOCX', 'chapter')

      ipcRenderer.on('GET-DOCX-CONTENT-CHAPTER', function (event, data) {
        scope.data.chapter_version.content = data
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
        scope.tempChapterVersionCont = data
      })
    },
    toggleAccordion: function (key) {
      var scope = this
      if (scope.accordion[key] === 'active') {
        scope.accordion[key] = 'inactive'
      } else {
        scope.accordion[key] = 'active'
      }
    },
    viewHistory (history) {
      var scope = this
      scope.view_history = true
      scope.historyContent = history.content
    },
    useHistoryCont () {
      var scope = this

      window.swal.fire({
        title: this.$t('ARE_YOU_SURE'),
        text: this.$t('YOUR_CURRENT_CONTENT_WILL_BE_OVERWRITTERN'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('APPLY'),
        cancelButtonText: this.$t('CANCEL')
      }).then((result) => {
        if (result.value) {
          scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
          scope.view_history = false
          scope.show_history = false

          let content = !(scope.historyContent) ? ' ' : scope.historyContent
          scope.data.chapter_version.content = content
          scope.tempChapterVersionCont = content
        }
      })
    },
    // Required for geting value from TinyMCE content
    setContent (value) {
      var scope = this
      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      scope.tempChapterVersionCont = value
    },
    viewOverlay (value) {
      var scope = this
      console.log('chapter form logs')
      console.log(this._uid)
      console.log(value)
      scope.scene_content = value
      this.save_to_scene = true
    },
    setShowScene (value) {
      var scope = this
      scope.save_to_scene = value
    },
    // Set all child object/array of an object to same value like null/empty string
    setAll (obj, val) {
      Object.keys(obj).forEach(function (index) {
        obj[index] = val
      })
    },
    // Clear all error message and state to null
    setFeedbackNull () {
      var scope = this
      scope.setAll(scope.feedback.title, null)
      scope.setAll(scope.feedback.short_description, null)
    },
    validate () {
      var scope = this
      var isValid = true

      scope.setFeedbackNull()

      // Check if title is empty and return error
      if (!scope.data.title) {
        scope.feedback.title.message = this.$t('TITLE_IS_REQUIRED')
        scope.feedback.title.state = false
        isValid = false
      }

      if (scope.data.short_description && scope.data.short_description.length > 30) {
        scope.feedback.short_description.message = this.$t('MAX_CHARACTERS_IS_30')
        scope.feedback.short_description.state = false
        isValid = false
      }

      return isValid
    },
    saveChapter (noAlert) {
      var scope = this
      scope.data.chapter_version.content = scope.tempChapterVersionCont
      scope.data.chapter_version.comments = (scope.commentbase_vm) ? scope.commentbase_vm.getCommentsJSON() : null

      // If upon validation it return error do not save character and display errors
      if (!scope.validate()) {
        return false
      }

      // Set autosave to busy
      scope.do_auto_save = false

      scope.axios
        .post('http://localhost:3000/chapters', scope.data)
        .then(response => {
          if (response.data) {
            scope.saveRelatedTables(response.data.uuid)
            scope.$store.dispatch('updateChapterList', response.data)
            if (!noAlert) {
              window.swal.fire({
                position: 'center',
                icon: 'success',
                title: this.$t('CHAPTER') + ' ' + this.$t('SUCCESSFULY_SAVED'),
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                scope.UNMARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
                if (scope.data.uuid === null) {
                  // scope.$store.dispatch('loadVersionsByChapter', response.data.uuid)
                  // scope.$store.dispatch('loadChapterHistory', response.data.uuid)
                  // scope.$store.dispatch('loadTodayAuthorPersonalProgressForChapter', response.data.uuid)
                  // scope.$store.dispatch('updateChapterVersionList', scope.data.chapter_version)
                  scope.CHANGE_COMPONENT({
                    tabKey: 'chapter-details-' + response.data.uuid,
                    tabComponent: 'chapter-details',
                    tabData: {book_id: response.data.book_id, chapter: response.data, book: scope.book},
                    tabTitle: this.$t('VIEW') + ' - ' + response.data.title,
                    tabIndex: scope.$store.getters.getActiveTab
                  })
                } else {
                  // scope.$store.dispatch('loadVersionsByChapter', response.data.uuid)
                  // scope.$store.dispatch('loadChapterHistory', response.data.uuid)
                  // scope.$store.dispatch('loadTodayAuthorPersonalProgressForChapter', response.data.uuid)
                  // scope.$store.dispatch('updateChapterVersionList', scope.data.chapter_version)
                  // scope.CHANGE_COMPONENT({tabKey: 'chapter-details-' + response.data.uuid, tabComponent: 'chapter-details', tabData: { book_id: response.data.book_id, chapter: response.data }, tabTitle: 'View - ' + response.data.title, tabIndex: scope.$store.getters.getActiveTab})
                  scope.$store.dispatch('changeTabTitle', {
                    key: 'chapter-form-' + response.data.uuid,
                    title: this.$t('EDIT') + ' - ' + response.data.title
                  })
                  scope.$store.dispatch('changeTabTitle', {
                    key: 'chapter-details-' + response.data.uuid,
                    title: this.$t('VIEW') + ' - ' + response.data.title
                  })
                }

                scope.loadChapter(response.data)
              })
            }
          }
        })
    },
    saveRelatedTables (chapterId) {
      let scope = this

      scope.saveAuthorPersonalProgress(chapterId)
      scope.saveChapterHistory(chapterId)
    },
    saveAuthorPersonalProgress (relationId) {
      let scope = this

      if (scope.authorProgress.uuid) {
        scope.authorProgress.total_words = scope.authorProgress.total_words + (scope.WORD_COUNT(scope.tempChapterVersionCont) - scope.baseContentCount)
      } else {
        scope.authorProgress.author_id = scope.$store.getters.getAuthorID
        scope.authorProgress.relation_id = relationId
        scope.authorProgress.total_words = scope.WORD_COUNT(scope.tempChapterVersionCont) - scope.baseContentCount
      }

      scope.axios
        .post('http://localhost:3000/author-personal-progress', scope.authorProgress)
        .then(response => {
          scope.$store.dispatch('loadAuthorPersonalProgress', {authorId: response.data.author_id})
        })
    },
    saveChapterHistory (chapterId) {
      let scope = this

      let chapterHistory = {
        chapter_id: chapterId,
        content: scope.data.chapter_version.content
      }

      if (chapterHistory.content === '') return
      scope.axios
        .post('http://localhost:3000/book-chapter-history', chapterHistory)
        .then(response => {
          scope.setBaseChapterVal(scope.data)

          scope.chapter_history.push(response.data)

          scope.do_auto_save = true

          console.log('Chapter history saved!')
        })
    },
    clearChapterHistory (chapterId) {
      let scope = this

      scope.axios
        .delete('http://localhost:3000/chapters/' + chapterId + '/history/clear')
        .then(response => {
          scope.do_auto_save = true
          console.log('b4 Chapter history cleared!')
          console.log(scope.chapter_history)
          scope.$set(scope, 'chapter_history', [])
          console.log(scope.chapter_history)
          console.log('after Chapter history cleared!')
        })
    },
    newVersion: function () {
      let scope = this
      scope.version_modal_is_open = true

      scope.clear_history = false
      scope.new_chapter_version.change_description = ''
      if (scope.new_chapter_version.id) {
        delete (scope.new_chapter_version.id)
        delete (scope.new_chapter_version.uuid)
      }
    },
    saveNewVersion () {
      let scope = this

      scope.new_chapter_version.change_description = scope.tempVersionDesc
      scope.new_chapter_version.content = scope.tempChapterVersionCont
      scope.new_chapter_version.chapter_id = scope.chapter.uuid

      scope.axios.post('http://localhost:3000/chapter-versions', scope.new_chapter_version)
        .then(function (response) {
          if (response.data) {
            let version = response.data

            scope.$store.dispatch('updateChapterVersionList', version)

            scope.data.chapter_version.id = version.id
            scope.data.chapter_version.uuid = version.uuid
            scope.data.chapter_version.content = version.content
            scope.data.chapter_version.change_description = version.change_description
            scope.version_modal_is_open = false

            if (scope.clear_history) { scope.clearChapterHistory(scope.chapter.id) }

            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: scope.$t('CHAPTER') + ' ' + scope.$t('VERSION') + ' ' + scope.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
    },
    async loadChapter (chapterProp) {
      let scope = this

      try {
        await scope.$store.dispatch('loadChapterHistory', chapterProp.uuid)
        await scope.$store.dispatch('loadVersionsByChapter', chapterProp.uuid)
        await scope.$store.dispatch('loadTodayAuthorPersonalProgressForChapter', chapterProp.uuid)
      } catch (ex) {
        console.log('Failed to load data')
      } finally {
        let chapter = chapterProp
        let version = scope.$store.getters.findLatestChapterVersionByChapter(chapterProp)
        let progress = scope.$store.getters.getTodayAuthorPersonalProgressForChapter(chapterProp)

        // chapter
        scope.data.title = chapter.title
        scope.data.short_description = chapter.short_description

        // version
        scope.data.chapter_version.id = version.id
        scope.data.chapter_version.uuid = version.uuid
        scope.data.chapter_version.content = version.content
        scope.data.chapter_version.change_description = version.change_description
        scope.tempChapterVersionCont = version.content

        scope.setBaseChapterVal(scope.data)

        scope.baseContentCount = scope.WORD_COUNT(scope.tempChapterVersionCont)

        // progress
        if (progress) {
          scope.authorProgress = progress
        }

        // chapter history
        scope.chapter_history = scope.GET_CHAPTER_HISTORY(chapter.uuid)

        scope.page.is_ready = true
      }
    },
    toggleFeedbacks: function () {
      let scope = this
      scope.show_feedbacks = !scope.show_feedbacks
    },
    setBaseChapterVal: function (chapter) {
      let scope = this
      scope.base_chapter_val = {}

      for (const key of Object.keys(chapter)) {
        if (scope.IS_OBJECT(chapter[key])) {
          scope.$set(scope.base_chapter_val, key, {})
          for (const key2 of Object.keys(chapter[key])) {
            scope.$set(scope.base_chapter_val[key], key2, chapter[key][key2])
          }
        } else {
          scope.$set(scope.base_chapter_val, key, chapter[key])
        }
      }
    },
    autoSave: function () {
      let scope = this

      // If save new version modal is open skip auto save
      // If view history modal is open skip auto save
      // If no changes  skip auto save
      if (scope.version_modal_is_open || scope.view_history || (scope.DEEP_EQUAL(scope.base_chapter_val, scope.data) && scope.tempChapterVersionCont === scope.data.chapter_version.content)) return false

      // There still a ongoing autosave return false and let that autosave to finish saving
      if (!scope.do_auto_save) return false

      scope.saveChapter(true)
    }
  },
  beforeMount () {
    var scope = this
    scope.data.book_id = scope.properties.book.uuid

    if (scope.properties.chapter) {
      scope.$set(scope.data, 'id', scope.properties.chapter.id)
      scope.$set(scope.data, 'uuid', scope.properties.chapter.uuid)

      external.id = scope.properties.chapter.id
      external.uuid = scope.properties.chapter.uuid
    }
  },
  // destroyed () {
  //   ipcRenderer.removeAllListeners('SHOW-SAVE-TO-SCENE')
  // },

  mounted () {
    var scope = this
    component = scope
    if (scope.data.uuid) {
      scope.loadChapter(scope.properties.chapter)

      scope.auto_save_interval = setInterval(scope.autoSave, 10000)
    } else {
      scope.page.is_ready = true
    }

    console.log('form-uid' + this._uid)
  }
}

ipcRenderer.on('SAVE_TO_SCENE_SHOW_SAVE_SCENE', function (event, data) {
  console.log(component.data.uuid)
  component.save_to_scene = true
})

ipcRenderer.on('SHOW-SWAL-CANT-SAVE', function (event, data) {
  window.swal.fire({
    icon: 'error',
    title: window.vm.$t('PLEASE_SAVE_CHAPTER_FIRST'),
    text: data
  })

  ipcRenderer.on('SHOW-SAVE-TO-SCENE-NO-SELECTED', function (event, data) {
    window.swal.fire({
      icon: 'error',
      title: window.vm.$t('PLEASE_SELECT_FROM_CONTENT'),
      text: data
    })
  })
})

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .es-page-content {
        height: calc(100vh - 255px);
    }
    .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
    .page-title h3 { font-size:35px; }

    .single-picture-file { display: none }
    .uploaded-file-preview { width:100%; cursor: pointer; }
    .uploaded-file-preview img { width:100%; }
    .uploaded-file-preview .default-preview { min-height: 180px; background-color: #293742; color: #fff; text-align: center; }
    .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 180px; opacity: 0.8; }

    .es-accordion .item { background:#fafafa; border-bottom:2px solid #e0e5ee; padding:10px 15px; }
    .es-accordion .item .label { position:relative; cursor:pointer; }
    .es-accordion .item .label .icon { position:absolute; top:0px; right:0px; }
    .es-accordion .item .content { display:none; margin-top:20px; margin-bottom:20px; }
    .es-accordion .item.active .content { display:block; }

    .es-button-white { font-size:12px; color:#324553; padding:3px 15px; background:#fff; border:1px solid #506d84; border-radius:3px; }

    .chapter-history-items .note { position:relative; background:#fff; padding:10px; padding-right:15px; border-bottom:1px solid #e0e5ee; font-style:italic; }
    .chapter-history-items .note .btn-close { position: absolute; cursor: pointer; top: 13px; right: 15px; }

    .chapter-history-items { position: absolute; top: 0px; right: 0px; width: 280px; height: calc(100% - 1rem); background: #f5f8fa; border: 1px solid #e0e5ee; z-index: 10; }
    .chapter-history-items .chapter-history-list {overflow-y: auto; height: calc(100% - 43px); }
    .chapter-history-items .history-item { cursor: pointer; background: #fff; border-bottom: 1px solid #e0e5ee; padding: 10px; }
    .chapter-history-items .history-item .view-all { font-size: 12px; cursor: pointer; }

    .history-content {
      user-select: text!important; /* standard syntax */
      -webkit-user-select: text!important;; /* webkit (safari, chrome) browsers */
      -moz-user-select: text!important;; /* mozilla browsers */
      -khtml-user-select: text!important;; /* webkit (konqueror) browsers */
      -ms-user-select: text!important;; /* IE10+ */
    }

   .history-content { max-height: 400px; overflow-y: auto }
</style>
<style scoped>
  .card-header { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: start; -ms-flex-align: start; align-items: flex-start; -webkit-box-pack: justify; -ms-flex-pack: justify; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #e9ecef; border-top-left-radius: .3rem; border-top-right-radius: .3rem; }
  .card-header .card-title { font-size: 1.25rem; margin-bottom: 0; line-height: 1.5; }
  .card-header .close { padding: 1rem; margin: -1rem -1rem -1rem auto; }

  .b-overlay { position: fixed; top: 0; left: 0; bottom: 0; right: 0; overflow: auto; background-color: rgba(44, 46, 47, 0.9); z-index: 2}
  .bv-example-row { margin-top: 100px; margin-bottom: 70px; }
  .is_file { width: 50%!important; }
</style>
