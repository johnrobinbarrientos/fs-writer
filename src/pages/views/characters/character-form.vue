<template>
<div v-if="page.is_ready" class="page-character-form">
    <div class="es-page-head-2 mb-0">
        <div class="row-head">
            <div>
                <div  v-if="data.id != null">
                    <h4>{{$t('EDIT')}}: <strong>{{ data.fullname }}</strong></h4>
                    <small>{{$t('DATE_MODIFIED')}}: {{ data.updated_at }}</small>
                </div>
                <div v-else>
                    <h4>{{$t('CREATE_NEW_CHARACTER')}}</h4>
                </div>
            </div>
            <div class="book-panel-right">
                <button v-if="data.id != null" class="es-button btn-sm white" @click="uploadImage()">{{$t('SAVE_CHANGES')}}</button>
                <button v-else class="es-button btn-sm white" @click="uploadImage()">{{$t('SAVE')}}</button>
            </div>
        </div>
    </div>
    <!-- <div class="es-page-breadcrumbs">
        <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
        /
        <button @click="CHANGE_COMPONENT({tabKey: 'character-listing-' + book.uuid, tabComponent: 'character-listing', tabData: book, tabTitle: $t('CHARACTERS') + ' - ' + book.title})">{{ $t('CHARACTERS') }}</button>
        /
        <button class="current">
            <span v-if="character !== null">{{ data.fullname }}</span>
            <span v-else>{{$t('NEW_CHARACTER')}}</span>
        </button>
    </div> -->
    <div class="es-page-content">
        <ul class="es-breadcrumb">
            <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);"><span>{{ book.title }}</span></a></li>
            <li><a @click="CHANGE_COMPONENT({tabKey: 'character-listing-' + book.uuid, tabComponent: 'character-listing', tabData: book, tabTitle: $t('CHARACTERS') + ' - ' + book.title})" href="javascript:void(0);"><span>{{ $t('CHARACTERS') }}</span></a></li>
            <li><a href="javascript:void(0);" style="padding-right: 20px;">
                  <span v-if="character !== null">{{ data.fullname }}</span>
                  <span v-else>{{$t('NEW_CHARACTER')}}</span>
            </a></li>
        </ul>

        <div class="container">
            <div class="es-panel">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <input v-on:change="displayImage" ref="fileInput" type="file" class="single-picture-file" name="single-picture-file" accept=".png, .jpg, .jpeg">
                            <div @click="$refs.fileInput.click()" class="uploaded-file-preview">
                                <div v-if="picture_src == false" class="default-preview"><i class="fa fa-image"></i></div>

                                <div v-if="picture_src != false"><img :src="picture_src"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="input-fullname">{{$t('FULLNAME')}}: </label>
                                    <b-form-input
                                        id="input-fullname"
                                        v-model="data.fullname"
                                        :state="feedback.fullname.state"
                                        aria-describedby="input-live-help input-live-feedback"
                                        :placeholder="$t('FULLNAME')"
                                        @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)"
                                        trim
                                    ></b-form-input>
                                    <!-- This will only be shown if the preceding input has an invalid state -->
                                    <b-form-invalid-feedback id="input-itemname-feedback">
                                        {{ feedback.fullname.message }}
                                    </b-form-invalid-feedback>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>{{$t('SHORTNAME')}}: </label>
                                    <input @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)" v-model="data.shortname" type="text" class="form-control" :placeholder="$t('SHORTNAME')">
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>{{$t('NICKNAME')}}: </label>
                                    <input @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)" v-model.trim="data.nickname" type="text" class="form-control" :placeholder="$t('NICKNAME')">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>{{$t('OCCUPATION')}}: </label>
                            <input @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)" v-model="data.occupation" type="text" class="form-control" :placeholder="$t('OCCUPATION')">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="birthdate-datepicker">{{$t('BIRTHDATE')}}: </label>
                            <b-form-datepicker @context="onBirthdateContext" id="birthdate-datepicker" :placeholder="$t('NO_SELECTED_DATE')" v-model="data.birthdate" class="mb-2" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"></b-form-datepicker>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <b-tabs content-class="mt-3" active-nav-item-class="bg-dark text-white">
                                <b-tab :title="$t('DESCRIPTION')" active>
                                    <tiny-editor :initValue="data.description" v-on:getEditorContent="setDescription" class="form-control" />
                                </b-tab>
                                <b-tab :title="$t('BIO')">
                                    <tiny-editor :initValue="data.bio" v-on:getEditorContent="setBio" class="form-control" />
                                </b-tab>
                                <b-tab :title="$t('GOALS')">
                                    <tiny-editor :initValue="data.goals" v-on:getEditorContent="setGoals" class="form-control" />
                                </b-tab>
                            </b-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import TinyMCE from '../../../components/TinyMCE'

export default {
  name: 'chapter-form',
  props: ['properties'],
  data: function () {
    return {
      page: {
        is_ready: false
      },
      data: {
        id: null,
        uuid: null,
        book_id: null,
        shortname: '',
        fullname: '',
        nickname: '',
        occupation: '',
        description: '',
        bio: '',
        goals: '',
        birthdate: ''
      },
      picture_src: false,
      file: '',
      tempDescription: '',
      tempBio: '',
      tempGoals: '',
      tempBirthdate: '',
      feedback: {
        fullname: {
          state: null,
          message: null
        }
      }
    }
  },
  components: {
    TinyMCE
  },
  computed: {
    book: function () {
      return this.properties.book
    },
    character: function () {
      return this.properties.character
    }
  },
  methods: {
    // Required for geting value from TinyMCE content
    setDescription (value) {
      var scope = this
      scope.tempDescription = value

      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
    },
    setBio (value) {
      var scope = this
      scope.tempBio = value

      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
    },
    setGoals (value) {
      var scope = this
      scope.tempGoals = value

      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
    },
    onBirthdateContext: function (ctx) {
      var scope = this
      if (scope.tempBirthdate !== ctx.selectedYMD) {
        scope.tempBirthdate = ctx.selectedYMD
        scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      }
    },
    displayImage: function () {
      var scope = this
      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)

      let reader = new FileReader()

      scope.file = this.$refs.fileInput.files[0]

      let validImageTypes = ['image/gif', 'image/jpeg', 'image/png']

      if (!validImageTypes.includes(scope.file['type'])) {
        scope.file = ''
        window.swal.fire({
          position: 'center',
          icon: 'error',
          title: scope.$tc('Uploading Failed!'),
          text: scope.$t('APPROVE_FILE_FORMATS_ARE') + '.png, .jpg, .jpeg' + scope.$tc('ALLOWED'),
          showConfirmButton: false,
          timer: 3000
        })
      } else {
        reader.onload = function () {
          const image = new Image()
          image.src = reader.result.toString()
          image.setAttribute('width', '100%')
          scope.picture_src = image.src
          // window.$('.uploaded-file-preview').html(image)
        }
        reader.readAsDataURL(scope.file)
      }
    },
    uploadImage () {
      var scope = this

      if (scope.file) {
        let formData = new FormData()
        formData.append('single-picture-file', scope.file)

        scope.axios
          .post('http://localhost:3000/upload/characters/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            window.$('#character-details [name="picture"]').val(response.data.file.name)

            scope.data.picture = response.data.file.name
            scope.saveCharacter()
          }).catch(function () {
            console.log('FAILURE!!')
          })
      } else {
        scope.saveCharacter()
      }
    },
    setAll (obj, val) {
      Object.keys(obj).forEach(function (index) {
        obj[index] = val
      })
    },
    setFeedbackNull () {
      var scope = this
      scope.setAll(scope.feedback.fullname, null)
    },
    saveCharacter () {
      var scope = this
      var hasError = false

      scope.data.description = scope.tempDescription
      scope.data.bio = scope.tempBio
      scope.data.goals = scope.tempGoals

      // Clear all error in form
      scope.setFeedbackNull()

      if (!scope.data.fullname) {
        scope.feedback.fullname.message = this.$t('FULLNAME') + ' ' + this.$t('IS_REQUIRED')
        scope.feedback.fullname.state = false
        hasError = true
      }

      if (hasError) {
        return false
      }

      scope.axios
        .post('http://localhost:3000/characters', scope.data)
        .then(response => {
          if (response.data) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('CHARACTER') + ' ' + this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.UNMARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
              if (scope.data.uuid === null) {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateCharacterList', response.data)
                scope.CHANGE_COMPONENT({tabKey: 'character-form-' + response.data.uuid, tabComponent: 'character-form', tabData: { book: response.data.book, character: response.data }, tabTitle: this.$t('EDIT') + ' - ' + response.data.fullname, tabIndex: scope.$store.getters.getActiveTab})
              } else {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateCharacterList', response.data)
                scope.$store.dispatch('changeTabTitle', { key: 'character-form-' + response.data.uuid, title: this.$t('EDIT') + ' - ' + response.data.fullname })
              }

              // scope.loadCharacter({ character: response.data })
            })
          }
        })
    },
    loadCharacter (characterProp) {
      var scope = this
      let character = characterProp.character
      scope.data.shortname = character.shortname
      scope.data.fullname = character.fullname
      scope.data.nickname = character.nickname
      scope.data.occupation = character.occupation
      scope.data.description = character.description
      scope.data.bio = character.bio
      scope.data.goals = character.goals
      scope.data.birthdate = character.birthdate
      scope.tempBirthdate = character.birthdate

      scope.tempDescription = character.description
      scope.tempBio = character.bio
      scope.tempGoals = character.goals
      if (character.picture && scope.CHECK_VALID_IMAGE(character.picture)) {
        scope.$set(scope.data, 'picture', character.picture)
        scope.picture_src = character.picture_src
      } else {
        scope.picture_src = false
      }
    }
  },
  beforeMount () {
    var scope = this
    scope.data.book_id = scope.properties.book.uuid

    if (scope.properties.character) {
      scope.$set(scope.data, 'id', scope.properties.character.id)
      scope.$set(scope.data, 'uuid', scope.properties.character.uuid)
    }
  },
  async mounted () {
    const scope = this
    try {
      if (scope.data.uuid) {
        await scope.loadCharacter({character: scope.properties.character})
      }
    } finally {
      scope.page.is_ready = true
    }
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
</style>
