<template>
  <div class="page-syncing" v-bind:class="{'fullscreen' : fullscreen}">
    <div>
      <div class="es-page-head">
        <div class="inner">
          <div class="details">
            <h4>{{$t('SYNCING')}}</h4>
            <small>{{$t('SYNCING_YOUR_DATA')}}</small>
          </div>
        </div>
      </div>
      <div class="es-page-content">
        <div v-if="stage == 'intro'" class="es-card fadeIn animated">
          <div class="es-card-header">{{$t('DATA_SYNCER')}}</div>
          <div class="es-card-content">
            <p class="intro-message">
              <i style="font-size:80px;" class="las la-sync"></i> <br/>
              {{ $t('SYNCING_YOUR_DATA')}} {{$t('FROM_DESKTOP_TO_WEB_VICE_VERSA') }}...
              <br/>
              <br/>
              <button class="syncer-button" @click="checkConnection()">{{$t('START_SYNCING')}}</button>
            </p>
          </div>
        </div>
        <div v-if="stage == 'connecting'" class="es-card fadeIn animated">
          <div class="es-card-header">{{$t('CONNECTING')}}</div>
          <div class="es-card-content">
            <img class="loader" src="@/assets/img/loader-cog.svg">
            <p>{{ progress_message }}</p>
            <br/>
            <br/>
          </div>
        </div>
        <div v-if="stage == 'packing'" class="es-card">
          <div class="es-card-header">{{$t('PACKING')}}</div>
          <div class="es-card-content">
            <img class="loader" src="@/assets/img/loader-cog.svg">
            <p style="font-size:20px;">{{ packingProgess }}%</p>
            <div class="es-progress-bar">
              <div v-bind:class="{'error' : packing.error }" class="es-progress" v-bind:style="{ width: packingProgess + '%' }"></div>
            </div>
            <p>{{ progress_message }}</p>
            <br/>
            <br/>
          </div>
        </div>
        <div v-if="stage == 'uploading'" class="es-card">
          <div class="es-card-header">{{$t('UPLOADING_DATA')}}</div>
          <div class="es-card-content">
            <img class="loader" src="@/assets/img/loader-cog.svg">
            <p style="font-size:20px;">{{ uploadProgess }}%</p>
            <div class="es-progress-bar">
              <div v-bind:class="{'error' : upload.error }" class="es-progress" v-bind:style="{ width: uploadProgess + '%' }"></div>
            </div>
            <p>{{ progress_message }}</p>
            <br/>
            <br/>
          </div>
        </div>
        <div v-if="stage == 'downloading'" class="es-card">
          <div class="es-card-header">{{$t('DOWNLOADING_DATA')}}</div>
          <div class="es-card-content">
            <img class="loader" src="@/assets/img/loader-cog.svg">
            <p style="font-size:20px;">{{ downloadProgess }}%</p>
            <div class="es-progress-bar">
              <div v-bind:class="{'error' : download.error }" class="es-progress" v-bind:style="{ width: downloadProgess + '%' }"></div>
            </div>
            <p>{{ progress_message }}</p>
            <br/>
            <br/>
          </div>
        </div>
        <div v-if="stage == 'saving'" class="es-card">
          <div class="es-card-header">{{$t('SAVING_DATA')}}</div>
          <div class="es-card-content">
            <img class="loader" src="@/assets/img/loader-cog.svg">
            <p style="font-size:20px;">{{ savingProgess }}%</p>
            <div class="es-progress-bar">
              <div v-bind:class="{'error' : saving.error }" class="es-progress" v-bind:style="{ width: savingProgess + '%' }"></div>
            </div>
            <p>{{ progress_message }}</p>
            <br/>
            <br/>
          </div>
        </div>
        <div v-if="stage == 'logs'" class="es-card">
          <div class="es-card-header">{{$t('CHANGE_LOGS')}}</div>
          <div class="es-card-content">
            <div style="text-align:left; color:#ccc;">
              <p style="margin:2px 0px; color:#293742; font-size:12px;" v-for="(endpoint,index) in endpoints" v-bind:key="index">
                {{$t('DOWNLOADED')}} {{ endpoint.downloaded.length}} <strong>{{ endpoint.title }}</strong>
              </p>
              <button v-if="autostart" class="syncer-button" @click="backToDashboard()">OK</button>
              <button v-else class="syncer-button" @click="backToIntro()">OK</button>
            </div>
          </div>
        </div>
        <div v-if="stage == 'no-connection'" class="es-card">
          <div class="es-card-header">{{ $t('NO_CONNECTION') }}</div>
          <div class="es-card-content">
            <br/>
            <br/>
            <i style="font-size:60px; color:#e3d457;" class="las la-exclamation-triangle"></i>
            <p style="font-size:20px;">Failed syncing data, Please check your internet connection...</p>
            <button class="syncer-button" @click="backToDashboard()">OK</button>
            <br/>
            <br/>
            <br/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

var electronFs = window.require('fs')
const fs = window.require('fs-extra')

const path = window.require('path')

// eslint-disable-next-line no-unused-vars
const app = window.require('electron').remote.app

const electron = window.require('electron')
const resourcePath = electron.remote.getGlobal('resourcePath')

const request = window.require('request')

export default {
  name: 'syncing',
  props: ['properties'],
  data: function () {
    return {
      sync_version: 18,
      api_token: '',
      retry: 0,
      fullscreen: false,
      autostart: false,
      stage: 'intro',
      current: 0,
      authorUUID: null,
      progress_message: 'Initializing...',
      download: {
        pointer: 0,
        progress: 0,
        total: 0,
        error: false
      },
      upload: {
        pointer: 1, // starts at one coz  we skip genres
        index: 0,
        counter: 0,
        progress: 0,
        total: 0,
        error: false
      },
      packing: {
        pointer: 1, // starts at one coz  we skip genres
        progress: 0,
        total: 0,
        error: false
      },
      saving: {
        pointer: 0,
        index: 0,
        counter: 0,
        progress: 0,
        total: 0,
        error: false
      },
      endpoints: [
        { title: 'Genres', api: 'book-genres', local: 'book-genres', downloaded: [], packed: [], error: [] },
        { title: 'Relations', api: 'book-relations', local: 'relations', downloaded: [], packed: [], error: [] },
        { title: 'Books', api: 'books', local: 'books', downloaded: [], packed: [], error: [] },
        { title: 'Items', api: 'book-items', local: 'items', downloaded: [], packed: [], error: [] },
        { title: 'Locations', api: 'book-locations', local: 'locations', downloaded: [], packed: [], error: [] },
        { title: 'Book Genres', api: 'book-genre-collections', local: 'book-genre-collections', downloaded: [], packed: [], error: [] },
        { title: 'Chapters', api: 'book-chapters', local: 'chapters', downloaded: [], packed: [] },
        { title: 'Chapter Versions', api: 'book-chapter-versions', local: 'chapter-versions', downloaded: [], packed: [] },
        { title: 'Characters', api: 'book-characters', local: 'characters', downloaded: [], packed: [] },
        { title: 'Relationships', api: 'book-relation-details', local: 'relation-details', downloaded: [], packed: [] },
        { title: 'Scenes', api: 'book-scenes', local: 'scenes', downloaded: [], packed: [] },
        { title: 'Scene Versions', api: 'book-scene-versions', local: 'scene-versions', downloaded: [], packed: [] },
        { title: 'Scene Items', api: 'book-scene-items', local: 'scene-items', downloaded: [], packed: [] },
        { title: 'Scene Locations', api: 'book-scene-locations', local: 'scene-locations', downloaded: [], packed: [] },
        { title: 'Scene Characters', api: 'book-scene-characters', local: 'scene-characters', downloaded: [], packed: [] },
        { title: 'Book Readers', api: 'book-readers', local: 'readers', downloaded: [], packed: [], error: [] },
        { title: 'Feedbacks', api: 'feedbacks', local: 'feedbacks', downloaded: [], packed: [], error: [] },
        { title: 'Feedback Response', api: 'feedback-responses', local: 'feedback-responses', downloaded: [], packed: [], error: [] },
        { title: 'Notes', api: 'notes', local: 'notes', downloaded: [], packed: [], error: [] },
        { title: 'Courses', api: 'courses', local: 'courses', downloaded: [], packed: [], error: [] },
        { title: 'Courses Taken', api: 'courses-taken', local: 'courses-taken', downloaded: [], packed: [], error: [] },
        { title: 'Packages', api: 'packages', local: 'packages', downloaded: [], packed: [], error: [] },
        { title: 'Package Courses', api: 'package-courses', local: 'package-courses', downloaded: [], packed: [], error: [] },
        { title: 'Lessons', api: 'lessons', local: 'lessons', downloaded: [], packed: [], error: [] },
        { title: 'Lesson Documents', api: 'lesson-documents', local: 'lesson-documents', downloaded: [], packed: [], error: [] },
        // { title: 'Book Feedbacks', api: 'book-feedbacks', local: 'feedbacks', downloaded: [], packed: [] },
        // { title: 'Book Chapter Feedbacks', api: 'book-chapter-feedbacks', local: 'chapter-feedbacks', downloaded: [], packed: [] },
        // { title: 'Book Chapter Feedback Responses', api: 'book-chapter-feedback-responses', local: 'chapter-feedback-responses', downloaded: [], packed: [] },
        { title: 'Assignments', api: 'assignments', local: 'assignments', downloaded: [], packed: [] },
        { title: 'Assignment Manuscripts', api: 'assignment-manuscripts', local: 'assignment-manuscripts', downloaded: [], packed: [] },
        { title: 'Webinars', api: 'webinars', local: 'webinars', downloaded: [], packed: [] },
        { title: 'WebinarPresenters', api: 'webinar-presenters', local: 'webinar-presenters', downloaded: [], packed: [] },
        { title: 'WebinarRegistrants', api: 'webinar-registrants', local: 'webinar-registrants', downloaded: [], packed: [] }
        // { title: 'Author Personal Progress', api: 'author-personal-progress', local: 'author-personal-progress', downloaded: [], packed: [] }
      ],
      bookUUID: ''
    }
  },
  computed: {
    packingProgess: function () {
      var progress = Math.ceil((this.packing.pointer / this.endpoints.length) * 100)
      if (progress > 100) { progress = 100 }
      return progress
    },
    uploadProgess: function () {
      var progress = Math.ceil((this.upload.counter / this.packing.total) * 100)
      if (progress > 100) { progress = 100 }
      return progress
    },
    downloadProgess: function () {
      var progress = Math.ceil((this.download.pointer / this.endpoints.length) * 100)
      if (progress > 100) { progress = 100 }
      return progress
    },
    savingProgess: function () {
      var progress = Math.ceil((this.saving.counter / this.download.total) * 100)
      if (progress > 100) { progress = 100 }
      return progress
    }
  },
  methods: {
    checkConnection: function () {
      var scope = this
      var modified = scope.$store.getters.getModifiedTabs

      if (modified.length > 0) {
        var text = ''
        for (let i = 0; i < modified.length; i++) {
          let current = modified[i]
          text += '<p style="margin:0px;">' + current.title + '</p>'
        }
        window.swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Unable to sync, you have unsave changes:',
          html: text + '<br/>'
        })
      } else {
        scope.proceedChecking()
      }
    },
    proceedChecking: function () {
      var scope = this

      scope.stage = 'connecting'
      scope.progress_message = scope.$t('ESTABLISHING_CONNECTION') + '...'

      scope.axios.get(window.APP.API.URL + '/user/connect')
        .then(function (response) {
          // handle success
          scope.progress_message = scope.$t('CONNECTED') + '!'
          setTimeout(function () {
            scope.getSyncableData()
          }, 1000)
        })
        .catch(function (error) {
          // handle error
          console.log(error)
          scope.stage = 'no-connection'
        })
        .finally(function () {
          // always executed
        })
    },
    getSyncableData: function () {
      var scope = this
      var userID = this.$store.getters.getUserID
      scope.stage = 'packing'
      scope.packing.error = false
      // get the current pointed endpoint
      let endpoint = scope.endpoints[scope.packing.pointer]
      if (!endpoint) return
      scope.progress_message = scope.$t('PACKING') + endpoint.title + '...'

      scope.axios.get('http://localhost:3000/' + endpoint.local + '/syncable',
        {
          params: {
            userID: userID
          }
        })
        .then(function (response) {
          // eslint-disable-next-line valid-typeof
          scope.endpoints[scope.packing.pointer].packed = response.data
          scope.packing.pointer++
          scope.packing.total += response.data.length
          if (scope.packing.pointer >= scope.endpoints.length) {
            scope.startUploadData()
          } else {
            scope.getSyncableData()
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error)
          scope.packing.error = true
          scope.progress_message = scope.$t('PACKING') + ' ' + scope.$t('FAILED') + ', ' + scope.$t('RECONNECTING') + '...'
          setTimeout(function () {
            scope.getSyncableData()
          }, 5000)
        })
        .finally(function () {
          // always executed
        })
    },
    startUploadData: function () {
      var scope = this
      scope.stage = 'uploading'
      scope.upload.error = false

      // done going through tables
      if (scope.upload.pointer >= scope.endpoints.length) {
        scope.startDownloadData()
        return
      }

      var endpoint = scope.endpoints[scope.upload.pointer]
      if (!endpoint) return
      if (typeof endpoint.packed === 'undefined' || endpoint.packed.length < 1) {
        scope.upload.pointer++
        scope.upload.index = 0
        scope.startUploadData()
        return
      }

      scope.progress_message = scope.$t('UPLOADING') + ' ' + endpoint.title + scope.$t('DATA') + '...'
      scope.progress_message = scope.$t('UPLOADING') + ' ' + endpoint.title + scope.$t('DATA') + '(' + scope.upload.index + ' ' + scope.$t('OF') + ' ' + (endpoint.packed.length + 1) + ')...'
      var data = endpoint.packed[scope.upload.index]

      data.created_at = scope.timeConvertToUTC(data.created_at)
      data.updated_at = scope.timeConvertToUTC(data.updated_at)
      data.sync_version = scope.sync_version

      var finalData = data
      var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + scope.api_token
      }

      if (['Items', 'Characters', 'Locations'].indexOf(endpoint.title) > -1 && (data.picture || data.pictures)) {
        var src = path.join(resourcePath, 'resources', 'images', endpoint.title.replace(/\s+/g, '-').toLowerCase(), (data.picture || data.pictures))

        if (!electronFs.existsSync(src)) {
          console.log('local file not found: ', src)
        } else {
          headers['Content-Type'] = 'multipart/form-data'

          var data_ = new FormData()

          for (var x in data) {
            if (data[x]) {
              data_.append(x, data[x])
            }
          }

          data_.append('file', new Blob([electronFs.readFileSync(src)]), data.picture || data.pictures)

          finalData = data_
        }
      } else if (['Assignment Manuscripts'].indexOf(endpoint.title) > -1 && data.content) {
        if (data.is_file) {
          var file = path.join(resourcePath, 'resources', 'files', endpoint.title.replace(/\s+/g, '-').toLowerCase(), data.content)

          if (!electronFs.existsSync(file)) {
            console.log('local file not found: ', file)
          } else {
            headers['Content-Type'] = 'multipart/form-data'

            // eslint-disable-next-line no-redeclare
            var data_ = new FormData()

            // eslint-disable-next-line no-redeclare
            for (var x in data) {
              if (data[x]) {
                data_.append(x, data[x])
              }
            }

            data_.append('file', new Blob([electronFs.readFileSync(file)]), data.content)

            finalData = data_
          }
        }
      }

      scope.axios.post(window.APP.API.URL + '/' + endpoint.api + '',
        finalData,
        {
          'headers': headers
        })
        .then(function (response) {
          // eslint-disable-next-line valid-typeof
          scope.upload.index++
          scope.upload.counter++
          // move to the next table/model
          if (scope.upload.index >= endpoint.packed.length) {
            scope.upload.pointer++
            scope.upload.index = 0
            // scope.startUploadData()
          }
          scope.startUploadData()
        })
        .catch(function (error) {
          // handle error
          console.log(error)
          scope.upload.error = true
          scope.progress_message = scope.$t('UPLOAD') + ' ' + scope.$t('FAILED') + ', ' + scope.$t('RECONNECTING') + '...'
          scope.retry++
          if (scope.retry <= 1) {
            setTimeout(function () {
              scope.startUploadData()
            }, 5000)
          } else {
            scope.retry = 0
            // eslint-disable-next-line valid-typeof
            scope.upload.index++
            scope.upload.counter++
            // move to the next table/model
            if (scope.upload.index >= endpoint.packed.length) {
              scope.upload.pointer++
              scope.upload.index = 0
              // scope.startUploadData()
            }
            scope.startUploadData()
          }
        })
        .finally(function () {
          // always executed
        })
    },
    timeConvertFromUTC: function (datetime) {
      if (datetime === null || datetime === 'undefined') { return null }

      var stillUtc = moment.utc(datetime).toDate()
      var date = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss')
      return date
    },
    timeConvertToUTC: function (datetime) {
      if (datetime === null || datetime === 'undefined') { return null }

      return moment(datetime).utc().format('YYYY-MM-DD HH:mm:ss').toString()
    },
    startDownloadData: function () {
      var scope = this
      scope.stage = 'downloading'
      scope.download.error = false

      if (scope.download.pointer >= scope.endpoints.length) {
        scope.saveDownloadedData()
        return
      }

      // get the current pointed endpoint
      let endpoint = scope.endpoints[scope.download.pointer]
      if (!endpoint) return
      scope.progress_message = scope.$t('DOWNLOADING') + ' ' + endpoint.title + '...'

      //

      var lastSyncedDate = scope.timeConvertToUTC(scope.$store.getters.getUserSyncedDate)
      scope.axios.get(window.APP.API.URL + '/' + endpoint.api,
        {
          params: {
            synced_at: lastSyncedDate
          },
          'headers': {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + scope.api_token
          }
        })
        .then(function (response) {
          // eslint-disable-next-line valid-typeof
          var data = response.data.rows
          if (['Items', 'Characters', 'Locations', 'Courses', 'Webinars', 'WebinarPresenters'].indexOf(endpoint.title) > -1) {
            // console.log(endpoint.title + ' response.data.rows ---->\n', response.data.rows)

            if (response.data && response.data.rows && response.data.rows.length > 0) {
              for (let i = 0; i < response.data.rows.length; i++) {
                const row = response.data.rows[i]
                let image = (row.picture || row.pictures || row.image)
                const allowedExt = ['.png', '.jpg', '.jpeg']
                let imageExt = (image) ? image.split('.').pop() : null

                if (!(imageExt && (allowedExt.indexOf('.' + imageExt) > -1))) {
                  continue
                }

                // Added by mael this will create the directory if not exist
                let dstDir = path.join(resourcePath, 'resources', 'images', endpoint.title.replace(/\s+/g, '-').toLowerCase())
                fs.mkdirsSync(dstDir)

                var folderName = window.APP.API.UPLOAD_URL + '/book-' + endpoint.title.toLowerCase()
                if (['Webinars', 'Courses', 'WebinarPresenters'].indexOf(endpoint.title) > -1) {
                  folderName = window.APP.API.UPLOAD_URL + '/' + endpoint.title.toLowerCase()

                  image = image.replace('/uploads/' + endpoint.api + '/', '')
                  if (endpoint.title === 'Courses') {
                    folderName = window.APP.API.UPLOAD_URL + '/course-images'
                    image = image.replace('/uploads/course-images/', '')
                  }
                  console.log(endpoint.api)
                  console.log(image)
                }

                const src = folderName + '/' + image + ''
                const dst = path.resolve(dstDir, image + '')
                scope.donwloadFile({url: src, name: image}, dst)
              }
            }
          } else if (['Feedbacks', 'Chapter Versions', 'Scene Versions'].indexOf(endpoint.title) > -1) {
            scope.saveAuthorDetails(response.data.authors)
          } else if (['Assignment Manuscripts'].indexOf(endpoint.title) > -1) {
            if (response.data && response.data.rows && response.data.rows.length > 0) {
              // eslint-disable-next-line no-redeclare
              for (var i = 0; i < response.data.rows.length; i++) {
                // eslint-disable-next-line no-redeclare
                var row = response.data.rows[i]

                if (row.is_file) {
                  const loc = '/uploads/assignment-manuscripts/' // file location from web TODO: refactor web saving of assignment ,dont include path
                  const filename = row.content.replace(loc, '') // file location from web TODO: refactor web saving of assignment ,dont include path
                  var src = window.APP.API.UPLOAD_URL + '/' + endpoint.title.replace(/\s+/g, '-').toLowerCase() + '/' + filename

                  var dst = path.join(resourcePath, 'resources', 'files', endpoint.title.replace(/\s+/g, '-').toLowerCase(), row.content)
                  // Added by mael this will create the directory if not exist

                  // file location from web TODO: refactor web saving of assignment ,dont include path
                  let dstDir = path.join(resourcePath, 'resources', 'files', endpoint.title.replace(/\s+/g, '-').toLowerCase(), loc)
                  fs.mkdirsSync(dstDir)

                  // console.log('src = ', src)
                  // console.log('dst = ', dst)
                  fetch(src, {
                    method: 'GET'
                  })
                    .then(response => response.blob())
                    .then(blob => {
                      var fileReader = new FileReader()
                      fileReader.onload = function () {
                        electronFs.writeFileSync(dst, Buffer.from(new Uint8Array(this.result)))
                      }
                      fileReader.readAsArrayBuffer(blob)
                    })
                }
              }
            }
          }

          scope.endpoints[scope.download.pointer].downloaded = data
          scope.download.pointer++
          scope.download.total += response.data.count
          scope.startDownloadData()
        })
        .catch(function (error) {
          // handle error
          console.log(error)
          scope.download.error = true
          scope.progress_message = scope.$t('DOWNLOAD') + ' ' + scope.$t('FAILED') + ', ' + scope.$t('RECONNECTING') + '...'

          scope.retry++
          if (scope.retry <= 1) {
            setTimeout(function () {
              scope.startDownloadData()
            }, 5000)
          } else {
            scope.retry = 0
            scope.endpoints[scope.download.pointer].downloaded = []
            scope.download.pointer++
            scope.download.total += 0
            scope.startDownloadData()
          }
        })
        .finally(function () {
          // always executed
        })
    },
    saveDownloadedData: function () {
      var scope = this
      scope.stage = 'saving'
      scope.saving.error = false

      // done going through tables
      if (scope.saving.pointer >= scope.endpoints.length) {
        scope.saveUserSyncedDate()
        scope.showLogs()
        return
      }

      var endpoint = scope.endpoints[scope.saving.pointer]
      if (!endpoint) return
      scope.progress_message = scope.$t('SAVING') + ' ' + endpoint.title + scope.$t('DATA') + '...'
      scope.progress_message = scope.$t('SAVING') + ' ' + endpoint.title + scope.$t('DATA') + '(' + scope.saving.index + ' ' + scope.$t('OF') + ' ' + (endpoint.downloaded.length + 1) + ')...'

      // skip attempt upload on empty data
      if (endpoint.downloaded.length < 1) {
        console.log('SKIP ' + endpoint.title)
        scope.saving.pointer++
        scope.saving.index = 0
        scope.saveDownloadedData()
        return
      }

      var data = endpoint.downloaded[scope.saving.index]
      data.created_at = scope.timeConvertFromUTC(data.created_at)
      data.updated_at = scope.timeConvertFromUTC(data.updated_at)

      console.log('before --> http://localhost:3000/' + endpoint.local + '/sync')
      console.log(data)

      scope.axios
        .post('http://localhost:3000/' + endpoint.local + '/sync', data)
        .then(function (response) {
          // eslint-disable-next-line valid-typeof
          scope.saving.index++
          scope.saving.counter++

          if (data.deleted_at === null) {
            scope.updateListByModel(endpoint.title, data)
          }
          // move to the next table/model
          if (scope.saving.index >= endpoint.downloaded.length) {
            scope.saving.pointer++
            scope.saving.index = 0
          }
          scope.saveDownloadedData()
        })
        .catch(function (error) {
          // handle error
          console.log(error)
          scope.saving.error = true
          scope.progress_message = scope.$t('DOWNLOAD') + ' ' + scope.$t('FAILED') + ', ' + scope.$t('RECONNECTING') + '...'
          setTimeout(function () {
            scope.saveDownloadedData()
          }, 5000)
        })
        .finally(function () {
          // always executed
        })
    },
    saveAuthorDetails: function (rows) {
      // a function to save details about the author (book readers) and commenter
      var scope = this

      for (let i = 0; i < rows.length; i++) {
        scope.axios
          .post('http://localhost:3000/users/connections', rows[i])
          .then(function (response) {
            // console.log(response)
          })
          .catch(function (error) {
            // handle error
            console.log(error)
          })
          .finally(function () {
            // always executed
          })
      }
    },
    showLogs: function () {
      var scope = this
      scope.stage = 'logs'

      /* reload Book-i-Read tree list after sync : JPM
        *  TODO: how to reload Tree List Book without collapse open
        * */
      const userUUID = this.$store.getters.getUserID
      const authorUUID = this.$store.getters.getAuthorID
      scope.$store.dispatch('reloadBooksIReadByAuthor', {userUUID: userUUID, authorUUID: authorUUID})
      scope.$root.$emit('loadCourses')
      scope.$root.$emit('loadAssignment')
      // var userID = this.$store.getters.getUserID
      // scope.$store.dispatch('getBooksByAuthorID', userID)
    },
    saveUserSyncedDate: function () {
      var scope = this
      var userID = this.$store.getters.getUserID

      scope.axios
        .post('http://localhost:3000/users/synced', { uuid: userID })
        .then(function (response) {
          var data = response.data
          scope.$store.commit('updateSyncedAt', {
            syncedAt: data.synced_at
          })
        })
        .catch(function (error) {
          // handle error
          console.log(error)
        })
        .finally(function () {
          // always executed
        })
    },
    updateListByModel: function (model, data) {
      var scope = this
      if (model === 'Books') {
        if (scope.authorUUID === data.author_id) {
          scope.$store.dispatch('updateBookList', data)
        } else {
          scope.$store.dispatch('updateBooksIReadList', { book: data, author_id: scope.authorUUID })
        }
      } else if (model === 'Chapters') {
        scope.$store.dispatch('updateChapterList', data)
      } else if (model === 'Chapter Versions') {
        scope.$store.dispatch('updateChapterVersionList', data)
      } else if (model === 'Characters') {
        scope.$store.dispatch('updateCharacterList', data)
      } else if (model === 'Items') {
        scope.$store.dispatch('updateItemList', data)
      } else if (model === 'Locations') {
        scope.$store.dispatch('updateLocationList', data)
      } else if (model === 'Scenes') {
        scope.$store.dispatch('updateSceneList', data)
      } else if (model === 'Scene Versions') {
        scope.$store.dispatch('updateSceneVersionList', data)
      }
    },
    backToIntro: function () {
      var scope = this
      scope.resetInitialData()
    },
    backToDashboard: function () {
      var scope = this
      scope.$parent.closeSyncer()
    },
    resetInitialData: function () {
      var scope = this
      scope.stage = 'intro'
      scope.current = 0
      scope.progress_message = 'Initializing...'

      scope.download.pointer = 0
      scope.download.progress = 0
      scope.download.total = 0
      scope.download.error = false

      scope.upload.pointer = 1
      scope.upload.index = 0
      scope.upload.counter = 0
      scope.upload.progress = 0
      scope.upload.total = 0
      scope.upload.error = false

      scope.packing.pointer = 1
      scope.packing.progress = 0
      scope.packing.total = 0
      scope.packing.error = false

      scope.saving.pointer = 0
      scope.saving.index = 0
      scope.saving.counter = 0
      scope.saving.progress = 0
      scope.saving.total = 0
      scope.saving.error = false
      scope.endpoints = [
        { title: 'Genres', api: 'book-genres', local: 'book-genres', downloaded: [], packed: [], error: [] },
        { title: 'Relations', api: 'book-relations', local: 'relations', downloaded: [], packed: [], error: [] },
        { title: 'Books', api: 'books', local: 'books', downloaded: [], packed: [], error: [] },
        { title: 'Items', api: 'book-items', local: 'items', downloaded: [], packed: [], error: [] },
        { title: 'Locations', api: 'book-locations', local: 'locations', downloaded: [], packed: [], error: [] },
        { title: 'Book Genres', api: 'book-genre-collections', local: 'book-genre-collections', downloaded: [], packed: [], error: [] },
        { title: 'Chapters', api: 'book-chapters', local: 'chapters', downloaded: [], packed: [] },
        { title: 'Chapter Versions', api: 'book-chapter-versions', local: 'chapter-versions', downloaded: [], packed: [] },
        { title: 'Characters', api: 'book-characters', local: 'characters', downloaded: [], packed: [] },
        { title: 'Relationships', api: 'book-relation-details', local: 'relation-details', downloaded: [], packed: [] },
        { title: 'Scenes', api: 'book-scenes', local: 'scenes', downloaded: [], packed: [] },
        { title: 'Scene Versions', api: 'book-scene-versions', local: 'scene-versions', downloaded: [], packed: [] },
        { title: 'Scene Items', api: 'book-scene-items', local: 'scene-items', downloaded: [], packed: [] },
        { title: 'Scene Locations', api: 'book-scene-locations', local: 'scene-locations', downloaded: [], packed: [] },
        { title: 'Scene Characters', api: 'book-scene-characters', local: 'scene-characters', downloaded: [], packed: [] },
        { title: 'Book Readers', api: 'book-readers', local: 'readers', downloaded: [], packed: [], error: [] },
        { title: 'Feedbacks', api: 'feedbacks', local: 'feedbacks', downloaded: [], packed: [], error: [] },
        { title: 'Feedback Response', api: 'feedback-responses', local: 'feedback-responses', downloaded: [], packed: [], error: [] },
        { title: 'Notes', api: 'notes', local: 'notes', downloaded: [], packed: [], error: [] },
        { title: 'Courses', api: 'courses', local: 'courses', downloaded: [], packed: [], error: [] },
        { title: 'Courses Taken', api: 'courses-taken', local: 'courses-taken', downloaded: [], packed: [], error: [] },
        { title: 'Packages', api: 'packages', local: 'packages', downloaded: [], packed: [], error: [] },
        { title: 'Package Courses', api: 'package-courses', local: 'package-courses', downloaded: [], packed: [], error: [] },
        { title: 'Lessons', api: 'lessons', local: 'lessons', downloaded: [], packed: [], error: [] },
        { title: 'Lesson Documents', api: 'lesson-documents', local: 'lesson-documents', downloaded: [], packed: [], error: [] },
        // { title: 'Book Feedbacks', api: 'book-feedbacks', local: 'feedbacks', downloaded: [], packed: [] },
        // { title: 'Book Chapter Feedbacks', api: 'book-chapter-feedbacks', local: 'chapter-feedbacks', downloaded: [], packed: [] },
        // { title: 'Book Chapter Feedback Responses', api: 'book-chapter-feedback-responses', local: 'chapter-feedback-responses', downloaded: [], packed: [] },
        { title: 'Assignments', api: 'assignments', local: 'assignments', downloaded: [], packed: [] }
        // { title: 'Author Personal Progress', api: 'author-personal-progress', local: 'author-personal-progress', downloaded: [], packed: [] }
      ]
    },
    donwloadFile: function (src, dst) {
      const download = function (uri, filename, callback) {
        // eslint-disable-next-line handle-callback-err
        request.head(uri, function (err, res, body) {
          request(uri).pipe(electronFs.createWriteStream(filename)).on('close', callback)
        })
      }

      download(src.url, dst, function () {
        console.log('done donwloadig image: ' + src.name)
      })
    }
  },
  beforeMount () {
    var scope = this
    scope.api_token = scope.$store.getters.getUserToken
  },
  mounted () {
    var scope = this
    scope.authorUUID = scope.$store.getters.getAuthorID
    if (scope.properties !== null && scope.properties.fullscreen) {
      scope.fullscreen = true
    }

    if (scope.properties !== null && scope.properties.autostart) {
      scope.autostart = true
      scope.checkConnection()
    }
    // scope.getLocations(scope.properties.uuid)
    // scope.bookUUID = scope.properties.uuid
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-syncing.fullscreen .es-page-content {  position: fixed; top: 0px; left: 0px;  background: rgba(31,46,58,0.8); width: 100%; height: 100vh; z-index: 999; }
  .page-syncing.fullscreen .es-card { margin-top:100px; }

  .es-card { width:calc(100% - 40px); max-width:750px; margin:0px auto; margin-top:10px; color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
  .es-card .es-card-content { position:relative; padding:20px; min-height:150px; text-align:center; }
  .es-card .es-card-content .intro-message { padding:80px 10px; }
  .es-card .es-card-content .loader { display:inline-block; margin:0px auto; padding:20px 0px; max-width:100px; }

  .es-card .es-card-content .syncer-button {cursor:pointer; background:#862e3b; border:none; color:#fff; padding:10px 40px; border-radius:4px; }
  .es-card .es-card-content .syncer-button:hover { background:#973241;  }

  .es-card .es-card-content .es-progress-bar { margin-top:-8px; margin-bottom:10px; position:relative; background:#ccc; border-radius:8px; height:10px;  }
  .es-card .es-card-content .es-progress { position:absolute; top:0px; left:0px; border-radius:8px; height:10px; background:#43c853; width:0%; height:100%;  }
  .es-card .es-card-content .es-progress.error { background:#ef3551;  }

  .es-card .es-card-header { font-weight:600; position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 10px; border-bottom:1px solid #e0e5ee; }
</style>
