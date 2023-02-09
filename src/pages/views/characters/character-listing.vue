<template>
<div class="es-page-main page-character-listing">
    <div>
        <div class="es-page-head-2">
            <div class="row-head">
                <div>
                    <h4 class="main-title"><i class="fas fa-user-friends mr-1"></i> {{$t('CHARACTERS')}}</h4>
                    <small>{{$t('BELOW_ARE_THE_LIST_OF_CHARACTERS_UNDER')}} {{ book.title }}</small>
                </div>
                <div>
                  <button class="es-button btn-sm white" @click="CHANGE_COMPONENT({tabKey: 'character-form', tabComponent: 'character-form', tabData: { list_index: -1, book: book, character: null }, tabTitle: $t('NEW_CHARACTER'), newTab: true})">{{$t('NEW_CHARACTER').toUpperCase()}}</button>
                  <b-button :disabled="getExportCharactersStatus.status == true" class="es-button btn-sm white" @click="exportCharacter()">
                    <span v-if="getExportCharactersStatus.status === false"><span>{{$t('EXPORT_CHARACTERS_LIST').toUpperCase()}}</span></span>
                    <span v-else>
                      <b-spinner small type="grow"></b-spinner>
                      <span>{{exportLoading}}</span>
                    </span>
                  </b-button>
                </div>
            </div>
        </div>
        <div class="es-page-content">
            <ul class="es-breadcrumb special">
              <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">{{ book.title }}</a></li>
              <li><a href="javascript:void(0);">{{ $t('CHARACTERS') }}</a></li>
            </ul>
            <div class="row kj-row">
                <div class="col-3 col-md-3 col-sm-12 kj-col fadeIn animated" v-for="character in characters" v-bind:key="character.id">
                    <div class="es-card-2">
                        <div class="es-card-content">
                            <p class="title ellipsis-2">{{ character.fullname || 'Untitled' }}</p>
                            <div class="description ellipsis-2 text-italic display-webkit-box" v-if="character.description !== '' && character.description !== null" v-html="character.description"></div>
                            <div class="description text-italic display-webkit-box" v-else>{{$t('NO_DESCRIPTION')}}...</div>
                        </div>
                        <div class="es-card-footer">
                            <a class="btn-sm-rounded btn-bc-default-shade btn-bg-faint-default" @click="CHANGE_COMPONENT({tabKey: 'character-details-' + character.uuid, tabComponent: 'character-details',  tabData: { book: book, character: character }, tabTitle: $t('VIEW')+ ' - ' + character.fullname})" href="javascript:void(0);"><i class="lar la-eye"></i> {{$t('VIEW')}}</a>
                            <a class="btn-sm-rounded btn-bc-primary-shade btn-bg-faint-primary" @click="CHANGE_COMPONENT({tabKey: 'character-form-' + character.uuid, tabComponent: 'character-form',  tabData: { book: book, character: character }, tabTitle: $t('EDIT')+ ' - ' + character.fullname, newTab: true})" href="javascript:void(0);"><i class="las la-pencil-alt"></i> {{$t('EDIT')}}</a>
                            <a class="btn-sm-rounded btn-bc-danger-shade btn-bg-faint-danger" @click="deleteCharacter(character)" href="javascript:void(0);"><i class="las la-trash-alt"></i> {{$t('DELETE')}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
const {ipcRenderer} = window.require('electron')
export default {
  name: 'character-listing',
  props: ['properties'],
  data: function () {
    return {
      exportOnProgress: false,
      exportLoading: this.$t('Loading'),
      bookUUID: ''
    }
  },
  computed: {
    ...mapGetters({ getExportCharactersStatus: 'getExportCharactersStatus' }),
    book: function () {
      return this.properties
    },
    characters: function () {
      return this.$store.getters.getCharactersByBook(this.bookUUID)
    }
  },
  methods: {
    deleteCharacter: function (character) {
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
            .delete('http://localhost:3000/characters/' + character.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeCharacterFromList', character)
                })
              }
            })
        }
      })
    },
    exportCharacter: function () {
      const scope = this
      let book = {
        bookUUID: scope.bookUUID,
        title: scope.properties.title
      }
      scope.$store.commit('exportCharactersStatusOpen')
      ipcRenderer.send('EXPORT_PDF_SHOW_CHARACTERS', {book: book})
    }
  },
  mounted () {
    var scope = this
    // scope.getCharacters(scope.properties.id)
    scope.bookUUID = scope.properties.uuid
    ipcRenderer.on('EXPORT_PDF_ENABLE_BUTTON', function () {
      scope.$store.commit('exportCharactersStatusClose')
    })
  }
}
</script>
