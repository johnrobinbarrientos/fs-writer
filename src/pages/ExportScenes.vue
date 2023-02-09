<template>
<div v-if="page.is_ready == true && chapters" class="es-page-content" style="height: auto">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <h4>{{ $t('LIST') }} {{ $t('OF') }} {{$t('SCENES')}}</h4>
                <small>{{$t('BELOW_ARE_THE_LIST_OF_SCENES_UNDER')}} {{ $t('BOOK') }} : {{ bookTitle }}</small>
            </div>
<!--            <div class="actions">-->
<!--                <button id="printCharacterButton" class="es-button-white" @click="exportCharacter()">{{$t('EXPORT')}}</button>-->
<!--            </div>-->
        </div>
    </div>
    <div>
        <div v-if="chapters" class="rows-print-as-pages">
            <div v-bind:key="chapter.id" v-for="chapter in chapters">
                <div v-bind:key="scene.id" v-for="scene in chapter.scene">
                    <div class="es-panel">
                        <div class="row">
                            <div class="col-md-2">
                                <label class="">{{$t('CHAPTER')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="">{{chapter.title}}</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="">{{$t('SCENE')}} {{$t('TITLE')}}:</label>
                            </div>
                            <div class="col-md-10">
                                <label class="">{{scene.title}}</label>
                            </div>
                        </div>
                        <div class="row">
                          <div class="col-md-2">
                            <label class="">{{$t('SHORT_DESCRIPTION')}} :</label>
                          </div>
                          <div class="col-md-10">
                            <label class="">{{scene.short_description}}</label>
                          </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="">{{$t('TYPE_OF_SCENE')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="">{{scene.typeofscene}}</label>
                            </div>
                        </div>
                        <div class="row">
                          <div class="col-md-2">
                            <label class="">{{$t('IMPORTANCE')}} :</label>
                          </div>
                          <div class="col-md-10">
                            <label class="">{{scene.importance}}</label>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-2">
                            <label class="">{{$t('WEATHER')}} :</label>
                          </div>
                          <div class="col-md-10">
                            <label class="">{{scene.weather_type}}</label>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-2">
                            <label class="">{{$t('STATUS')}} :</label>
                          </div>
                          <div class="col-md-10">
                            <label class="">{{scene.status}}</label>
                          </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="">{{$t('DATE_START')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="">{{scene.date_starts}}</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <label class="">{{$t('DATE_END')}} :</label>
                            </div>
                            <div class="col-md-10">
                                <label class="">{{scene.date_ends}}</label>
                            </div>
                        </div><br/>
                        <div class="row">
                          <div class="col-md-2">
                            <label class="">{{$t('POINT_OF_VIEW')}} :</label>
                          </div>
                          <div class="col-md-10">
                            <label class="">{{getViewPointCharacter(scene)}}</label>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-12">
                            <div style="border-bottom: 1px solid  lightgray">
                              <label class="mb-0">{{$t('POINT_OF_VIEW')}} {{$t('DESCRIPTION')}} :</label>
                            </div>
                          </div>
                          <div class="col-md-12" v-html="scene.viewpoint_description"></div>
                        </div><br/><br/>
                        <div class="row">
                            <div class="col-md-12">
                                <div style="border-bottom: 1px solid  lightgray">
                                    <label class="mb-0">{{$t('CONTENT')}} :</label>
                                </div>
                            </div>
                            <div v-if="scene.scene_version.length != 0" class="col-md-12" v-html="scene.scene_version[scene.scene_version.length-1].content"></div>
                        </div><br/>
                        <div class="row">
                            <div class="col-md-12">
                                <div style="border-bottom: 1px solid  lightgray">
                                    <label class="mb-0">{{$t('NOTES')}} :</label>
                                </div>
                            </div>
                            <div class="col-md-12" v-html="scene.notes"></div>
                        </div><br/><br/>
                        <div class="row">
                            <div class="col-md-12">
                                <label class="">{{$t('CHARACTERS')}} {{$t('IN')}} {{$t('THIS')}} {{$t('SCENE')}} :</label>
                            </div>
                            <div class="col-md-12">
                                <b-table striped hover :items="scene.characters" :fields="characterFields"></b-table>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label class="">{{$t('LOCATIONS')}} {{$t('IN')}} {{$t('THIS')}} {{$t('SCENE')}} :</label>
                            </div>
                            <div class="col-md-12">
                                <b-table striped hover :items="scene.locations" :fields="locationFields"></b-table>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label class="">{{$t('ITEMS')}} {{$t('IN')}} {{$t('THIS')}} {{$t('SCENE')}} :</label>
                            </div>
                            <div class="col-md-12">
                                <b-table striped hover :items="scene.items" :fields="itemFields"></b-table>
                            </div>
                        </div>
                    </div>
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
  name: 'ExportScenes',
  props: ['properties'],
  data: function () {
    return {
      chapters: [],
      allCharacterFromBook: null,
      characterRelations: [],
      characterFields: [
        {
          key: 'character.fullname',
          label: this.$t('FULLNAME'),
          sortable: true
        },
        {
          key: 'character.shortname',
          label: this.$t('SHORTNAME'),
          sortable: true
        },
        {
          key: 'character.nickname',
          label: this.$t('NICKNAME'),
          sortable: true
        },
        {
          key: 'character.occupation',
          label: this.$t('OCCUPATION'),
          sortable: true
        }
      ],
      locationFields: [
        {
          key: 'location.location',
          label: this.$t('LOCATION'),
          sortable: true
        },
        {
          key: 'location.AKA',
          label: this.$t('AKA'),
          sortable: true
        }
      ],
      itemFields: [
        {
          key: 'item.itemname',
          label: this.$t('ITEM_NAME'),
          sortable: true
        },
        {
          key: 'item.AKA',
          label: this.$t('AKA'),
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
    getViewPointCharacter: function (scene) {
      const scope = this
      let vpCharacter = ''
      if (scene.character_id_vp === -1) {
        return this.$t('AUTHOR')
      }
      for (const key in scope.allCharacterFromBook) {
        let character = scope.allCharacterFromBook[key]
        if (character.uuid === scene.character_id_vp) {
          return character.fullname
        }
      }
      return vpCharacter
    },
    exportCharacter: function () {
      const scope = this
      window.$('#printCharacterButton').hide()
      let pdf = {
        name: scope.bookTitle + ' - ' + this.$t('SCENES')
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

ipcRenderer.on('EXPORT_PDF_LIST_CHAPTERS', async function EXPORT_PDF_LIST_CHAPTERS (event, data) {
  const scope = component
  scope.bookUUID = data.bookUUID
  scope.bookTitle = data.title

  try {
    await scope.$store.dispatch('loadCharactersByBook', scope.bookUUID)
    await scope.$store.dispatch('loadChaptersWithScenesByBook', scope.bookUUID)
  } finally {
    scope.allCharacterFromBook = scope.$store.getters.getCharactersByBook(scope.bookUUID)
    scope.chapters = scope.$store.getters.getChaptersByBook(scope.bookUUID)
    scope.page.is_ready = true
    let pdf = {
      name: scope.bookTitle + ' - ' + scope.$tc('SCENE', 2)
    }
    ipcRenderer.send('EXPORT_PDF_CONFIRM_GENERATE', {pdf: pdf})
  }
})
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @media print {
    .rows-print-as-pages .es-panel{
      page-break-after: always;
    }
    /* . this style if you want the first row to be on the same page as whatever precedes it */
    .rows-print-as-pages:last-child {
      page-break-after: avoid;
    }
  }
  .rows-print-as-pages{margin-top: 10px}
</style>
