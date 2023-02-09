<template>
<div class="assignment-form">
  <div class="b-overlay" v-if="show_form">
    <b-container class="bv-example-row" v-bind:class="{is_file: manuscript.is_file == 1}">
      <b-card-group deck>
        <b-card>
          <template v-slot:header>
            <h6 class="mb-0 card-title">{{ $t('UPLOAD_SCRIPT_FOR') + ' ' + assignment.title  }}</h6>
            <a href="javascript:;" ref="close-assignment-form" class="close" v-on:click="emitToParent">
              <i class="fa fa-times"></i>
            </a>
          </template>

          <b-row>
            <b-col>
              <b-row style="margin-bottom: 1rem;" class="text-left">
                <b-col>
                  <b-form-checkbox
                    id="checkbox-1"
                    v-model="manuscript.is_file"
                    @change="logging"
                    name="checkbox-1"
                    value="0"
                    unchecked-value="1"
                  >
                    {{ $t('WRITE_ASSIGNMENT') }}
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-show="manuscript.is_file==1" style="margin-bottom: 1rem;" class="text-left">
                <b-col>
                  <b-form>
                    <label>{{$t('APPROVE_FILE_FORMATS_ARE')}} DOC, DOCX og ODT: </label>
                    <b-form-file
                      v-model="file"
                      :state="feedback.file.state"
                      @change="file.is_change=true"
                      aria-describedby="input-live-help input-file-feedback"
                      id="file-default"
                      accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                    </b-form-file>
                    <!-- This will only be shown if the preceding input has an invalid state -->
                    <b-form-invalid-feedback :state="feedback.file.state">
                      {{ feedback.file.message }}
                    </b-form-invalid-feedback>
                  </b-form>
                </b-col>
              </b-row>
              <b-row v-show="manuscript.is_file==0" style="margin-bottom: 1rem;" class="text-left">
                <b-col>
                  <label>{{$t('CONTENT')}}: </label>
                  <tiny-editor :initValue="manuscript.content"
                               v-on:getEditorContent="setContent"
                               class="form-control"
                  />
                </b-col>
              </b-row>
              <b-row style="margin-bottom: 1rem;" class="text-left">
                <b-col>
                  <label>{{$t('GENRE')}}: </label>
                  <b-form-select v-model="selected_genre"
                                 id="input-genre"
                                 :options="book_genres"
                                 value-field="uuid"
                                 :state="feedback.genre.state"
                                 aria-describedby="input-live-help input-live-feedback"
                                 text-field="name">
                    <template v-slot:first>
                      <b-form-select-option :value="null" disabled>{{ $t('SELECT_GENRE') }}</b-form-select-option>
                    </template>
                  </b-form-select>
                  <!-- This will only be shown if the preceding input has an invalid state -->
                  <b-form-invalid-feedback id="input-genre-feedback">
                    {{ feedback.genre.message }}
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
              <b-row style="margin-bottom: 1rem;" class="text-left">
                <b-col>
                  <b-form-group :label="$t('WHERE_IN_THE_SCRIPT') + ':'">
                    <b-form-radio v-model="manuscript.where_in_script" name="some-radios" value="whole">{{ $t('WHOLE') }}</b-form-radio>
                    <b-form-radio v-model="manuscript.where_in_script" name="some-radios" value="start">{{ $t('START') }}</b-form-radio>
                    <b-form-radio v-model="manuscript.where_in_script" name="some-radios" value="middle">{{ $t('MIDDLE') }}</b-form-radio>
                    <b-form-radio v-model="manuscript.where_in_script" name="some-radios" value="end">{{ $t('END') }}</b-form-radio>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row style="margin-bottom: 1rem;" class="text-left">
                <b-col>
                  <label style="display: block">{{$t('DO_YOU_WANT_TO_GIVE_AND_RECEIVE_FEEDBACK_FROM_OTHER_STUDENTS')}}? </label>
                  <toggle-button :color="'#337ab7'"
                                 :labels="{checked: $t('YES'), unchecked: $t('NO')}" v-model="join_group"
                                 :width="70" :height="30" :font-size="16"
                                 sync=""/>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <template v-slot:footer>
            <div class="text-right">
              <b-button
                variant="primary"
                class="btn btn-dark"
                @click="uploadFile">
                <span>{{ $t('UPLOAD') }}</span>
              </b-button>
            </div>
          </template>
        </b-card>
      </b-card-group>
    </b-container>
  </div>
</div>
</template>

<script>
import Feedback from '../../../components/Feedback'
import TinyMCE from '../../../components/TinyMCE'

export default {
  name: 'assignment-form',
  props: {
    book_genres: {},
    show_form: false
  },
  data: function () {
    return {
      assignment: {},
      manuscript: {
        id: null,
        assignment_id: '',
        user_id: '',
        content: '',
        where_in_script: 'whole',
        is_file: 1,
        genre: null,
        editor_id: 0,
        has_feedback: 0,
        join_group: 0,
        words: 0
      },
      // Feedback are for storing error message
      feedback: {
        genre: {
          state: null,
          message: null
        },
        file: {
          state: null,
          message: null,
          is_change: null
        }
      },
      join_group: false,
      tempContent: '',
      show_feedbacks: false,
      file: [],
      selected_genre: ''
    }
  },
  components: {
    TinyMCE,
    Feedback
  },
  methods: {
    logging () {
      // var scope = this
      // console.log(scope.manuscript.is_file)
    },
    // Required for geting value from TinyMCE content
    setContent (value) {
      var scope = this
      scope.tempContent = value
      scope.manuscript.words = scope.WORD_COUNT(value)
    },
    emitToParent (event) {
      var scope = this
      scope.$emit('getIsFormShow', {
        show_form: !scope.show_form,
        manuscript: scope.manuscript
      })
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
      scope.setAll(scope.feedback.genre, null)
      scope.setAll(scope.feedback.file, null)
    },
    validate () {
      var scope = this
      var isValid = true

      scope.setFeedbackNull()

      if (!scope.manuscript.genre) {
        scope.feedback.genre.message = this.$t('GENRE_IS_REQUIRED')
        scope.feedback.genre.state = false
        isValid = false
      }

      if (scope.manuscript.is_file && scope.file) {
        if (scope.file.length < 1) {
          scope.feedback.file.message = scope.$tc('FILE_IS_REQUIRED')
          scope.feedback.file.state = false
          isValid = false
        } else if (scope.file.size < 1) {
          scope.feedback.file.message = scope.$tc('FILE_IS_EMPTY')
          scope.feedback.file.state = false
          isValid = false
        } else {
          let validFileTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text']
          if (scope.file && !validFileTypes.includes(scope.file['type'])) {
            scope.file = []
            scope.feedback.file.message = scope.$t('APPROVE_FILE_FORMATS_ARE') + '.doc, .docx, .odt' + scope.$tc('ALLOWED')
            scope.feedback.file.state = false
            isValid = false
          }
        }
      }

      return isValid
    },
    displayFile: function () {
      var scope = this

      let validFileTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text']

      if (!validFileTypes.includes(scope.file['type'])) {
        scope.file = []
        window.swal.fire({
          position: 'center',
          icon: 'error',
          title: scope.$tc('Uploading Failed!'),
          text: scope.$t('APPROVE_FILE_FORMATS_ARE') + '.doc, .docx, .odt' + scope.$tc('ALLOWED'),
          showConfirmButton: false,
          timer: 3000
        })
      }
    },
    uploadFile () {
      var scope = this

      scope.manuscript.join_group = (scope.join_group) ? 1 : 0
      scope.manuscript.is_file = parseInt(scope.manuscript.is_file)
      scope.manuscript.genre = scope.selected_genre

      if (!scope.validate()) {
        return false
      }

      if (scope.manuscript.is_file === 1) {
        let formData = new FormData()
        formData.append('single-file', scope.file)

        scope.axios
          .post('http://localhost:3000/upload/assignment-manuscripts/file', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            scope.manuscript.content = response.data.file.name
            scope.saveManuscript()
          }).catch(function () {
            console.log('FAILURE!!')
          })
      } else {
        scope.saveManuscript()
      }
    },
    saveManuscript () {
      let scope = this

      if (!scope.manuscript.is_file) {
        scope.manuscript.content = scope.tempContent
      }
      scope.validate()
      scope.axios
        .post('http://localhost:3000/assignment-manuscripts', scope.manuscript)
        .then(response => {
          if (response.data) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('ASSIGNMENT_SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.$set(scope, 'manuscript', response.data)
              scope.$set(scope, 'tempContent', scope.manuscript.content)
            }).then(() => {
              scope.$refs['close-assignment-form'].click()
            })
          }
        })
    },
    loadManuscript: function (assignment) {
      let scope = this
      scope.setFeedbackNull()
      scope.manuscript = {
        id: null,
        assignment_id: '',
        user_id: '',
        content: '',
        where_in_script: 'whole',
        is_file: 1,
        genre: null,
        editor_id: 0,
        has_feedback: 0,
        join_group: 0,
        words: 0
      }
      scope.file = []
      scope.$set(scope.manuscript, 'assignment_id', assignment.uuid)
      scope.$set(scope.manuscript, 'user_id', scope.$store.getters.getUserID)

      if ('assignment_manuscript' in assignment) {
        scope.$set(scope, 'manuscript', assignment.assignment_manuscript)
        scope.$set(scope, 'tempContent', scope.manuscript.content)
        scope.$set(scope, 'selected_genre', scope.manuscript.genre)
      }
    }
  },
  mounted () {
    let scope = this

    scope.$root.$on('loadManuscript', (assignment) => {
      scope.$set(scope, 'assignment', assignment)
      scope.loadManuscript(assignment)
    })
  }
  // beforeUpdate () {
  //   let scope = this
  //
  //   // only load data if the stored assignment_id is different to loaded assignment uuid
  //   if (scope.manuscript.assignment_id !== scope.assignment.uuid) {
  //     scope.loadManuscript()
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card-header { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: start; -ms-flex-align: start; align-items: flex-start; -webkit-box-pack: justify; -ms-flex-pack: justify; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #e9ecef; border-top-left-radius: .3rem; border-top-right-radius: .3rem; }
  .card-header .card-title { font-size: 1.25rem; margin-bottom: 0; line-height: 1.5; }
  .card-header .close { padding: 1rem; margin: -1rem -1rem -1rem auto; }

  .b-overlay {z-index: 1; position: fixed; top: 0; left: 0; bottom: 0; right: 0; overflow: auto; background-color: rgba(44, 46, 47, 0.9); }
  .bv-example-row { margin-top: 100px; margin-bottom: 70px; }
  .is_file { width: 50%!important; }
</style>
