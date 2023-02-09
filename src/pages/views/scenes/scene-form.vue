<template>
<div class="page-scene-form" v-if="page.is_ready" >
    <div class="es-page-head-2 mb-0">
        <div class="row-head">
            <div>
                <div v-if="data.id != null">
                    <h4>{{$t('EDIT')}}: <strong>{{ data.title }}</strong></h4>
                    <small>{{$t('DATE_MODIFIED')}}: {{ data.updated_at }}</small>
                </div>
                <div v-else>
                    <h4>{{$t('CREATE_NEW_SCENE')}}</h4>
                </div>
            </div>
            <div class="book-panel-right">
                <button ref="button" v-show="data.id!=null" class="es-button btn-sm white" :disabled="version_modal_is_open" @click="newVersion()">{{$t('SAVE_AS_NEW_VERSION').toUpperCase()}}</button>
                <button v-if="data.id != null" class="es-button btn-sm white" @click="saveScene()">{{$t('SAVE_CHANGES')}}</button>
                <button v-else class="es-button btn-sm white" @click="saveScene()">{{$t('SAVE')}}</button>
            </div>
        </div>
    </div>
  <!-- <div v-if="chapter" class="es-page-breadcrumbs">
    <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
    /
    <button @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})">{{ $t('CHAPTERS') }}</button>
    /
    <button @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + book.uuid, tabComponent: 'chapter-details', tabData: { book: book, chapter: chapter }, tabTitle: 'VIEW - ' + chapter.title})">{{ chapter.title || 'Untitled' }}</button>
    /
    <button class="current">
      <span>{{ (data.id) ? data.title || $t('Untitled') : $t('NEW_SCENE')}}</span>
    </button>
  </div> -->
    <div class="es-page-content">

        <ul class="es-breadcrumb">
            <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">{{ book.title }}</a></li>
            <li v-if="chapter"><a @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})" href="javascript:void(0);">{{ $t('CHAPTERS') }}</a></li>
            <li v-if="chapter"><a @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + book.uuid, tabComponent: 'chapter-details', tabData: { book: book, chapter: chapter }, tabTitle: 'VIEW - ' + chapter.title})" href="javascript:void(0);">{{ chapter.title || 'Untitled' }}</a></li>
            <li><a href="javascript:void(0);" style="padding-right: 20px;">
                <span>{{ (data.id) ? data.title || $t('Untitled') : $t('NEW_SCENE')}}</span>
            </a></li>
        </ul>

        <div class="container">
            <div class="es-accordion">
                <div class="item" v-bind:class="{'active': accordion['scene-details'] === 'active'}">
                    <div class="label" @click="toggleAccordion('scene-details')">
                        {{$t('SCENE_DETAILS').toUpperCase()}}
                        <div class="icon">
                            <i v-if="accordion['scene-details'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['scene-details'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content ">
                        <b-row class="margin-bottom-1rem">
                            <b-col>
                                <label for="input-title">{{$t('TITLE')}}: </label>
                                <b-form-input
                                    id="input-title"
                                    v-model="data.title"
                                    :state="feedback.title.state"
                                    aria-describedby="input-live-help input-live-feedback"
                                    :placeholder="$t('TITLE')"
                                    @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)"
                                    trim
                                ></b-form-input>
                                <!-- This will only be shown if the preceding input has an invalid state -->
                                <b-form-invalid-feedback id="input-title-feedback">
                                    {{ feedback.title.message }}
                                </b-form-invalid-feedback>
                            </b-col>
                            <b-col>
                                <label>{{$t('CHAPTER')}}: </label>
                                <multiselect class="custom-multiselect" :preselectFirst="true" :allow-empty="false" v-model="selected_chapter" :options="options_chapters"  @select="selectMultiselect" :placeholder="$t('SELECT') + ' ' + $t('CHAPTER')" label="title" track-by="uuid" :deselectLabel="$t('SELECTED')" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
                            </b-col>
                        </b-row>
                        <b-row class="margin-bottom-1rem">
                            <b-col>
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
                            </b-col>
                        </b-row>
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
                        <b-row class="margin-bottom-1rem">
                            <b-col>
                                <div v-if="scene_history.length" class="text-right">
                                    <button class="es-button-white margin-bottom-1rem" @click="show_history = !show_history">{{$t('SHOW_HISTORY')}}</button>
                                </div>
                                <div class="form-group">
                                    <tiny-editor :params="tiny_editor_params" :initValue="data.scene_version.content" v-on:getEditorContent="setContent" class="form-control" />
                                    <CommentBasePanel v-if="commentbase_dom" :dom="commentbase_dom" :params="commentbase_params()"></CommentBasePanel>
                                </div>
                                <div v-if="show_history" class="scene-history-items slideInRight animated">
                                    <div class="note">
                                        <i @click="show_history = !show_history" class="btn-close fas fa-times"></i>
                                        {{$t('DOUBLE_CLICK_TO_VIEW_HISTORY')}}
                                    </div>
                                    <div class="scene-history-list" >
                                        <div v-bind:key="history.uuid" v-for="history in scene_history">
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
                            </b-col>
                        </b-row>
                        <div class="col-md-12" v-show="data.id != null">
                            <small>The scene will be autosaved every ten seconds</small>
                            <small v-if="!do_auto_save" class="text-red"> | Saving ...</small>
                        </div>
                    </div>
                </div>
                <div class="item" v-bind:class="{'active': accordion['more-details'] === 'active'}">
                    <div class="label" @click="toggleAccordion('more-details')">
                        {{$t('MORE_DETAILS').toUpperCase()}}
                        <div class="icon">
                            <i v-if="accordion['more-details'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['more-details'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content ">
                        <b-row class="margin-bottom-1rem">
                            <b-col>
                                <label>{{$t('TYPE_OF_SCENE')}}: </label>
                                <multiselect class="custom-multiselect" :preselectFirst="true" :allow-empty="false" v-model="selected_typeofscene" :options="options_typeofscene" @select="selectMultiselect" :placeholder="$t('SELECT_TYPE_OF_SCENE')" label="text" track-by="value" :deselectLabel="$t('SELECTED')" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
                            </b-col>
                            <b-col>
                                <label>{{$t('IMPORTANCE')}}: </label>
                                <multiselect class="custom-multiselect" :preselectFirst="true" :allow-empty="false" v-model="selected_importance" :options="options_importance" @select="selectMultiselect" placeholder="Select Importance" label="text" track-by="value" :deselectLabel="$t('SELECTED')" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
                            </b-col>
                        </b-row>
                        <b-row class="margin-bottom-1rem">
                            <b-col>
                                <label>{{$t('TAGS')}}: </label>
                                <b-form-input v-model="data.tags" placeholder="Tags"></b-form-input>
                            </b-col>
                            <b-col>
                                <label>{{$t('STATUS')}}: </label>
                                <multiselect class="custom-multiselect" :preselectFirst="true" :allow-empty="false"  v-model="selected_status" :options="options_status" @select="selectMultiselect" placeholder="Select Status" label="text" track-by="value" :deselectLabel="$t('SELECTED')" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
                            </b-col>
                        </b-row>
                    </div>
                </div>
                <div class="item" v-bind:class="{'active': accordion['notes'] === 'active'}">
                    <div class="label" @click="toggleAccordion('notes')">
                        {{$t('NOTES').toUpperCase()}}
                        <div class="icon">
                            <i v-if="accordion['notes'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['notes'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content">
                        <tiny-editor :initValue="data.notes" v-on:getEditorContent="setNotes" class="form-control" />
                    </div>
                </div>
                <div class="item" v-bind:class="{'active': accordion['viewpoint'] === 'active'}">
                    <div class="label" @click="toggleAccordion('viewpoint')">
                        {{$t('TIME_VIEWPOINT').toUpperCase()}}
                        <div class="icon">
                            <i v-if="accordion['viewpoint'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['viewpoint'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content ">
                        <b-row class="margin-bottom-1rem">
                            <b-col cols="6">
                                <label>{{$t('TYPE')}}: </label>
                                <multiselect class="custom-multiselect" :preselectFirst="true" :allow-empty="false"  v-model="selected_weather_type" :options="options_weather_type" @select="selectMultiselect" placeholder="Select Status" label="text" track-by="value" :deselectLabel="$t('SELECTED')" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
                            </b-col>
                        </b-row>
                        <b-row class="margin-bottom-1rem">
                            <b-col>
                                <label>{{$t('SCENE_STARTS')}}: </label>
                                <b-form-datepicker id="date_starts-datepicker" @context="onSceneStartContext" v-model="data.date_starts" class="mb-2" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" :placeholder="$t('SELECT') + ' ' +$t('SCENE_STARTS')"></b-form-datepicker>
                            </b-col>
                            <b-col>
                                <label>{{$t('SCENE_ENDS')}}: </label>
                                <b-form-datepicker id="date_ends-datepicker" @context="onSceneEndContext" v-model="data.date_ends" class="mb-2" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" :placeholder="$t('SELECT') + ' ' +$t('SCENE_ENDS')"></b-form-datepicker>
                            </b-col>
                        </b-row>
                        <b-row class="margin-bottom-1rem">
                            <b-col cols="6">
                                <label>{{$t('POINT_OF_VIEW')}}: </label>
                                <multiselect class="custom-multiselect" :preselectFirst="true" :allow-empty="false"   v-model="selected_character_id_vp" :options="options_character_id_vp" @select="selectMultiselect" :placeholder="$t('SELECT') + ' ' +$t('POINT_OF_VIEW')" label="text" track-by="value" :deselectLabel="$t('SELECTED')" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
                            </b-col>
                        </b-row>
                        <b-row class="margin-bottom-1rem">
                            <b-col>
                                <label>{{$t('VIEWPOINT_DESCRIPTION')}}: </label>
                                <tiny-editor :initValue="data.viewpoint_description"
                                            v-on:getEditorContent="setViewpointDescription"
                                            class="form-control"
                                />
                            </b-col>
                        </b-row>
                    </div>
                </div>
                <div class="item" v-bind:class="{'active': accordion['items'] === 'active'}">
                    <div class="label" @click="toggleAccordion('items')">
                        {{$t('ITEMS').toUpperCase()}}
                        <div class="icon">
                            <i v-if="accordion['items'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['items'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content ">
                        <p>{{$t('CLICK_ITEM_TO_ADD_IT_INTO_THE_SCENE')}}</p>
                        <div @click="toggleChild('items',item)" v-bind:class="{'selected' : selected_items.includes(item.uuid) }" class="es-toggle-select" v-bind:key="item.id" v-for="item in $store.getters.getItemsByBook(book.uuid)">
                            <i v-if="selected_items.includes(item.uuid)" class="fas fa-check"></i> &nbsp;{{ item.itemname }}
                        </div>
                    </div>
                </div>
                <div class="item" v-bind:class="{'active': accordion['characters'] === 'active'}">
                    <div class="label" @click="toggleAccordion('characters')">
                        {{$t('CHARACTERS').toUpperCase()}}
                        <div class="icon">
                            <i v-if="accordion['characters'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['characters'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content ">
                        <p>{{$t('CLICK_CHARACTER_TO_ADD_IT_INTO_THE_SCENE')}}</p>
                        <div @click="toggleChild('characters',character)" v-bind:class="{'selected' : selected_characters.includes(character.uuid) }" class="es-toggle-select" v-bind:key="character.id" v-for="character in $store.getters.getCharactersByBook(book.uuid)">
                            <i v-if="selected_characters.includes(character.uuid)" class="fas fa-check"></i> &nbsp;{{ character.fullname }}
                        </div>
                    </div>
                </div>
                <div class="item" v-bind:class="{'active': accordion['locations'] === 'active'}">
                    <div class="label" @click="toggleAccordion('locations')">
                        {{$t('LOCATIONS').toUpperCase()}}
                        <div class="icon">
                            <i v-if="accordion['locations'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['locations'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content ">
                        <p>{{$t('CLICK_LOCATION_TO_ADD_IT_INTO_THE_SCENE')}}</p>
                        <div @click="toggleChild('locations',location)" v-bind:class="{'selected' : selected_locations.includes(location.uuid) }" class="es-toggle-select" v-bind:key="location.id" v-for="location in $store.getters.getLocationsByBook(book.uuid)">
                        <i v-if="selected_locations.includes(location.uuid)" class="fas fa-check"></i> &nbsp;{{ location.location }}
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
                                <h4 class="mb-0">Content</h4>
                            </template>
                            <div class="margin-bottom-1rem">
                                <div v-html="historyContent" class="history-content" ></div>
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
          id="version-overlay-background"
          ref="dialog"
          tabindex="-1"
          role="dialog"
          aria-modal="false"
          aria-labelledby="form-confirm-label"
          class="p-3"
        >
          <b-container class="bv-example-row">
            <b-card-group deck>
              <b-card :header="$t('SAVE_AS_NEW_VERSION')"  class="text-center">
                <b-row style="margin-bottom: 1rem;" class="text-left">
                  <b-col>
                    <label>{{$t('DESCRIPTION')}}: </label>
                    <tiny-editor :initValue="new_scene_version.change_description"
                                 v-on:getEditorContent="setDescription"
                                 class="form-control"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <div class="text-right">
                      <b-button variant="outline-dark" class="mr-2" @click="version_modal_is_open = !version_modal_is_open">{{$t('CANCEL')}}</b-button>
                      <b-button variant="dark" @click="saveNewVersion">{{$t('SAVE')}}</b-button>
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

import CommentBasePanel from '../../../components/CommentBasePanel'

const moment = require('moment')
const {ipcRenderer} = window.require('electron')

export default {
  name: 'book-form',
  props: ['properties'],
  data: function () {
    var scope = this
    return {
      page: {
        title: '',
        is_ready: false
      },
      data: {
        id: null,
        uuid: null,
        book_id: this.properties.uuid,
        chapter_id: '',
        title: '',
        short_description: '',
        scene_version: {
          content: ''
        },
        typeofscene: '',
        importance: '',
        tags: '',
        status: '',
        notes: '',
        weather_type: '',
        date_starts: '',
        date_ends: '',
        character_id_vp: '',
        viewpoint_description: ''
      },
      // Selected nultiselect
      current_chapter_id: null, // chapter before updating
      selected_chapter: null,
      selected_typeofscene: null,
      selected_importance: null,
      selected_status: null,
      selected_weather_type: null,
      selected_character_id_vp: {text: 'Author', value: '-1'},
      // Options for multiselect
      options_chapters: [{title: this.$t('OTHER_SCENE'), uuid: '-1'}],
      options_typeofscene: [
        {text: 'Action', value: 'Action'},
        {text: 'Reaction', value: 'Reaction'}
      ],
      options_importance: [
        {text: 'Plot', value: 'Plot'},
        {text: 'Subplot', value: 'Subplot'}
      ],
      options_status: [
        {text: 'Outline', value: 'Outline'},
        {text: 'Draft', value: 'Draft'},
        {text: '1st Edition', value: '1st Edition'},
        {text: '2nd Edition', value: '2nd Edition'},
        {text: 'Done', value: 'Done'}
      ],
      options_weather_type: [
        {text: 'Rainy', value: 'Rainy'},
        {text: 'Sunny', value: 'Sunny'},
        {text: 'Snowy', value: 'Snowy'},
        {text: 'Windy', value: 'Windy'}
      ],
      options_character_id_vp: [
        {text: 'Author', value: '-1'}
      ],
      // List of selected characters/items/locations
      selected_items: [],
      selected_characters: [],
      selected_locations: [],
      // Temp container of content
      tempSceneVersionContent: '',
      tempSceneNotes: '',
      tempViewpointDescription: '',
      tempSceneStart: '',
      tempSceneEnd: '',
      accordion: {
        'scene-details': 'active',
        'content': 'inactive',
        'more-details': 'inactive',
        'notes': 'inactive',
        'viewpoint': 'inactive',
        'characters': 'inactive',
        'locations': 'inactive',
        'items': 'inactive'
      },
      base_scene_val: {},
      // Base content count is use to determine initial total number of words in content
      base_content_count: '',
      // Author progress is use for saving author personal progress
      authorProgress: {
        author_id: '',
        relation_id: '',
        is_for: 'scene',
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
      scene_history: {},
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
            scope.saveScene(true)
          }
        }
      },
      new_scene_version: {
        book_scene_id: null,
        change_description: null,
        content: null
      },
      tempVersionDesc: '',
      auto_save_interval: null,
      version_modal_is_open: false,
      do_auto_save: true
    }
  },
  components: {
    TinyMCE,
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
    items: function () {
      return this.$store.getters.getItemsByBook(this.properties.book.uuid)
    },
    locations: function () {
      return this.$store.getters.getLocationsByBook(this.properties.book.uuid)
    },
    characters: function () {
      return this.$store.getters.getCharactersByBook(this.properties.book.uuid)
    },
    comments: function () {
      // return '{}'
      var scope = this
      if (!scope.scene) return null
      var sceneID = scope.scene.uuid
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
    getImport: function () {
      var scope = this
      ipcRenderer.send('IMPORT-DOCX', 'scene')

      ipcRenderer.on('GET-DOCX-CONTENT-SCENE', function (event, data) {
        scope.data.scene_version.content = data
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
        scope.tempSceneVersionContent = data
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
    selectMultiselect () {
      var scope = this
      if ((scope.data.chapter_id && scope.selected_chapter) && scope.selected_chapter.uuid !== scope.data.chapter_id) {
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      }

      if ((scope.data.typeofscene && scope.selected_typeofscene) && scope.data.typeofscene !== scope.selected_typeofscene.value) {
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      }

      if ((scope.data.importance && scope.selected_importance) && scope.data.importance !== scope.selected_importance.value) {
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      }

      if ((scope.data.status && scope.selected_status) && scope.data.status !== scope.selected_status.value) {
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      }

      if ((scope.data.weather_type && scope.selected_weather_type) && scope.data.weather_type !== scope.selected_weather_type.value) {
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      }

      if ((scope.data.character_id_vp && scope.selected_character_id_vp) && scope.data.character_id_vp !== scope.selected_character_id_vp.value) {
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      }
    },
    onSceneStartContext: function (ctx) {
      var scope = this
      if (ctx.selectedYMD && scope.tempSceneStart !== ctx.selectedYMD) {
        scope.tempSceneStart = ctx.selectedYMD
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      }
    },
    onSceneEndContext: function (ctx) {
      var scope = this
      if (ctx.selectedYMD && scope.tempSceneEnd !== ctx.selectedYMD) {
        scope.tempSceneEnd = ctx.selectedYMD
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      }
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
          scope.data.scene_version.content = content
          scope.tempSceneVersionContent = content
        }
      })
    },
    setSelectedChild: function () {
      var scope = this

      var items = scope.$store.getters.getSceneItems(scope.properties.scene.uuid)
      for (let i = 0; i < items.length; i++) {
        var item = items[i].item
        scope.selected_items.push(item.uuid)
      }

      var locations = scope.$store.getters.getSceneLocations(scope.properties.scene.uuid)
      for (let i = 0; i < locations.length; i++) {
        let location = locations[i].location
        scope.selected_locations.push(location.uuid)
      }

      var characters = scope.$store.getters.getSceneCharacters(scope.properties.scene.uuid)
      for (let i = 0; i < characters.length; i++) {
        let character = characters[i].character
        scope.selected_characters.push(character.uuid)
      }
    },
    toggleChild: function (model, data) {
      var scope = this
      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      if (model === 'items' && scope.selected_items.includes(data.uuid)) {
        for (let i = 0; i < scope.selected_items.length; i++) {
          if (scope.selected_items[i] === data.uuid) {
            scope.selected_items.splice(i, 1)
            return
          }
        }
      } else if (model === 'items' && !scope.selected_items.includes(data.uuid)) {
        scope.selected_items.push(data.uuid)
        return
      }

      if (model === 'characters' && scope.selected_characters.includes(data.uuid)) {
        for (let i = 0; i < scope.selected_characters.length; i++) {
          if (scope.selected_characters[i] === data.uuid) {
            scope.selected_characters.splice(i, 1)
            return
          }
        }
      } else if (model === 'characters' && !scope.selected_characters.includes(data.uuid)) {
        scope.selected_characters.push(data.uuid)
        return
      }

      if (model === 'locations' && scope.selected_locations.includes(data.uuid)) {
        for (let i = 0; i < scope.selected_locations.length; i++) {
          if (scope.selected_locations[i] === data.uuid) {
            scope.selected_locations.splice(i, 1)
            return
          }
        }
      } else if (model === 'locations' && !scope.selected_locations.includes(data.uuid)) {
        scope.selected_locations.push(data.uuid)
      }
    },
    // Required for geting value from TinyMCE content
    setContent (value) {
      var scope = this
      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)

      // scope.data.scene_version.content = value
      scope.tempSceneVersionContent = value
    },
    setNotes (value) {
      var scope = this
      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)

      scope.tempSceneNotes = value
    },
    setViewpointDescription (value) {
      var scope = this
      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)

      scope.tempViewpointDescription = value
    },
    setAll (obj, val) {
      Object.keys(obj).forEach(function (index) {
        obj[index] = val
      })
    },
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
        scope.feedback.title.message = this.$t('TITLE') + ' ' + this.$t('IS_REQUIRED')
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
    saveScene (noAlert) {
      var scope = this

      scope.data.scene_version.content = scope.tempSceneVersionContent
      scope.data.scene_version.comments = (scope.commentbase_vm) ? scope.commentbase_vm.getCommentsJSON() : null
      scope.data.notes = scope.tempSceneNotes
      scope.data.viewpoint_description = scope.tempViewpointDescription
      scope.data.chapter_id = (scope.selected_chapter !== 'undefined' && scope.selected_chapter !== null && scope.selected_chapter.uuid !== '-1') ? scope.selected_chapter.uuid : null
      scope.data.typeofscene = scope.selected_typeofscene.value
      scope.data.importance = scope.selected_importance.value
      scope.data.status = scope.selected_status.value
      scope.data.weather_type = scope.selected_weather_type.value
      scope.data.character_id_vp = scope.selected_character_id_vp.value

      if (!scope.validate()) {
        return false
      }

      // Set autosave to busy
      scope.do_auto_save = false

      scope.axios
        .post('http://localhost:3000/scenes', scope.data)
        .then(response => {
          if (response.data) {
            scope.saveRelatedTables(response.data.uuid)
            scope.$store.dispatch('updateSceneList', response.data)
            if (!noAlert) {
              window.swal.fire({
                position: 'center',
                icon: 'success',
                title: this.$t('SCENE') + ' ' + this.$t('SUCCESSFULY_SAVED'),
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                scope.UNMARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
                // scope.$parent.changeComponent('scene-details', { scene: response.data })
                if (scope.data.uuid === null) {
                  // scope.$store.dispatch('updateSceneList', response.data)
                  // refresh vuex to update all related records
                  // scope.$store.dispatch('loadVersionsByScene', response.data)
                  // scope.$store.dispatch('loadSceneHistory', response.data.uuid)
                  // scope.$store.dispatch('loadTodayAuthorPersonalProgressForScene', response.data.uuid)
                  scope.CHANGE_COMPONENT({tabKey: 'scene-form-' + response.data.uuid, tabComponent: 'scene-form', tabData: { book: scope.book, chapter: scope.chapter, scene: response.data }, tabTitle: scope.$t('EDIT') + ' - ' + response.data.title, tabIndex: scope.$store.getters.getActiveTab})
                } else {
                  // refresh vuex to update all related records
                  // scope.$store.dispatch('updateSceneList', response.data)
                  // scope.$store.dispatch('loadVersionsByScene', response.data)
                  scope.$store.dispatch('changeTabTitle', {key: 'scene-form-' + response.data.uuid, title: scope.$t('EDIT') + ' - ' + response.data.title})
                  scope.$store.dispatch('changeTabTitle', {key: 'scene-details-' + response.data.uuid, title: scope.$t('VIEW') + ' - ' + response.data.title})
                  // scope.$store.dispatch('loadSceneHistory', response.data.uuid)
                  // scope.$store.dispatch('loadTodayAuthorPersonalProgressForScene', response.data.uuid)
                }

                // update listing for treeviews
                if (scope.current_chapter_id === null && scope.current_chapter_id !== response.data.chapter_id) {
                  scope.$store.dispatch('loadScenesByBook', response.data.book_id)
                  scope.$store.dispatch('loadScenesByChapter', response.data.chapter_id)
                } else if (scope.current_chapter_id !== null && response.data.chapter_id === null) {
                  scope.$store.dispatch('loadScenesByBook', response.data.book_id)
                  scope.$store.dispatch('loadScenesByChapter', scope.current_chapter_id)
                } else if (scope.current_chapter_id !== null && scope.current_chapter_id !== response.data.chapter_id) {
                  scope.$store.dispatch('loadScenesByChapter', scope.current_chapter_id)
                  scope.$store.dispatch('loadScenesByChapter', response.data.chapter_id)
                }
                scope.current_chapter_id = response.data.chapter_id

                scope.loadScene(response.data)
              })
            }
          }
        })
    },
    saveRelatedTables: function (sceneId) {
      var scope = this

      scope.saveSceneItems(sceneId)
      scope.saveSceneLocations(sceneId)
      scope.saveSceneCharacters(sceneId)
      scope.saveAuthorPersonalProgress(sceneId)
      scope.saveSceneHistory(sceneId)
    },
    saveSceneItems (sceneId) {
      var scope = this
      scope.axios
        .post('http://localhost:3000/scene-items/batch', { book_scene_id: sceneId, rows: scope.selected_items })
        .then(response => {
          console.log('scene items added')
        })
    },
    saveSceneLocations (sceneId) {
      var scope = this
      scope.axios
        .post('http://localhost:3000/scene-locations/batch', { book_scene_id: sceneId, rows: scope.selected_locations })
        .then(response => {
          console.log('scene locations added')
        })
    },
    saveSceneCharacters (sceneId) {
      var scope = this
      scope.axios
        .post('http://localhost:3000/scene-characters/batch', { book_scene_id: sceneId, rows: scope.selected_characters })
        .then(response => {
          console.log('scene characters added')
        })
    },
    saveAuthorPersonalProgress (sceneId) {
      var scope = this
      if (scope.authorProgress.uuid) {
        scope.authorProgress.total_words = scope.authorProgress.total_words + (scope.WORD_COUNT(scope.tempSceneVersionContent) - scope.base_content_count)
      } else {
        scope.authorProgress.author_id = scope.$store.getters.getAuthorID
        scope.authorProgress.relation_id = sceneId
        scope.authorProgress.total_words = scope.WORD_COUNT(scope.tempSceneVersionContent) - scope.base_content_count
      }

      scope.axios
        .post('http://localhost:3000/author-personal-progress', scope.authorProgress)
        .then(response => {
          scope.authorProgress = response.data
          scope.$store.dispatch('loadAuthorPersonalProgress', { authorId: this.$store.getters.getAuthorID })
        })
    },
    saveSceneHistory (sceneId) {
      var scope = this
      let sceneHistory = {
        scene_id: sceneId,
        content: scope.data.scene_version.content
      }

      if (sceneHistory.content === '') return
      scope.axios
        .post('http://localhost:3000/book-scene-history', sceneHistory)
        .then(response => {
          scope.setBaseSceneVal(scope.data)

          scope.scene_history.push(response.data)

          scope.do_auto_save = true
          console.log('Scene history saved!')
        })
    },

    newVersion: function () {
      var scope = this
      this.version_modal_is_open = true

      scope.clear_history = false
      scope.new_scene_version.change_description = ''
      if (scope.new_scene_version.id) {
        delete (scope.new_scene_version.id)
        delete (scope.new_scene_version.uuid)
      }
    },
    saveNewVersion () {
      var scope = this

      scope.new_scene_version.change_description = scope.tempVersionDesc
      scope.new_scene_version.content = scope.tempSceneVersionContent
      scope.new_scene_version.book_scene_id = scope.data.uuid

      scope.axios.post('http://localhost:3000/scene-versions', scope.new_scene_version)
        .then(response => {
          if (response.data) {
            let version = response.data
            // TODO: Insert vuex code that will refresh the scene version
            scope.$store.dispatch('updateSceneVersionList', version)

            scope.data.scene_version.id = version.id
            scope.data.scene_version.uuid = version.uuid
            scope.data.scene_version.content = version.content
            scope.data.scene_version.change_description = version.change_description
            this.version_modal_is_open = false

            if (scope.clear_history) { scope.clearSceneHistory(scope.scene.id) }

            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('SCENE') + ' ' + this.$t('VERSION') + ' ' + this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
    },
    async loadScene (sceneProp) {
      var scope = this
      scope.properties.scene = sceneProp

      try {
        // load scene children
        await scope.$store.dispatch('loadCharactersByScene', scope.properties.scene)
        await scope.$store.dispatch('loadItemsByScene', scope.properties.scene)
        await scope.$store.dispatch('loadLocationsByScene', scope.properties.scene)
        await scope.$store.dispatch('loadVersionsByScene', scope.properties.scene)
        await scope.$store.dispatch('loadTodayAuthorPersonalProgressForScene', scope.properties.scene.uuid)
        await scope.$store.dispatch('loadSceneHistory', scope.properties.scene.uuid)
      } catch (ex) {
        console.log('Failed to load data')
      } finally {
        let scene = sceneProp
        let chapters = scope.$store.getters.getChaptersByBook(sceneProp.book_id)
        let chapter = scope.$store.getters.findChapter({ book_id: sceneProp.book_id, uuid: sceneProp.chapter_id })
        let characters = scope.$store.getters.getCharactersByBook(sceneProp.book_id)
        let version = scope.$store.getters.findLatestSceneVersionByScene(sceneProp)
        let progress = scope.$store.getters.getTodayAuthorPersonalProgressForScene(sceneProp)

        // scene
        scope.data.title = scene.title
        scope.data.short_description = scene.short_description
        scope.data.typeofscene = scene.typeofscene
        scope.data.importance = scene.importance
        scope.data.status = scene.status
        scope.data.weather_type = scene.weather_type
        scope.data.character_id_vp = scene.character_id_vp
        scope.data.date_starts = moment(scene.date_starts).format('YYYY-MM-DD').toString()
        scope.data.date_ends = moment(scene.date_ends).format('YYYY-MM-DD').toString()
        scope.data.tags = scene.tags
        scope.data.notes = scene.notes
        scope.data.viewpoint_description = scene.viewpoint_description

        scope.tempSceneStart = scene.date_starts
        scope.tempSceneEnd = scene.date_ends

        // chapters
        scope.options_chapters = [{title: window.vm.$t('OTHER_SCENE'), uuid: '-1'}]
        chapters.forEach(function (row, index) {
          scope.options_chapters.push(row)
        })

        // characters
        scope.options_character_id_vp = [{text: 'Author', value: '-1'}]
        for (let i = 0; i < characters.length; i++) {
          let character = characters[i]
          scope.options_character_id_vp.push({ text: character.fullname, value: character.uuid })

          if (scope.data.character_id_vp === character.uuid) {
            scope.selected_character_id_vp = { text: character.fullname, value: character.uuid }
          }
        }

        scope.selected_typeofscene = {text: scene.typeofscene, value: scene.typeofscene}
        scope.selected_importance = {text: scene.importance, value: scene.importance}
        scope.selected_status = {text: scene.status, value: scene.status}
        scope.selected_weather_type = {text: scene.weather_type, value: scene.weather_type}

        // chapter
        if (chapter) {
          scope.selected_chapter = chapter
        }

        if (version) {
          // version
          scope.data.scene_version.id = version.id
          scope.data.scene_version.uuid = version.uuid
          scope.data.scene_version.content = version.content
          scope.data.scene_version.change_description = version.change_description

          scope.tempSceneVersionContent = version.content
        }

        scope.tempSceneNotes = scene.notes
        scope.tempViewpointDescription = scene.viewpoint_description

        // set selected item/character/location
        scope.setSelectedChild()

        scope.setBaseSceneVal(scope.data)

        scope.base_content_count = scope.WORD_COUNT(scope.tempSceneVersionContent)

        // progress
        if (progress) {
          scope.authorProgress = progress
        }

        // scene history
        scope.scene_history = scope.GET_SCENE_HISTORY(scene.uuid)

        scope.page.is_ready = true
      }
    },
    setBaseSceneVal: function (scene) {
      let scope = this
      scope.base_scene_val = {}

      for (const key of Object.keys(scene)) {
        if (scope.IS_OBJECT(scene[key])) {
          scope.$set(scope.base_scene_val, key, {})
          for (const key2 of Object.keys(scene[key])) {
            scope.$set(scope.base_scene_val[key], key2, scene[key][key2])
          }
        } else {
          scope.$set(scope.base_scene_val, key, scene[key])
        }
      }
    },
    autoSave: function () {
      let scope = this

      // If save new version modal is open skip auto save
      // If view history modal is open skip auto save
      // If no changes  skip auto save
      if (scope.version_modal_is_open || scope.view_history || (scope.DEEP_EQUAL(scope.base_scene_val, scope.data) && scope.tempSceneVersionContent === scope.data.scene_version.content)) return false

      // There still a ongoing autosave return false and let that autosave to finish saving
      if (!scope.do_auto_save) return false

      scope.saveScene(true)
    }
  },
  beforeMount () {
    var scope = this

    if (scope.properties.scene) {
      scope.$set(scope.data, 'id', scope.properties.scene.id)
      scope.$set(scope.data, 'uuid', scope.properties.scene.uuid)
      scope.$set(scope.data, 'book_id', scope.properties.scene.book_id)

      if (scope.properties.scene.chapter_id) {
        scope.$set(scope.data, 'chapter_id', scope.properties.scene.chapter_id)
        scope.current_chapter_id = scope.properties.scene.chapter_id
      }
    } else if (scope.properties.chapter) {
      scope.$set(scope.data, 'book_id', scope.properties.chapter.book_id)
      scope.$set(scope.data, 'chapter_id', scope.properties.chapter.uuid)
      scope.selected_chapter = scope.properties.chapter
      scope.current_chapter_id = scope.properties.chapter.uuid
    } else {
      scope.$set(scope.data, 'book_id', scope.properties.book.uuid)
    }
  },
  async mounted () {
    var scope = this

    try {
      await scope.$store.dispatch('loadChaptersByBook', scope.properties.book.uuid)
      await scope.$store.dispatch('loadCharactersByBook', scope.properties.book.uuid)
      await scope.$store.dispatch('loadItemsByBook', scope.properties.book.uuid)
      await scope.$store.dispatch('loadLocationsByBook', scope.properties.book.uuid)
    } catch (ex) {
      console.log('Failed to load data')
    } finally {
      if (scope.data.uuid) {
        scope.loadScene(scope.properties.scene)
        scope.selected_chapter = scope.properties.chapter

        scope.auto_save_interval = setInterval(scope.autoSave, 10000)
      } else {
        let chapters = scope.$store.getters.getChaptersByBook(scope.properties.book.uuid)
        var bookCharacters = scope.$store.getters.getCharactersByBook(scope.properties.book.uuid)

        chapters.forEach(function (row, index) {
          scope.options_chapters.push(row)
        })

        for (let i = 0; i < bookCharacters.length; i++) {
          let character = bookCharacters[i]
          scope.options_character_id_vp.push({ text: character.fullname, value: character.uuid })
          if (scope.properties.scene !== null && scope.properties.scene.character_id_vp === character.uuid) {
            scope.selected_character_id_vp = { text: character.fullname, value: character.uuid }
          }
        }
        scope.page.is_ready = true
      }
    }

    // // load book
    // scope.$store.dispatch('loadChaptersByBook', scope.properties.book.uuid)
    // scope.$store.dispatch('loadCharactersByBook', scope.properties.book.uuid)
    // scope.$store.dispatch('loadItemsByBook', scope.properties.book.uuid)
    // scope.$store.dispatch('loadLocationsByBook', scope.properties.book.uuid)
    //
    // if (scope.data.uuid) {
    //   window.$('.page-scene-form .page-title h3').html('Update ' + scope.properties.scene.title)
    //
    //   // load scene children
    //   scope.$store.dispatch('loadCharactersByScene', scope.properties.scene)
    //   scope.$store.dispatch('loadItemsByScene', scope.properties.scene)
    //   scope.$store.dispatch('loadLocationsByScene', scope.properties.scene)
    //   scope.$store.dispatch('loadVersionsByScene', scope.properties.scene)
    //   scope.$store.dispatch('loadTodayAuthorPersonalProgressForScene', scope.properties.scene.uuid)
    //   scope.$store.dispatch('loadSceneHistory', scope.properties.scene.uuid)
    //
    //   scope.loadScene(scope.properties.scene)
    //   scope.selected_chapter = scope.properties.chapter
    // } else {
    //   setTimeout(function () {
    //     let chapters = scope.$store.getters.getChaptersByBook(scope.properties.book.uuid)
    //     var bookCharacters = scope.$store.getters.getCharactersByBook(scope.properties.book.uuid)
    //     // give time to load data before processing since other time dispatch take time
    //     setTimeout(function () {
    //       chapters.forEach(function (row, index) {
    //         scope.options_chapters.push(row)
    //       })
    //
    //       for (let i = 0; i < bookCharacters.length; i++) {
    //         let character = bookCharacters[i]
    //         scope.options_character_id_vp.push({ text: character.fullname, value: character.uuid })
    //         if (scope.properties.scene !== null && scope.properties.scene.character_id_vp === character.uuid) {
    //           scope.selected_character_id_vp = { text: character.fullname, value: character.uuid }
    //         }
    //       }
    //       scope.page.is_ready = true
    //     }, 500)
    //   }, 1000)
    // }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
  .page-title h3 { font-size:35px; }

  .single-picture-file { display: none }
  .uploaded-file-preview { width:100%; cursor: pointer; }
  .uploaded-file-preview img { width:100%; }
  .uploaded-file-preview .default-preview { min-height: 180px; background-color: #293742; color: #fff; text-align: center; }
  .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 180px; opacity: 0.8; }

  .es-toggle-select { display:inline-block; background:#e0e7ed; border:1px solid #ccc; padding:4px 20px; border-radius:8px; margin:5px 5px; cursor:pointer; font-size:14px; }
  .es-toggle-select.selected { background:#293742; color:#fff; }

  .es-accordion .item { background:#fafafa; border-bottom:2px solid #e0e5ee; padding:10px 15px; }
  .es-accordion .item .label { position:relative; cursor:pointer; }
  .es-accordion .item .label .icon { position:absolute; top:0px; right:0px; }
  .es-accordion .item .content { display:none; margin-top:20px; margin-bottom:20px; }
  .es-accordion .item.active .content { display:block; }

  .es-button-white { font-size:12px; color:#324553; padding:3px 15px; background:#fff; border:1px solid #506d84; border-radius:3px; }

  .scene-history-items .note { position:relative; background:#fff; padding:10px; padding-right:15px; border-bottom:1px solid #e0e5ee; font-style:italic; }
  .scene-history-items .note .btn-close { position: absolute; cursor: pointer; top: 13px; right: 15px; }

  .scene-history-items { position: absolute; top: 0px; right: 0px; width: 280px; height: calc(100% - 1rem); background: #f5f8fa; border: 1px solid #e0e5ee; z-index: 10; }
  .scene-history-items .scene-history-list {overflow-y: auto; height: calc(100% - 43px); }
  .scene-history-items .history-item { cursor: pointer; background: #fff; border-bottom: 1px solid #e0e5ee; padding: 10px; }
  .scene-history-items .history-item .view-all { font-size: 12px; cursor: pointer; }

  .history-content {
    user-select: text!important; /* standard syntax */
    -webkit-user-select: text!important;; /* webkit (safari, chrome) browsers */
    -moz-user-select: text!important;; /* mozilla browsers */
    -khtml-user-select: text!important;; /* webkit (konqueror) browsers */
    -ms-user-select: text!important;; /* IE10+ */
  }

  .history-content { max-height: 400px; overflow-y: auto }
</style>
