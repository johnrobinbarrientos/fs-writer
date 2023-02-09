<template>
<div v-if="page.is_ready && characters" class="es-page-content" style="height: auto">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <h4>{{$t('CHARACTERS')}}</h4>
                <small>{{$t('BELOW_ARE_THE_LIST_OF_CHARACTERS_UNDER')}} {{ bookTitle }}</small>
            </div>
<!--            <div class="actions">-->
<!--                <button id="printCharacterButton" class="es-button-white" @click="exportCharacter()">{{$t('EXPORT')}}</button>-->
<!--            </div>-->
        </div>
    </div>
    <div>
        <div v-if="characters != null" class="rows-print-as-pages">
            <div v-bind:key="character.id" v-for="character in characters">
                <div class="es-panel">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <div class="uploaded-file-preview">
                                    <div v-if="character.picture == null" class="default-preview"><i class="fa fa-image"></i></div>
                                    <div v-else><img :src="character.picture_src"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label class="text-capitalize">{{$t('FULLNAME')}}: {{character.fullname}}</label>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label class="text-capitalize">{{$t('SHORTNAME')}}: {{character.shortname}}</label>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label class="text-capitalize">{{$t('NICKNAME')}}: {{character.nickname}}</label>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label class="text-capitalize">{{$t('OCCUPATION')}}: {{character.occupation}}</label>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label >{{$t('BIRTHDATE')}}: {{character.birthdate}}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <label>{{$t('DESCRIPTION')}}: </label>
                        </div>
                        <div class="col-md-12">
                            <div v-html="character.description" style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <label>{{$t('BIO')}}: </label>
                        </div>
                        <div class="col-md-12">
                            <div v-html="character.bio" style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <label>{{$t('GOALS')}}: </label>
                        </div>
                        <div class="col-md-12">
                            <div v-html="character.goals" style="padding:10px 0px; font-size:18px; font-family:'Crimson Roman';"></div>
                        </div>
                    </div>
                    <b-table striped hover :items="character.relations" :fields="characterRelationsFields"></b-table>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
const electron = window.require('electron')
const {ipcRenderer} = electron
let component
export default {
  name: 'ExportCharacters',
  props: ['properties'],
  data: function () {
    return {
      characters: [],
      characterRelations: [],
      characterRelationsFields: [
        {
          key: 'relation',
          label: this.$t('RELATION'),
          sortable: true
        },
        {
          key: 'fullname',
          label: this.$t('FULLNAME'),
          sortable: true
        },
        {
          key: 'shortname',
          label: this.$t('SHORTNAME'),
          sortable: true
        },
        {
          key: 'nickname',
          label: this.$t('NICKNAME'),
          sortable: true
        }
      ],
      bookUUID: null,
      bookTitle: null,
      page: {
        is_ready: false
      }
    }
  },
  computed: {},
  methods: {
    viewCharacters: function () {
      const scope = this
      let characters = scope.$store.getters.getCharactersByBook(scope.bookUUID)
      characters.forEach(function (character, index) {
        scope.$store.dispatch('loadRelationsByCharacter', character.uuid)
        setTimeout(function () {
          let characterRelation
          let relation = []
          characterRelation = scope.$store.getters.getRelationsByCharacter(character.uuid)
          characterRelation.forEach(function (rel) {
            relation.push({
              relation: rel.relation.relation,
              fullname: rel.character_relation.fullname,
              shortname: rel.character_relation.shortname,
              nickname: rel.character_relation.nickname
            })
          })
          character.relations = relation
          scope.characters.push(character)
        }, 550)
        scope.page.is_ready = true
      })
      let pdf = {
        name: scope.bookTitle + ' - ' + scope.$t('CHARACTERS')
      }
      ipcRenderer.send('EXPORT_PDF_CONFIRM_GENERATE', {pdf: pdf})
    }
  },
  beforeMount () {},
  mounted () {
    const scope = this
    component = scope

    // ipcRenderer.on('EXPORT_PDF_SHOW_BUTTON', function (event, data) {
    //   window.$('#printCharacterButton').show()
    // })
  }
}

ipcRenderer.on('EXPORT_PDF_LIST_CHARACTERS', async function EXPORT_PDF_LIST_CHARACTERS (event, book) {
  const scope = component

  try {
    scope.bookUUID = book.bookUUID
    scope.bookTitle = book.title
    await scope.$store.dispatch('loadCharactersByBook', scope.bookUUID)
  } finally {
    scope.viewCharacters()
  }
})
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @media print {
    .rows-print-as-pages .es-panel{
      page-break-after: always;
    }
    /* include this style if you want the first row to be on the same page as whatever precedes it */
    .rows-print-as-pages:last-child {
      page-break-after: avoid;
    }
  }
  .uploaded-file-preview { width:100%; cursor: pointer; }
  .uploaded-file-preview img { width:100%; }
  .uploaded-file-preview .default-preview { min-height: 180px; background-color: #293742; color: #fff; text-align: center; }
  .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 180px; opacity: 0.8; }

  .rows-print-as-pages{margin-top: 10px}
</style>
