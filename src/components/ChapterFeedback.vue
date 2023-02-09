<template>
<div>
    <div class="chapter-feedback-wrap">
      <div class="feedbacks">
        <div class="head">
          Feedbacks
          <select v-model="filter" style="margin-top:5px; float:right;">
            <option value="all">All</option>
            <option value="done">Done</option>
            <option value="undone">Undone</option>
          </select>
        </div>
        <div class="body">
          <div @click="openFeedback(feedback)" v-for="feedback in feedbacks" :key="feedback.id"  v-if="(feedback.type === 'post' && feedback.message !== null) && ((filter === 'all') || (filter === 'done' && feedback.mark_as_finished) || (filter === 'undone' && !feedback.mark_as_finished))" v-bind:class="{'done' : feedback.mark_as_finished}" class="ellipsis-3 feedback-single">
            <strong class="author" v-if="$store.getters.getAuthorID === feedback.from">{{ $store.getters.getAuthorFullName }}</strong>
            <strong class="author" v-else>Reader</strong>
            <span class="date">Wed, Jan 01, 2020</span>
            <p class="message" v-html="feedback.message"></p>
          </div>
        </div>
        <div class="foot">
          <textarea  type="text" v-model="message"></textarea>
          <button @click="saveFeedback()" class="es-button-white">Submit</button>
        </div>
      </div>
    </div>
    <div v-if="selected" class="chapter-feedback-responses-wrap">
    <div class="inner">
      <div class="head">
        <div class="author">
          <strong v-if="$store.getters.getAuthorID === selected.from">{{ $store.getters.getAuthorFullName }}</strong>
          <strong v-else>Reader</strong>
          <span @click="closeFeedback()" class="closer"><i class="las la-times"></i></span>
        </div>
        <div v-if="properties.book.author_id === $store.getters.getAuthorID" @click="toggleMark(selected)" class="status" v-bind:class="{'done' : selected.mark_as_finished}">
          <span v-if="selected.mark_as_finished"><i class="las la-check"></i> Mark as Undone</span>
          <span v-else> Mark as Done</span>
        </div>
      </div>
      <div class="body" v-html="selected.message"></div>
      <div class="response-header">Responses</div>
      <div class="response-list">
          <div v-for="response in selected.chapter_feedback_responses" :key="response.uuid" class="response-single">
            <strong v-if="$store.getters.getAuthorID === response.from">{{ $store.getters.getAuthorFullName }}</strong>
            <strong v-else>Reader</strong>
            <p style="margin:0px;" v-html="response.message"></p>
          </div>
      </div>
      <div class="foot">
          <textarea style="width:100%;" type="text" v-model="response"></textarea>
          <button @click="saveResponse(selected)" class="es-button-white">Submit</button>
        </div>
    </div>
    </div>
</div>
</template>

<script>
// In renderer process (web page).
export default {
  name: 'ChapterFeedback',
  props: ['properties'],
  data () {
    return {
      filter: 'all',
      feedbacks: null,
      selected: false,
      message: '',
      response: ''
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    openFeedback: function (feedback) {
      let scope = this
      scope.selected = feedback
    },
    closeFeedback: function () {
      let scope = this
      scope.selected = false
    },
    saveFeedback: function () {
      var scope = this
      if (scope.message === '') {
        return
      }
      let feedback = {
        from: scope.$store.getters.getAuthorID,
        to: scope.properties.book.author_id,
        chapter_id: scope.properties.chapter.uuid,
        chapter_version_id: scope.$store.getters.getChapterVersionUUID(scope.properties.chapter.uuid),
        mark: 'unmarked',
        published: 1,
        type: 'post',
        mark_as_finished: 0,
        message: scope.message,
        general_comment: null,
        book_chapter_comment: null
      }

      scope.axios
        .post('http://localhost:3000/chapter-feedbacks', feedback)
        .then(response => {
          if (response.data) {
            scope.message = ''
            scope.feedbacks.push(response.data)
          }
        })
    },
    saveResponse: function (feedback) {
      var scope = this
      if (scope.response === '') {
        return
      }

      let data = {
        from: scope.$store.getters.getAuthorID,
        chapter_feedback_id: feedback.uuid,
        message: scope.response
      }

      scope.axios
        .post('http://localhost:3000/chapter-feedback-responses', data)
        .then(response => {
          if (response.data) {
            scope.response = ''
            feedback.chapter_feedback_responses.push(response.data)
          }
        })
    },
    toggleMark: function (feedback) {
      var scope = this
      scope.axios
        .post('http://localhost:3000/chapter-feedbacks/update-status', { uuid: feedback.uuid, finished: feedback.mark_as_finished })
        .then(response => {
          if (response.data) {
            feedback.mark_as_finished = !feedback.mark_as_finished
          }
        })
    }
  },
  mounted () {
    var scope = this
    scope.axios.get('http://localhost:3000/chapter-feedbacks/' + scope.properties.chapter.uuid)
      .then(function (response) {
        scope.feedbacks = response.data
        // console.log(scope.feedbacks)
      })
      .catch(function (error) {
        console.log(error)
      })
      .finally(function () {
        // always executed
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .chapter-feedback-wrap { position:absolute; top:0px; right:0px; z-index:9999; height:100%; overflow-y:auto; border-left:1px solid #ccc; background:#efefef; z-index:3000; width:300px; }
  .chapter-feedback-wrap .feedbacks { position:relative; height:100%;}
  .chapter-feedback-wrap .feedbacks .head { height:35px; line-height:35px; padding:0px 10px; background:#fff; border-bottom:1px solid #ccc; }
  .chapter-feedback-wrap .feedbacks .body { height:calc(100% - 125px); overflow-y:auto; }
  .chapter-feedback-wrap .feedbacks .body .feedback-single { cursor:pointer; background:#fff; border-bottom:1px solid #ccc; padding:5px 10px; }
  .chapter-feedback-wrap .feedbacks .body .feedback-single.done { background:#d3eed8; }
  .chapter-feedback-wrap .feedbacks .body .feedback-single .date { margin:0px; font-size:11px; color:#888; float:right; }
  .chapter-feedback-wrap .feedbacks .body .feedback-single .message { margin:0px; font-style:italic;}
  .chapter-feedback-wrap .feedbacks .foot { background:#fff; position:absolute; bottom:0px; left:0px; width:100%; height:90px; border-top:1px solid #ccc; padding:8px 5px; }
  .chapter-feedback-wrap .feedbacks .foot  textarea { width:100%; padding:5px; font-size:12px; }
  .chapter-feedback-wrap .feedbacks .foot  button { float:right; }

  .chapter-feedback-responses-wrap { position:absolute; top:0px; right:300px; z-index:9999; height:100%; overflow-y:auto; border-left:1px solid #ccc; background:#fff; z-index:3000; width:400px;}
  .chapter-feedback-responses-wrap .head { padding:5px 10px; font-size:18px; font-weight:900; border-bottom:1px solid #ccc; height:65px; }
  .chapter-feedback-responses-wrap .head .closer { float:right; background:#922c39; color:#fff; padding:2px 5px; padding-top:3px; cursor:pointer; font-size:12px; }
  .chapter-feedback-responses-wrap .head .status { display:inline-block; margin:0px; font-size:12px; color:#555; background:#efefef; padding:5px 8px; cursor:pointer; }
  .chapter-feedback-responses-wrap .head .status.done { background:#d3eed8; }
  .chapter-feedback-responses-wrap .body { padding:5px 10px; height:200px; overflow-y:auto; border-bottom:1px solid #ccc; }

  .chapter-feedback-responses-wrap .inner { position:relative; height:100%; }
  .chapter-feedback-responses-wrap .inner .response-header { border-bottom:1px solid #ccc; height:28px; line-height:28px; padding:0px 5px; }
  .chapter-feedback-responses-wrap .inner .response-list  { background:#efefef; position:relative; height:calc(100% - 385px); overflow-y:auto; }
  .chapter-feedback-responses-wrap .inner .response-list  .response-single { color:#000; padding:5px 8px;  width:100%; background:#fff; border-bottom:1px solid #ccc;  }
  .chapter-feedback-responses-wrap .inner .response-list  .response-single p { margin:0px; font-style:italic;}

  .chapter-feedback-responses-wrap .foot { position:absolute; background:#fff; bottom:0px; left:0px; width:100%; height:90px; padding:5px; border-top:1px solid #ccc; }
  .chapter-feedback-responses-wrap .foot  button { float:right; }
</style>
