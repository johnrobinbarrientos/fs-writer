<template>
<div v-if="page.is_ready" class="es-page-main page-book-details">
    <div class="es-page-head-2">
      <div class="row-head" style="margin-bottom: 10px;">
          <div>
            <h4 class="main-title"><i class="fas fa-book mr-1"></i> {{ properties.title }}</h4>
          </div>
          <div class="book-panel-right">
            <button class="es-button btn-sm white" @click="CHANGE_COMPONENT({tabKey: 'storyboard-' + page.data.uuid, tabComponent: 'storyboard',  tabData: page.data, tabTitle: 'Story Board - ' + properties.title, newTab: true})">Story Board</button>
            <button class="es-button btn-sm white" :disabled="getExportBookStatus.export_book_status"  @click="exportBook()">
              <span v-if="getExportBookStatus.export_book_status === false"><span>{{export_book}}</span></span>
              <span v-else>
                <spinner small type="grow"></spinner>
                <span>{{exportLoading}}</span>
              </span>
            </button>
            <button class="es-button btn-sm white" @click="getImport()">{{ $t('IMPORT_MULTIPLE_CHAPTERS') }}</button>
            <a class="es-button icon-only warning" href="#hashtagFeedbacks"><i class="las la-comments"></i><!--{{$t('FEEDBACKS').toUpperCase()}}--></a>
            <button class="es-button icon-only" @click="CHANGE_COMPONENT({tabKey: 'book-form-' + page.data.uuid, tabComponent: 'book-form',  tabData: page.data, tabTitle: $t('EDIT') + ' - ' + properties.title, newTab: true})"><i class="las la-highlighter"></i></button>
            <button class="es-button icon-only danger" @click="deleteBook()"><i class="las la-trash-alt"></i></button>
          </div>
      </div>
      <div class="row-head">
          <div>
            <span class="book-genre" v-for="genre in properties.genre" :key="genre.uuid">{{ genre.name }}</span>
          </div>
          <div class="d-flex align-items-center">
            <i class="las la-cog" style="font-size: 18px; margin-right: 4px;"></i><small> {{ $t('DATE_MODIFIED') }}: {{ properties.created_at }}</small>
          </div>
      </div>
    </div>
    <div class="es-page-content" id="custom-scrollbar">
        <div>
            <h4>{{ $t('ABOUT') }}</h4>
            <div v-html="properties.about"></div>
        </div>
        <div class="es-panel" style="border: none; padding: 0px; background: transparent;">
          <div class="feedback-wrap">
          <div class="feedbacks">
          <div class="head">
            {{$t('FEEDBACKS')}}
            <select v-model="filter" style="position:absolute; top:7px; right:10px;">
              <option value="all">{{$t('ALL')}}</option>
              <option value="done">{{$t('DONE')}}</option>
              <option value="undone">{{$t('UNDONE')}}</option>
            </select>
          </div>
          <div class="body">
            <template @click="openFeedback(feedback)" v-for="feedback in feedbacks" >
            <div :key="feedback.id"  v-if="isVisible(feedback)" v-bind:class="{'done' : feedback.is_done, 'seen' : feedback.is_seen}"  class="feedback-single">
              <div class="feedback-single-header">
                <strong class="author" >{{ feedback.author.alias }}</strong>
                <span class="date">{{ formatDate(feedback) }}</span>
                <div v-if="$store.getters.getAuthorID === properties.author_id">
                  <span @click="toggleMark(feedback)" v-if="!feedback.is_done" style="cursor:pointer; font-size:12px; border:1px solid #ccc; border-radius:3px; padding:3px 5px; background:#fff;">{{$t('MARK_AS_DONE')}}</span>
                  <span @click="toggleMark(feedback)" v-else style="cursor:pointer; font-size:12px; border:1px solid #fff; border-radius:3px; padding:3px 5px; background:#5bd05d; color:#fff;">{{$t('MARK_AS_UNDONE')}}</span>

                  <span @click="toggleSeen(feedback)" v-if="!feedback.is_seen" style="cursor:pointer; font-size:12px; border:1px solid #ccc; border-radius:3px; padding:3px 5px; background:#fff;">{{$t('MARK_AS_SEEN')}}</span>
                  <span @click="toggleSeen(feedback)" v-else style="cursor:pointer; font-size:12px; border:1px solid #fff; border-radius:3px; padding:3px 5px; background:#5bd05d; color:#fff;">{{$t('MARK_UNSEEN')}}</span>
                </div>
              </div>
              <div class="feedback-single-content-wrap" v-bind:class="{ 'open' : feedback.expand_content }">
                <p @click="expandFeedbackContent(feedback)" class="message" v-bind:class="{ 'ellipsis-3' : !feedback.expand_content }" v-html="feedback.message"></p>
              </div>
              <div class="feedback-single-replies-wrap " v-bind:class="{ 'open' : feedback.show_replies }">
                <div class="feedback-single-replies-header ">
                  <span @click="openFeedback(feedback)">{{ feedback.feedback_responses.length }} {{$t('REPLIES')}}</span>
                </div>
                <div class="feedback-single-replies">
                <div v-if="feedback.feedback_responses.length > 0" >
                  <div v-for="response in feedback.feedback_responses" :key="response.uuid" class="response-single">
                    <div class="feedback-single-replies-content" v-bind:class="{ 'open' : response.expand_content }">
                      <div class="feedback-response-single-header">
                        <strong style="font-size:14px;" class="author" >{{ response.author.alias }}</strong>
                        <span class="date">{{ formatDate(response) }}</span>
                      </div>
                      <p @click="expandFeedbackResponseContent(response)" class="message"  v-bind:class="{ 'ellipsis-3' : !response.expand_content }"  v-html="response.message"  style="font-size:14px;"></p>
                    </div>
                  </div>
                </div>
                <div v-else style="padding:10px; text-align:center;">
                  {{$t('NO_RESPONSE_FOR_THIS_FEEDBACK_YET')}}
                </div>
                <div style="text-align:right;">
                  <form v-on:submit.prevent="sendReply(feedback)">
                    <textarea style="width:100%;" type="text" v-model="feedback.reponse_text"></textarea>
                    <button type="submit" class="es-button-white">{{$t('SUBMIT')}}</button>
                  </form>
                </div>
                </div>
              </div>
            </div>
            </template>
          </div>
          <div id="hashtagFeedbacks" class="foot">
            <textarea  type="text" v-model="message"></textarea>
            <button @click="saveFeedback()" class="es-button-white">{{$t('SUBMIT')}}</button>
          </div>
        </div>
        </div>
        </div>
    </div>
</div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import { mapGetters } from 'vuex'
const {ipcRenderer} = window.require('electron')

export default {
  name: 'book-details',
  props: ['properties'],
  data: function () {
    return {
      page: {
        is_ready: false,
        title: '',
        data: null
      },
      export_book: this.$t('EXPORT_BOOK'),
      exportOnProgress: false,
      exportLoading: this.$t('Loading'),
      data: [],
      selected_book_id: null,
      filter: 'all',
      selected: false,
      message: '',
      response: '',
      show_feedbacks: false,
      show_notes: false,
      feedbacks: []
    }
  },
  computed: {
    ...mapGetters({ getExportBookStatus: 'getExportBookStatus' })
  },
  components: {
  },
  methods: {
    getImport: function () {
      var scope = this
      ipcRenderer.send('IMPORT-DOCX-MULTI-CHAPTERS', scope.properties)
    },
    updateBook () {
      var scope = this
      // scope.$parent.getBooks()
      // scope.$parent.changeComponent('book-form', scope.properties)
      scope.$parent.changeComponent('book-form', scope.properties, scope.properties.title, true)
      scope.$store.commit('addTab', { title: scope.properties.title, component: 'book-form', data: scope.properties })
    },

    deleteBook () {
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
            .delete('http://localhost:3000/books/' + scope.properties.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeBookFromList', scope.properties)
                  scope.CHANGE_COMPONENT({tabKey: 'dashboard', tabComponent: 'dashboard', tabData: null, tabTitle: 'DASHBOARD'})
                })
              }
            })
        }
      })
    },

    exportBook: function () {
      const scope = this
      scope.$store.commit('exportBookStatusOpen')

      let book = scope.properties

      ipcRenderer.send('EXPORT-DOCX-SHOW-BOOK-WINDOW', book)

      ipcRenderer.on('CHANGE-EXPORT-BOOK-BUTTON-NAME', function (event, data) {
        scope.exportOnProgress = false
        scope.export_book = scope.$t('EXPORT_BOOK')
      })
    },
    toggleFeedbacks: function () {
      let scope = this
      scope.show_feedbacks = !scope.show_feedbacks
    },
    formatDate: function (data) {
      return moment(data.created_at).calendar()
    },
    openFeedback: function (feedback) {
      if (!feedback.show_replies) {
        this.$set(feedback, 'show_replies', true)
      } else {
        this.$set(feedback, 'show_replies', false)
      }
    },
    expandFeedbackContent: function (feedback) {
      if (!feedback.expand_content) {
        this.$set(feedback, 'expand_content', true)
      } else {
        this.$set(feedback, 'expand_content', false)
      }
    },
    loadFeedbacks: function () {
      var scope = this
      scope.axios.get('http://localhost:3000/feedbacks/book/' + scope.properties.uuid)
        .then(function (response) {
          scope.feedbacks = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
        .finally(function () {
        // always executed
        })
    },
    isVisible: function (feedback) {
      var scope = this
      return (feedback.message !== null) && ((scope.filter === 'all') || (scope.filter === 'done' && feedback.is_done) || (scope.filter === 'undone' && !feedback.is_done))
    },
    saveFeedback: function () {
      var scope = this
      if (scope.message === '') {
        return
      }

      let feedback = {
        author_id: scope.$store.getters.getAuthorID,
        parent_id: scope.properties.uuid,
        parent: 'book',
        is_done: 0,
        message: scope.message
      }

      scope.axios
        .post('http://localhost:3000/feedbacks', feedback)
        .then(response => {
          if (response.data) {
            scope.message = ''
            scope.feedbacks.push(response.data)
          }
        })
    },
    sendReply: function (feedback) {
      var scope = this
      if (!feedback.reponse_text || feedback.reponse_text === '') {
        return
      }

      let data = {
        author_id: scope.$store.getters.getAuthorID,
        feedback_id: feedback.uuid,
        message: feedback.reponse_text
      }

      scope.axios
        .post('http://localhost:3000/feedback-responses', data)
        .then(response => {
          if (response.data) {
            scope.$set(feedback, 'reponse_text', '')
            feedback.feedback_responses.push(response.data)
          }
        })
    },
    toggleMark: function (feedback) {
      var scope = this
      scope.axios
        .post('http://localhost:3000/feedbacks/update-status', { uuid: feedback.uuid, is_done: feedback.is_done })
        .then(response => {
          if (response.data) {
            feedback.is_done = !feedback.is_done
          }
        })
    },
    toggleSeen: function (feedback) {
      var scope = this
      scope.axios
        .post('http://localhost:3000/feedbacks/seen', { uuid: feedback.uuid, is_seen: feedback.is_seen })
        .then(response => {
          if (response.data) {
            feedback.is_seen = !feedback.is_seen
          }
        })
    }

  },
  mounted () {
    var scope = this
    scope.page.title = scope.properties.title
    scope.page.data = scope.properties
    scope.page.is_ready = true
    scope.loadFeedbacks()

    ipcRenderer.on('SET-EXPORT-BOOK-BUTTON-ENABLE', function (event, data) {
      scope.$store.commit('exportBookStatusClose')
    })
  }
}

ipcRenderer.on('GET-DOCX-CONTENT-MULTI-CHAPTERS-2', function (event, data) {
  let chapters = []
  let wholeChapter = []

  const contents = window.$.parseHTML(data.html)

  window.$.each(contents, function (i, node) {
    const outerHtml = window.$(node).get(0).outerHTML
    if (window.$.inArray(node.nodeName.toLowerCase(), ['h1']) > -1) {
      chapters.push({title: window.$(node).get(0).innerHTML, fileContent: ''})
      return true
    }

    if (chapters[chapters.length - 1] !== undefined) {
      // exclude element with &nbsp; content
      if (window.$(node).html() === '&nbsp;' || window.$(node).is(':empty') || window.$(node).html() === '<br>') {
        return true
      }
      // concat all element outerHtml/text after h1
      chapters[chapters.length - 1]['fileContent'] += outerHtml
    }
  })

  for (var i = 0; i < chapters.length; i++) {
    wholeChapter.push({book_id: data.book.uuid, title: chapters[i].title, chapter_version: {content: chapters[i].fileContent}})
    axios
      .post('http://localhost:3000/chapters', wholeChapter[i])
      .then(response => {
        if (response.data) {
        }
      })
  }

  wholeChapter = []

  window.swal.fire({
    position: 'center',
    icon: 'success',
    title: window.vm.$t('CHAPTERS') + ' ' + window.vm.$t('SUCCESSFULY_IMPORTED'),
    showConfirmButton: false,
    timer: 1500
  })
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.book-stats { padding-left:30px; }
.book-stats .heading { font-family:'Gotham Bold'; }
.book-stats ul { margin-top:5px; }
.book-genre { padding:3px 10px; font-size:12px; font-size:10px; font-family:'Crimson Roman Bold'; text-transform: uppercase; margin-right: 3px; }
.book-genre:nth-child(odd) { background:#e1e7fe; color:#9098c5; }
.book-genre:nth-child(even) { background:#feedda; color:#d6a67f; }

.es-page-head {
  height: 110px;
}

@media only screen and (max-width: 968px) {
  .book-stats { display:none; }
}

.feedback-wrap  { height: 520px;}
.feedback-wrap .feedbacks { position:relative; height:100%;}
.feedback-wrap .feedbacks .head {  position:relative; height:35px; line-height:35px; padding:0px 10px; background:#fff; border-bottom:1px solid #ccc; }
.feedback-wrap .feedbacks .body { height:calc(100% - 125px); overflow-y:auto; background:#fff; }
.feedback-wrap .feedbacks .body .feedback-single { background:#fafafa; border-bottom:1px solid #ccc; padding:0px 0px; padding-top:5px; }
.feedback-wrap .feedbacks .body .feedback-single.seen { background:#fff; }
.feedback-wrap .feedbacks .body .feedback-single.done { background:#d3eed8 !important; }
.feedback-wrap .feedbacks .body .feedback-single .date { margin:0px; font-size:11px; color:#888; float:right; }
.feedback-wrap .feedbacks .body .feedback-single .message { margin:0px; font-style:italic;}
.feedback-wrap .feedbacks .foot { background:#fff; position:absolute; bottom:0px; left:0px; width:100%; height:90px; border-top:1px solid #ccc; padding:8px 5px; }
.feedback-wrap .feedbacks .foot  textarea { width:100%; padding:5px; font-size:12px; }
.feedback-wrap .feedbacks .foot  button { float:right; }

.feedback-single .feedback-single-header { padding:5px 15px; }
.feedback-single .feedback-single-content-wrap { cursor:pointer; padding:5px 15px; max-height:70px; overflow:hidden; margin-bottom:10px; }
.feedback-single .feedback-single-content-wrap.open { max-height: none !important; }

.feedback-single .feedback-single-replies-wrap { background:#efefef; }
.feedback-single .feedback-single-replies-wrap .feedback-single-replies-header { border-bottom:1px solid #ccc; padding:5px 10px; text-align:right; font-size:12px; }
.feedback-single .feedback-single-replies-wrap .feedback-single-replies-header span { cursor:pointer; }
.feedback-single .feedback-single-replies-wrap .feedback-single-replies { padding:5px 10px; text-align:left; font-size:12px; display:none; }
.feedback-single .feedback-single-replies-wrap.open .feedback-single-replies { display:block; }
.feedback-single .feedback-single-replies-wrap .feedback-single-replies-content { cursor:pointer; max-height:75px; overflow:hidden; margin-bottom:10px; }
.feedback-single .feedback-single-replies-wrap .feedback-single-replies-content.open { max-height:none !important;  }

</style>
