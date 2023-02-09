<template>
<div class="feedback-wrap" v-bind:class="{ 'feedback-wrap-fullview' : !properties.toggleType }">
  <div class="es-panel-2 feedbacks">
    <div class="es-panel-head d-flex justify-content-between">
      <div class="d-flex algin-items-center"><h5>Feedbacks</h5></div>
      <div class="d-flex">
        <select v-model="filter" v-if="$store.getters.getAuthorID === properties.book.author_id" class="select-feedback-view">
          <option value="all">All</option>
          <option value="done">Done</option>
          <option value="undone">Undone</option>
        </select>
        <a @click="$parent.toggleFeedbacks()" href="javascript:void(0);" class="btn-close-feedback close"><i class="las la-arrow-circle-right"></i></a>
      </div>
    </div>
    <div class="es-panel-body p-0 rounded-0" id="custom-scrollbar">
      <div v-if="feedbacks.length">
        <template @click="openFeedback(feedback)" v-for="feedback in feedbacks" >
          <div :key="feedback.id"  v-if="isVisible(feedback)" v-bind:class="{'done' : feedback.is_done, 'seen' : feedback.is_seen }" class="feedback-single">
            <div class="feedback-single-header">
              <div class="left">
                <a class="es-avatar mr-2" href="javascript:void(0);">
                  <i class="las la-user"></i>
                </a>
              </div>
              <div class="right w-100">
                <div class="d-flex justify-content-between">
                  <div v-if="properties.toggleType" class="d-flex align-items-center mb-1">
                    <a class="es-avatar" style="margin-right: 6px;" href="javascript:void(0);"><i class="las la-user"></i></a>
                      <strong v-if="feedback.author.alias">{{ feedback.author.alias }}</strong>
                      <!--<strong v-else>{{ feedback.author.first_name }} {{ feedback.author.last_name }}</strong>-->
                      <strong v-else>{{ $t('Anonymous') }}</strong>
                  </div>
                  <strong v-else class="author">
                      <span v-if="feedback.author.alias">{{ feedback.author.alias }}</span>
                      <!--<span v-else>{{ feedback.author.first_name }} {{ feedback.author.last_name }}</span>-->
                      <strong v-else>{{ $t('Anonymous') }}</strong>
                  </strong>

                  <span class="date">{{ formatDate(feedback) }}</span>
                </div>

                <div class="feedback-single-content-wrap" v-bind:class="{ 'open' : feedback.expand_content }">
                  <p @click="expandFeedbackContent(feedback)" class="message" v-bind:class="{ 'ellipsis-3' : !feedback.expand_content }" v-html="feedback.message"></p>
                </div>

                <div class="feedback-single-replies-header">

                  <div v-if="properties.toggleType" class="d-flex">
                    <div class="d-flex"><a @click="openFeedback(feedback)" class="btn-feedback-option" href="javascript:void(0);"><i class="las la-reply"></i> {{ feedback.feedback_responses.length }} Replies</a></div>
                    <div class="d-flex" v-if="$store.getters.getAuthorID === feedback.author_id">
                      <a @click="modifyFeedbackContent(feedback)" class="btn-feedback-option" href="javascript:void(0);"><i class="las la-pencil-alt"></i></a>
                      <a @click="deleteFeedbackContent(feedback)" class="btn-feedback-option" href="javascript:void(0);"><i class="las la-trash-alt"></i></a>
                    </div>
                  </div>
                  <div v-else class="d-flex">
                    <div class="d-flex"><a @click="openFeedback(feedback)" class="btn-feedback-option" href="javascript:void(0);"><i class="las la-reply"></i> {{ feedback.feedback_responses.length }} Replies</a></div>
                    <div class="d-flex" v-if="$store.getters.getAuthorID === feedback.author_id">
                      <a @click="modifyFeedbackContent(feedback)" class="btn-feedback-option" href="javascript:void(0);"><i class="las la-pencil-alt" style="margin-right: 2px;"></i>{{$t('EDIT')}}</a>
                      <a @click="deleteFeedbackContent(feedback)" class="btn-feedback-option" href="javascript:void(0);"><i class="las la-trash-alt" style="margin-right: 1px;"></i>{{$t('DELETE')}}</a>
                    </div>
                  </div>

                  <div class="d-flex" v-if="$store.getters.getAuthorID === properties.book.author_id">
                    <a @click="toggleMark(feedback)" v-if="!feedback.is_done" class="btn-feedback-marks mr-1" href="javascript:void(0);"><i class="las la-check-circle mr-1"></i> Mark as Done</a>
                    <a @click="toggleMark(feedback)" v-else class="btn-feedback-marks done mr-1" href="javascript:void(0);"><i class="las la-times-circle mr-1"></i> Mark Undone</a>

                    <a @click="toggleSeen(feedback)" v-if="!feedback.is_seen" class="btn-feedback-marks" href="javascript:void(0);"><i class="las la-eye mr-1"></i> Mark as Seen</a>
                    <a @click="toggleSeen(feedback)" v-else class="btn-feedback-marks seen" href="javascript:void(0);"><i class="las la-eye-slash mr-1"></i> Mark Unseen</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="feedback-single-replies-wrap" v-bind:class="{ 'open' : feedback.show_replies }">
            <div class="feedback-single-replies">
              <div v-if="feedback.feedback_responses.length > 0">
                <div v-for="response in feedback.feedback_responses" :key="response.uuid" class="response-single">
                  <div class="feedback-single-replies-content" v-bind:class="{ 'open' : response.expand_content }">
                    <div class="d-flex justify-content-between">
                      <div class="d-flex align-items-center mb-1">
                        <a class="es-avatar" style="margin-right: 6px;" href="javascript:void(0);"><i class="las la-user"></i></a>
                        <strong v-if="response.author.alias">{{ response.author.alias }}</strong>
                        <strong v-else>{{ $t('Anonymous') }}</strong>
                      </div>
                      <span class="date">{{ formatDate(response) }}</span>
                    </div>
                    <p @click="expandFeedbackResponseContent(response)" class="message"  v-bind:class="{ 'ellipsis-3' : !response.expand_content }"  v-html="response.message"></p>
                  </div>
                  <div v-if="$store.getters.getAuthorID === response.author_id" class="d-flex">
                    <a @click="modifyFeedbackResponseContent(feedback, response)" class="btn-feedback-option" href="javascript:void(0);"><i class="las la-pencil-alt"></i>{{$t('EDIT')}}</a>
                    <a @click="deleteFeedbackResponseContent(response)" class="btn-feedback-option" href="javascript:void(0);"><i class="las la-trash-alt"></i>{{$t('DELETE')}}</a>
                  </div>
                </div>
              </div>
              <div v-else class="no-response-wrap">
                <div class="no-response">
                  <i class="las la-comment-slash"></i> No response for this feedback yet.
                </div>
              </div>
              <div class="p-15px">
                <form v-on:submit.prevent="sendReply(feedback)" class="textarea-wrap">
                  <textarea style="width:100%;" type="text" v-model="feedback.reponse_text" placeholder="Write a reply.."></textarea>
                  <button v-if="feedback_responses_uuid != null" type="submit" class="send-icon"><i class="las la-paper-plane"></i></button>
                  <button v-else type="submit" class="send-icon"><i class="las la-paper-plane"></i></button>
                </form>
              </div>
            </div>
          </div>
        </div>
        </template>
      </div>
      <div v-else class="no-feedbacks-wrap">
        <div class="no-feedbacks">
          <i class="las la-comment-slash"></i> There are no feedbacks yet.
        </div>
      </div>
    </div>
    <div class="foot">
      <div class="textarea-wrap">
        <textarea type="text" v-model="message" placeholder="Write your feedback here.."></textarea>
        <a v-if="feedback_uuid != null" @click="saveFeedback()" class="send-icon" href="javascript:void(0);"><i class="las la-paper-plane"></i></a>
        <a v-else @click="saveFeedback()" href="javascript:void(0);" class="send-icon"><i class="las la-paper-plane"></i></a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// In renderer process (web page).
import moment from 'moment'

export default {
  name: 'Feedback',
  props: ['properties'],
  data () {
    return {
      filter: 'all',
      feedbacks: null,
      selected: false,
      message: '',
      response: '',
      feedback_uuid: null,
      feedback_responses_uuid: null
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    initFeedbacks: function () {
      var scope = this
      scope.axios.get('http://localhost:3000/feedbacks/' + scope.properties.parent_name + '/' + scope.properties.parent.uuid)
        .then(function (response) {
          scope.feedbacks = response.data
          console.log(scope.feedbacks)
        })
        .catch(function (error) {
          console.log(error)
        })
        .finally(function () {
          // always executed
        })
    },
    modifyFeedbackContent: function (feedback) {
      var scope = this
      scope.message = feedback.message
      scope.feedback_uuid = feedback.uuid
    },
    deleteFeedbackContent: function (feedback) {
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
            .delete('http://localhost:3000/feedbacks/' + feedback.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.initFeedbacks()
                })
              }
            })
        }
      })
    },
    modifyFeedbackResponseContent: function (feedback, response) {
      var scope = this
      scope.$set(feedback, 'reponse_text', response.message)
      scope.feedback_responses_uuid = response.uuid
    },
    deleteFeedbackResponseContent: function (response) {
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
            .delete('http://localhost:3000/feedback-responses/' + response.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.initFeedbacks()
                })
              }
            })
        }
      })
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
    expandFeedbackResponseContent: function (response) {
      if (!response.expand_content) {
        this.$set(response, 'expand_content', true)
      } else {
        this.$set(response, 'expand_content', false)
      }
    },
    closeFeedback: function () {
      let scope = this
      scope.selected = false
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
        uuid: scope.feedback_uuid,
        author_id: scope.$store.getters.getAuthorID,
        parent_id: scope.properties.parent.uuid,
        parent: scope.properties.parent_name,
        is_done: 0,
        message: scope.message
      }

      scope.axios
        .post('http://localhost:3000/feedbacks', feedback)
        .then(response => {
          if (response.data) {
            if (scope.feedback_uuid === null) {
              scope.feedbacks.push(response.data)
            } else {
              for (var key in scope.feedbacks) {
                if (scope.feedbacks[key].uuid === feedback.uuid) {
                  scope.feedbacks[key].message = feedback.message
                }
              }
            }
            scope.message = ''
            scope.feedback_uuid = null
            // scope.initFeedbacks()
          }
        })
    },
    sendReply: function (feedback) {
      var scope = this
      if (!feedback.reponse_text || feedback.reponse_text === '') {
        return
      }

      let data = {
        uuid: scope.feedback_responses_uuid,
        author_id: scope.$store.getters.getAuthorID,
        feedback_id: feedback.uuid,
        message: feedback.reponse_text
      }

      scope.axios
        .post('http://localhost:3000/feedback-responses', data)
        .then(response => {
          if (response.data) {
            if (scope.feedback_responses_uuid === null) {
              feedback.feedback_responses.push(response.data)
            } else {
              for (var key in scope.feedbacks) {
                for (var responsekey in scope.feedbacks[key].feedback_responses) {
                  if (scope.feedbacks[key].feedback_responses[responsekey].uuid === data.uuid) {
                    scope.feedbacks[key].feedback_responses[responsekey].message = data.message
                  }
                }
              }
            }
            scope.$set(feedback, 'reponse_text', '')
            scope.feedback_responses_uuid = null
            // scope.initFeedbacks()
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
    scope.initFeedbacks()
  }
}
</script>
