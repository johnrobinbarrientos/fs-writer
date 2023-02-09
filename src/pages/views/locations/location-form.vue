<template>
<div class="page-location-form">
    <div class="es-page-head-2 mb-0">
        <div class="row-head">
            <div>
                <div  v-if="data.id != null">
                    <h4>{{$t('EDIT')}}: <strong>{{ data.location }}</strong></h4>
                    <small>{{$t('DATE_MODIFIED')}}: {{ data.updated_at }}</small>
                </div>
                <div v-else>
                    <h4>{{$t('CREATE_NEW_LOCATION')}}</h4>
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
        <button @click="CHANGE_COMPONENT({tabKey: 'location-listing-' + book.uuid, tabComponent: 'location-listing', tabData: book, tabTitle: $t('LOCATIONS') + ' - ' + book.title})">{{ $t('LOCATIONS') }}</button>
        /
        <button class="current">
            <span v-if="location !== null">{{ location.location }}</span>
            <span v-else>New Location</span>
        </button>
    </div> -->
    <div class="es-page-content">
        <ul class="es-breadcrumb">
            <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);"><span>{{ book.title }}</span></a></li>
            <li><a @click="CHANGE_COMPONENT({tabKey: 'location-listing-' + book.uuid, tabComponent: 'location-listing', tabData: book, tabTitle: $t('LOCATIONS') + ' - ' + book.title})" href="javascript:void(0);"><span>{{ $t('LOCATIONS') }}</span></a></li>
            <li><a href="javascript:void(0);" style="padding-right: 20px;">
                <span v-if="location !== null">{{ location.location }}</span>
                <span v-else>New Location</span>
            </a></li>
        </ul>

        <div class="container">
            <div class="es-panel">
                <div class="row">
                    <div class="col-md-5">
                        <div class="form-group">
                            <input v-on:change="displayImage" ref="fileInput" type="file" class="single-picture-file" name="single-picture-file" accept=".png, .jpg, .jpeg">
                            <div @click="$refs.fileInput.click()" class="uploaded-file-preview">
                                <div v-if="picture_src"><img :src="picture_src"></div>
                                <div v-else class="default-preview"><i class="fa fa-image"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="input-title">{{$t('LOCATION')}}: </label>
                                    <b-form-input
                                        id="input-title"
                                        v-model="data.location"
                                        :state="feedback.location.state"
                                        aria-describedby="input-live-help input-live-feedback"
                                        :placeholder="$t('LOCATION')"
                                        @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)"
                                        trim
                                    ></b-form-input>
                                    <!-- This will only be shown if the preceding input has an invalid state -->
                                    <b-form-invalid-feedback id="input-title-feedback">
                                        {{ feedback.location.message }}
                                    </b-form-invalid-feedback>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>{{$t('AKA')}}: </label>
                                    <input @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)" v-model.trim="data.AKA" type="text" class="form-control" :placeholder="$t('AKA')">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>{{$t('TAGS')}}: </label>
                                    <input @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)" v-model="data.tags" type="text" class="form-control" :placeholder="$t('TAGS')">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label>{{$t('DESCRIPTION')}}: </label>
                            <tiny-editor :initValue="data.description" v-on:getEditorContent="setDescription" class="form-control" />
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
  name: 'book-form',
  props: ['properties'],
  data: function () {
    return {
      data: {
        id: null,
        uuid: null,
        book_id: null,
        location: '',
        AKA: '',
        tags: '',
        description: ''
      },
      picture_src: '',
      file: '',
      tempDescription: '',
      feedback: {
        location: {
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
    location: function () {
      return this.properties.location
    }
  },
  methods: {
    // Required for geting value from TinyMCE content
    setDescription (value) {
      var scope = this
      scope.MARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
      scope.tempDescription = value
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
          .post('http://localhost:3000/upload/locations/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            window.$('#location-details [name="picture"]').val(response.data.file.name)

            scope.data.pictures = response.data.file.name
            scope.saveLocation()
          }).catch(function () {
            console.log('FAILURE!!')
          })
      } else {
        scope.saveLocation()
      }
    },
    setAll (obj, val) {
      Object.keys(obj).forEach(function (index) {
        obj[index] = val
      })
    },
    setFeedbackNull () {
      var scope = this
      scope.setAll(scope.feedback.location, null)
    },
    saveLocation () {
      var scope = this
      var hasError = false

      scope.data.description = scope.tempDescription

      // Clear all error in form
      scope.setFeedbackNull()

      if (!scope.data.location) {
        scope.feedback.location.message = this.$t('LOCATION') + ' ' + this.$t('IS_REQUIRED')
        scope.feedback.location.state = false
        hasError = true
      }

      if (hasError) {
        return false
      }
      if (scope.data.hasOwnProperty('picture_src')) delete scope.data.picture_src
      scope.axios
        .post('http://localhost:3000/locations', scope.data)
        .then(response => {
          if (response.data) {
            // console.log(response.data)
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('LOCATION') + ' ' + this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.UNMARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
              if (scope.data.uuid === null) {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateLocationList', response.data)
                scope.CHANGE_COMPONENT({tabKey: 'location-form-' + response.data.uuid, tabComponent: 'location-form', tabData: { book: scope.book, location: response.data }, tabTitle: this.$t('EDIT') + ' - ' + response.data.location, tabIndex: scope.$store.getters.getActiveTab})
              } else {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateLocationList', response.data)
                scope.$store.dispatch('changeTabTitle', { key: 'location-form-' + response.data.uuid, title: this.$t('EDIT') + ' - ' + response.data.location })
              }

              // scope.loadLocation(response.data)
            })
          }
        })
    }
    // loadLocation (locationProp) {
    //   var scope = this
    //   let location = locationProp.location
    //   scope.data.location = location.location
    //   scope.data.AKA = location.AKA
    //   scope.data.tags = location.tags
    //   scope.data.description = location.description
    //   scope.data.pictures = location.pictures
    //   scope.picture_src = location.picture_src
    // }
  },
  beforeMount () {
    const scope = this
    if (scope.properties.location) {
      scope.data = scope.properties.location
      scope.picture_src = scope.properties.location.picture_src
      scope.setDescription(scope.data.description)
    }
    scope.data.book_id = scope.properties.book.uuid
  },
  mounted () {
    // var scope = this
    // if (scope.data.uuid) {
    //   if (scope.properties.location) window.$('.page-location-form .page-title h3').html('Update ' + scope.properties.location.location)
    //   scope.loadLocation(scope.data)
    // }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-book-form { padding:20px; }

  .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
  .page-title h3 { font-size:35px; }

  .single-picture-file { display: none }
  .uploaded-file-preview { width:100%; cursor: pointer; }
  .uploaded-file-preview img { width:100%; }
  .uploaded-file-preview .default-preview { min-height: 180px; background-color: #293742; color: #fff; text-align: center; }
  .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 180px; opacity: 0.8; }
</style>
