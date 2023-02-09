<template>
<div>
    <div v-if="page.is_ready" class="page-scene-characters ">
        <div class="es-scene-children-wrapper" style="">
            <button @click="showChildrenItemList()" class="btn-dark" style="float:right;">{{$t('ADD_SCENE_CHARACTERS')}}</button>
            <div class="heading">{{$t('CHARACTERS')}}</div>
            <div class="es-row">
                <div class="es-col" v-for="scene_character in scene_characters" v-bind:key="scene_character.id">
                    <div class="es-card">
                        <div class="es-card-content">
                            <p class="title ellipsis-2">{{ scene_character.character.fullname || 'Untitled' }}</p>
                            <i class="description ellipsis-2" v-if="scene_character.character.description !== '' && scene_character.character.description !== null" v-html="scene_character.character.description"></i>
                            <i class="description ellipsis-2" v-else>{{$t('NO_DESCRIPTION')}}</i>
                        </div>
                        <div class="es-card-footer">
                            <button class="btn-" @click="CHANGE_COMPONENT({tabKey: 'character-details-'+ scene_character.uuiid , tabComponent: 'character-details',  tabData: {  book: book, character: scene_character.character }, tabTitle: scene_character.character.fullname})"><i class="lar la-eye"></i>  {{$t('VIEW')}}</button>
                            <button class="btn-" @click="CHANGE_COMPONENT({tabKey: 'character-form-' + scene_character.character.uuid, tabComponent: 'character-form',  tabData: { book: book, character: scene_character.character }, tabTitle: 'Edit - ' + scene_character.character.fullname, newTab: true})"><i class="las la-pencil-alt"></i> {{$t('EDIT')}}</button>
                            <button class="btn-delete" @click="deleteSceneCharacter(scene_character)"><i class="las la-trash-alt"></i> {{$t('DELETE')}}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="adding" class="scene-children-items slideInRight animated">
                <div class="note">
                    <i @click="hideChildrenItemList()" class="closer fas fa-times"></i>
                    {{$t('DOUBLE_CLICK_CHARACTER_TO_ADD_IT_INTO_THE_SCENE')}}
                </div>
                <div class="scene-children-items-list" >
                    <div v-bind:key="character.id" v-for="character in GET_CHARACTERS_BY_BOOK(scene.book_id)">
                        <div class="scene-children-item" @dblclick="save(character)" v-if="!isIncluded(character)">{{ character.fullname }}</div>
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
  name: 'scene-characters',
  props: ['properties'],
  data: function () {
    return {
      page: {
        title: '',
        is_ready: false,
        data: null
      },
      adding: false
    }
  },
  components: {
    TinyMCE
  },
  computed: {
    book: function () {
      return this.properties.book
    },
    scene_characters: function () {
      var scope = this
      return this.$store.getters.getSceneCharacters(scope.scene.uuid)
    }
  },
  methods: {
    isIncluded: function (character) {
      var scope = this
      var scenes = scope.$store.getters.getSceneCharacters(scope.scene.uuid)
      for (let i = 0; i < scenes.length; i++) {
        let scene = scenes[i]
        if (scene.character.uuid === character.uuid) {
          return true
        }
      }
      return false
    },
    showChildrenItemList: function () {
      var scope = this
      scope.adding = true
    },
    hideChildrenItemList: function () {
      var scope = this
      scope.adding = false
    },
    save (character) {
      var scope = this

      var sceneCharacter = {
        book_scene_id: scope.scene.uuid,
        book_character_id: character.uuid
      }

      scope.axios
        .post('http://localhost:3000/scene-characters', sceneCharacter)
        .then(response => {
          if (response.data) {
            scope.$store.dispatch('addSceneCharacterToList', response.data)
          }
        })
    },
    deleteSceneCharacter: function (character) {
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
            .delete('http://localhost:3000/scene-characters/' + character.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeSceneCharacterFromList', character)
                })
              }
            })
        }
      })
    }
  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this
    scope.scene = scope.properties.scene
    setTimeout(function () {
      scope.page.is_ready = true
    }, 500)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .es-scene-children-wrapper { padding:20px; height:calc(100vh - 250px); position:relative; overflow-x:hidden; }
    .es-scene-children-wrapper .heading { padding:10px; font-size:20px; }
    .es-scene-children-wrapper .scene-children-items {  position:absolute; top:0px; right:0px; width:280px; height:100%; background:#f5f8fa; border-left:1px solid #e0e5ee; }
    .es-scene-children-wrapper .scene-children-items .note { position:relative; background:#fff; padding:10px; padding-right:15px; border-bottom:1px solid #e0e5ee; font-style:italic; }
    .es-scene-children-wrapper .scene-children-items .closer { position:absolute; cursor:pointer; top:10px; right:5px; }
    .es-scene-children-wrapper .scene-children-items .scene-children-items-list { height:calc(100vh - 315px); overflow-y:auto; }
    .es-scene-children-wrapper .scene-children-items .scene-children-items-list .scene-children-item { cursor:pointer; background:#fff; border-bottom:1px solid #e0e5ee; padding:10px;  }

    .es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
    .es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; }
    .es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

    .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }

    .es-card .es-card-footer { position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 0px; border-top:1px solid #e0e5ee; }
    .es-card .es-card-footer button { font-weight:600; background:transparent; border:none; height:40px; line-height:32px; text-align:center; font-size:14px; padding:0px 8px; }
    .es-card .es-card-footer button:hover { background:#e0e5ee; }
    .es-card .es-card-footer button i { font-size:18px; }
    .es-card .es-card-footer button.btn-delete { font-weight:600; color:#8f2c39; border-left:1px solid #e0e5ee; position:absolute; top:0px; right:0px; }

    .btn-dark { margin-top:5px; background:#324553; color:#fff; border:none; border-radius:3px; height:35px; line-height:35px; padding:0px 10px; }
</style>
