<template>
<div v-if="page.is_ready" class="page-item-form">
    <div class="es-page-head-2 mb-0">
        <div class="row-head">
            <div>
                <div  v-if="data.id != null">
                    <h4>{{$t('EDIT')}}: <strong>{{ data.itemname }}</strong></h4>
                    <small>{{$t('DATE_MODIFIED')}}: {{ data.updated_at }}</small>
                </div>
                <div v-else>
                    <h4>{{$t('CREATE_NEW_ITEM')}}</h4>
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
        <button @click="CHANGE_COMPONENT({tabKey: 'item-listing-' + book.uuid, tabComponent: 'item-listing', tabData: book, tabTitle: $t('ITEMS') + ' - ' + book.title})">{{ $t('ITEMS') }}</button>
        /
        <button class="current">
            <span v-if="data !== null">{{ data.itemname }}</span>
            <span v-else>{{$t('NEW_ITEM')}}</span>
        </button>
    </div> -->
    <div class="es-page-content">
      <ul class="es-breadcrumb">
            <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);"><span>{{ book.title }}</span></a></li>
            <li><a @click="CHANGE_COMPONENT({tabKey: 'item-listing-' + book.uuid, tabComponent: 'item-listing', tabData: book, tabTitle: $t('ITEMS') + ' - ' + book.title})" href="javascript:void(0);"><span>{{ $t('ITEMS') }}</span></a></li>
            <li><a href="javascript:void(0);" style="padding-right: 20px;">
                  <span v-if="data !== null">{{ data.itemname }}</span>
                  <span v-else>{{$t('NEW_ITEM')}}</span>
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
                                    <label for="input-itemname">{{$t('ITEM_NAME')}}: </label>
                                    <b-form-input
                                        id="input-itemname"
                                        v-model="data.itemname"
                                        :state="feedback.itemname.state"
                                        aria-describedby="input-live-help input-live-feedback"
                                        :placeholder="$t('ITEM_NAME')"
                                        @keydown="MARK_TAB_AS_MODIFIED($store.getters.getActiveTab)"
                                        trim
                                    ></b-form-input>
                                    <!-- This will only be shown if the preceding input has an invalid state -->
                                    <b-form-invalid-feedback id="input-itemname-feedback">
                                        {{ feedback.itemname.message }}
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
  name: 'item-form',
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
        itemname: '',
        AKA: '',
        tags: '',
        description: ''
      },
      picture_src: '',
      file: '',
      tempDescription: '',
      feedback: {
        itemname: {
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
    item: function () {
      return this.properties.item
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
          .post('http://localhost:3000/upload/items/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            window.$('#item-details [name="picture"]').val(response.data.file.name)

            scope.data.pictures = response.data.file.name
            scope.saveItem()
          }).catch(function () {
            scope.$notify({
              group: 'notification',
              type: 'error',
              title: 'Failed',
              text: 'An error occur while processing...'
            })
          })
      } else {
        scope.saveItem()
      }
    },
    setAll (obj, val) {
      Object.keys(obj).forEach(function (index) {
        obj[index] = val
      })
    },
    setFeedbackNull () {
      var scope = this
      scope.setAll(scope.feedback.itemname, null)
    },
    saveItem () {
      var scope = this
      var hasError = false
      scope.data.description = scope.tempDescription

      // Clear all error in form
      scope.setFeedbackNull()

      if (!scope.data.itemname) {
        scope.feedback.itemname.message = this.$t('ITEM_NAME') + ' ' + this.$t('IS_REQUIRED')
        scope.feedback.itemname.state = false
        hasError = true
      }

      if (hasError) {
        return false
      }

      if (scope.data.hasOwnProperty('picture_src')) delete scope.data.picture_src
      scope.axios
        .post('http://localhost:3000/items', scope.data)
        .then(response => {
          if (response) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('ITEM') + ' ' + this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.UNMARK_TAB_AS_MODIFIED(scope.$store.getters.getActiveTab)
              if (scope.data.uuid === null) {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateItemList', response.data)
                scope.CHANGE_COMPONENT({tabKey: 'item-form-' + response.data.uuid, tabComponent: 'item-form', tabData: { book: response.data.book, item: response.data }, tabTitle: this.$t('EDIT') + ' - ' + response.data.itemname, tabIndex: scope.$store.getters.getActiveTab})
              } else {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateItemList', response.data)
                scope.$store.dispatch('changeTabTitle', { key: 'item-form-' + response.data.uuid, title: this.$t('EDIT') + ' - ' + response.data.itemname })
              }
            })
          }
        })
    },
    loadItem (itemProp) {
      var scope = this
      let item
      item = scope.$store.getters.findItem(itemProp)
      if (item) {
        scope.data.itemname = item.itemname
        scope.data.AKA = item.AKA
        scope.data.tags = item.tags
        scope.data.description = item.description
        scope.data.pictures = item.pictures
        scope.picture_src = item.picture_src
      }
    }
  },
  beforeMount () {
    var scope = this
    if (scope.properties.item) {
      scope.data = scope.properties.item
      scope.setDescription(scope.data.description)
    }
    scope.data.book_id = scope.properties.book.uuid
  },
  async mounted () {
    var scope = this
    try {
      if (scope.data.uuid) {
        await scope.loadItem(scope.data)
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
