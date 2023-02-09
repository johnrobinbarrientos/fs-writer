<template>
<div style="z-index:3000;">
    <div class="note-wrap">

       <div style="padding:10px; background:#faf6bd; width:350px; min-height:200px; max-height:440px; cursor:grab;" v-draggable="draggableValue" :ref="handleId">
          <div style="font-weight:600;">
              {{ $t('NOTE') }}
              <i v-if="!edit" @click="toggleEdit()" style="float:right; font-size:20px; cursor:pointer;" class="las la-pencil-alt"></i>
          </div>
          <div style="max-height:400px; overflow-y:auto;">
            <div style="white-space: pre-wrap; margin-top:8px;" v-if="!edit" v-html="note.message"></div>
            <div v-else>
              <textarea style="margin-top:10px; width:100%; background:transparent;" rows="5" v-model="note.message"></textarea>
              <div style="text-align:right;">
                <button @click="saveNote()" class="es-button-white">{{ $t('SAVE') }}</button>
                <button @click="toggleEdit()" class="es-button-white">{{ $t('CANCEL') }}</button>
              </div>
            </div>
          </div>
      </div>
  </div>
</div>
</template>

<script>
// In renderer process (web page).
import moment from 'moment'
import { Draggable } from 'draggable-vue-directive'

export default {
  name: 'Note',
  props: ['properties'],
  data () {
    return {
      filter: 'all',
      edit: false,
      note: {
        id: null,
        uuid: null,
        author_id: '',
        parent_id: '',
        parent: '',
        message: ''
      },
      selected: false,
      message: '',
      response: '',
      handleId: 'handle-id',
      draggableValue: { }
    }
  },
  directives: {
    Draggable
  },
  components: {
  },
  computed: {
  },
  methods: {
    formatDate: function (data) {
      return moment(data.created_at).calendar()
    },
    toggleEdit: function () {
      var scope = this
      scope.edit = !scope.edit
    },
    saveNote: function () {
      var scope = this
      scope.note.author_id = scope.$store.getters.getAuthorID
      scope.note.parent_id = scope.properties.parent.uuid
      scope.note.parent = scope.properties.parent_name

      scope.axios
        .post('http://localhost:3000/notes', scope.note)
        .then(response => {
          // console.log(response.data)
          scope.note.id = response.data.id
          scope.note.uuid = response.data.uuid
          scope.toggleEdit()
        })
    }
  },
  mounted () {
    var scope = this
    var authorID = scope.$store.getters.getAuthorID
    var parent = scope.properties.parent_name
    var parentID = scope.properties.parent.uuid

    scope.axios.get('http://localhost:3000/notes/' + authorID + '/' + parent + '/' + parentID)
      .then(function (response) {
        console.log(response)
        if (response.data.length > 0) {
          scope.note.id = response.data[0].id
          scope.note.uuid = response.data[0].uuid
          scope.note.message = response.data[0].message
        }
      })
      .catch(function (error) {
        console.log(error)
      })
      .finally(function () {
        // always executed
      })

    scope.draggableValue.handle = this.$refs[this.handleId]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .note-wrap {
    position:absolute; top:20px; right:10px; z-index:9999; height:100%;
    overflow-y:auto; z-index:3000; width:400px;
  }
  .note-wrap .notes { position:relative; height:100%;}
</style>
