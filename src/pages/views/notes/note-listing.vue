<template>
<div class="es-page-main page-location-form">
    <div class="es-page-head">
        <h4 class="main-title special">{{ $t('MY_NOTES') }}</h4>
    </div>
    <div class="es-page-content">
        <div class="es-row">
            <div class="es-col fadeIn animated" v-for="note in notes" v-bind:key="note.id">
                <div class="es-card">
                    <div class="es-card-content">
                        <p class="title ellipsis-2">
                            <span v-if="note.parent === 'book'">{{ note.book.title }}</span>
                            <span v-if="note.parent === 'chapter'">{{ note.chapter.title }}</span>
                            <span v-if="note.parent === 'scene'">{{ note.scene.title }}</span>
                        </p>
                        <div class="description ellipsis-2 text-italic display-webkit-box" v-if="note.message !== '' && note.message !== null" v-html="note.message"></div>
                        <div class="description text-italic display-webkit-box" v-else>{{ $t('EMPTY') }}...</div>
                    </div>
                    <div class="es-card-footer">
                        <button @click="open(note)"><i class="las la-sticky-note"></i> {{ $t('OPEN').toUpperCase() }}</button>
                        <button v-if="note.parent === 'chapter'" class="btn-"  @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + note.chapter.uuid, tabComponent: 'books-i-read-chapter-details', tabData: { book: note.book, chapter: note.chapter }, tabTitle:  $t('VIEW')+ ' - ' + note.chapter.title, newTab: true})"><i class="lar la-eye"></i> {{$t('VIEW').toUpperCase()}}</button>
                        <button v-if="note.parent === 'scene'" class="btn-"  @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + note.scene.uuid, tabComponent: 'books-i-read-scene-details', tabData: { book: note.book, scene: note.scene, chapter: null }, tabTitle:  $t('VIEW')+ ' - ' + note.scene.title, newTab: true})"><i class="lar la-eye"></i> {{$t('VIEW').toUpperCase()}}</button>
                        <button v-if="note.parent === 'book'" class="btn-"  @click="CHANGE_COMPONENT({tabKey: 'book-details-' + note.book.uuid, tabComponent: 'books-i-read-book-details', tabData: { book: note.book }, tabTitle:  $t('VIEW')+ ' - ' + note.book.title, newTab: true})"><i class="lar la-eye"></i> {{$t('VIEW').toUpperCase()}}</button>
                        <button class="btn-delete" @click="deleteNote(note)"><i class="las la-trash-alt"></i> {{ $t('DELETE') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="selected !== null" style="width:100%; height:100vh; position:fixed; top:0; left:0px;">
        <div style="position:relative; width:100%; height:100vh; background:rgba(0,0,0,0.7);">
            <div style="position:absolute; top:calc(50vh - 200px); left:calc(50% - 150px); width:600px;  height:340px;">
            <div style="font-size:20px; background:#fae199; height:35px; line-height:40px; padding:0px 10px; font-weight:600;">
                NOTE
                <i @click="close()" style="float:right; cursor:pointer; font-size:25px; margin-top:10px;" class="las la-times"></i>
            </div>
            <div style="background:#fae199; padding:5px 10px; padding-bottom:10px; height:300px; overflow-y:auto;">
                <div v-html="selected.message"></div>
            </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'note-listing',
  props: ['properties'],
  data: function () {
    return {
      notes: [],
      selected: null
    }
  },
  components: {
  },
  computed: {

  },
  methods: {
    open: function (note) {
      var scope = this
      scope.selected = note
    },
    close: function () {
      var scope = this
      scope.selected = null
    },
    deleteNote: function (note) {
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
            .delete('http://localhost:3000/notes/' + note.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.loadNotes()
                })
              }
            })
        }
      })
    },
    loadNotes: function () {
      var scope = this
      var authorID = scope.$store.getters.getAuthorID
      scope.axios.get('http://localhost:3000/notes/' + authorID)
        .then(function (response) {
          scope.notes = response.data
          // console.log(scope.notes)
        })
        .catch(function (error) {
          console.log(error)
        })
        .finally(function () {
        // always executed
        })
    }
  },
  mounted () {
    var scope = this
    scope.loadNotes()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .es-card { color:#293742; background:#fae199; border:1px solid #e0e5ee; border-radius:3px; }
    .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
    .es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; }
    .es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

    .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }

    .es-card .es-card-footer { position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 0px; border-top:1px solid #e0e5ee; }
    .es-card .es-card-footer button { font-weight:600; background:transparent; border:none; height:40px; line-height:32px; text-align:center; font-size:14px; padding:0px 8px; }
    .es-card .es-card-footer button:hover { background:#e0e5ee; }
    .es-card .es-card-footer button i { font-size:18px; }
    .es-card .es-card-footer button.btn-delete { font-weight:600; color:#8f2c39; border-left:1px solid #e0e5ee; position:absolute; top:0px; right:0px; }
</style>
