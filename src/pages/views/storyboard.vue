<template>
<!--<div class="page-storyboard" style="position:relative; width:100%; height:calc(100vh - 77px);">-->
  <div class="page-storyboard">
    <div v-if="page.is_ready">
        <div class="es-page-head-2" style="margin-bottom: 1px;">
            <div class="row-head">
                <div>
                    <h4>{{ book.title }}</h4>
                    <small>{{$t('BELOW_ARE_THE_LIST_OF_SCENES_UNDER')}} {{ book.title }}</small>
                </div>
                <div class="book-panel-right">
                  <ul class="es-breadcrumb mb-0">
                    <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);"><span>{{ book.title }}</span></a></li>
                    <li><a href="javascript:void(0);" style="padding-right: 20px; background: var(--thin-white);">
                        <span>Story Board</span>
                    </a></li>
                  </ul>
                    <!-- <button class="es-button btn-sm white" @click="CHANGE_COMPONENT({tabKey: 'chapter-form', tabComponent: 'chapter-form', tabData: { book: book, chapter: null }, tabTitle: $t('NEW_CHAPTER'), newTab: true})">{{$t('NEW_CHAPTER').toUpperCase()}}</button> -->
                </div>
            </div>
        </div>
        <!-- <div class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button class="current">Story Board</button>
        </div> -->
        <div class="es-page-content" style="bcakground:#293742; padding:0px;">
            <div class="es-storyboard-settings no-select">
                <div style="display:inline-block; position:relative; width:50px; height:25px;">
                    <div style="position:absolute; top:8px; left:0px; ">
                        <label class="kx-switch">
                            <input type="checkbox" v-model="full">
                            <span class="kx-slider round"></span>
                        </label>
                    </div>
                </div>
                <div>
                <span class="btn-option" v-bind:class="{'active' : details.show_short_description}" @click="toggleData('short-description')">
                    <i v-if="details.show_short_description" class="las la-check"></i>
                    {{$t('SHORT_DESCRIPTION')}}
                </span>
                <span class="btn-option" v-bind:class="{'active' : details.show_time}" @click="toggleData('time')">
                    <i v-if="details.show_time" class="las la-check"></i>
                    {{$t('TIME')}}
                </span>
                <span class="btn-option" v-bind:class="{'active' : details.show_objects}" @click="toggleData('objects')">
                    <i v-if="details.show_objects" class="las la-check"></i>
                    {{$t('ITEMS')}}
                </span>
                <span class="btn-option" v-bind:class="{'active' : details.show_weather}" @click="toggleData('weather')">
                    <i v-if="details.show_weather" class="las la-check"></i>
                    {{$t('WEATHER')}}
                </span>
                <span class="btn-option" v-bind:class="{'active' : details.show_perspective}" @click="toggleData('perspective')">
                    <i v-if="details.show_perspective" class="las la-check"></i>
                    {{$t('POINT_OF_VIEW')}}
                </span>
                <span class="btn-option" v-bind:class="{'active' : details.show_marks}" @click="toggleData('marks')">
                    <i v-if="details.show_marks" class="las la-check"></i>
                    {{$t('CHARACTERS')}}
                </span>
                <span class="btn-option" v-bind:class="{'active' : details.show_locations}" @click="toggleData('locations')">
                    <i v-if="details.show_locations" class="las la-check"></i>
                    {{$t('LOCATIONS')}}
                </span>
                </div>
            </div>
            <div class="es-storyboard-content" id="custom-scrollbar">
                <draggable v-model="chapters" group="chapters" draggable=".handle-chapters" class="es-storyboard-content-inner" :empty-insert-threshold="100" :scroll-sensitivity="500" :force-fallback="true" v-bind:class="{'minify': !full }">
                    <div v-for="chapter in chapters" v-bind:key="chapter.id" group="chapters" v-bind:class="{'view-list': chapter.view === 'list', 'view-minimize': chapter.view === 'minimize'}"  class="handle-chapters chapter-wrapper">
                        <div class="title" v-b-tooltip.hover v-bind:title="displayTitle(chapter.short_description)">
                            {{ displayTitle(chapter.title) }}
                        </div>
                        <div @click="toggleView(chapter, 'grid')" class="btn-view view-grid" v-bind:class="{'active': chapter.view === 'grid'}"><i class="las la-table"></i></div>
                        <div @click="toggleView(chapter, 'list')" class="btn-view view-list" v-bind:class="{'active': chapter.view === 'list'}"><i class="las la-th-list"></i></div>
                        <div @click="toggleView(chapter, 'minimize')" class="btn-view view-minimize" v-bind:class="{'active': chapter.view === 'minimize'}"><i class="las la-window-minimize"></i></div>
                        <draggable v-if="chapter.view !== 'minimize'"  class="scene-draggable" :list="$store.getters.getScenesByChapter(chapter.uuid)" group="scenes" @change="sortScene(chapter.uuid)" :empty-insert-threshold="100" :scroll-sensitivity="500" :force-fallback="true" draggable=".handle-scenes" >
                            <div class="handle-scenes scene-wrapper" :key="scene.id" v-for="scene in $store.getters.getScenesByChapter(chapter.uuid)">
                                <div class="scene-card">
                                    <p class="ellipsis-2 scene-title">{{ displayTitle(scene.title) }}</p>
                                    <div class="details-container">
                                        <div v-if="details.show_short_description" class="details">
                                            <p class="label"><i class="las la-info-circle"></i> {{$t('SHORT_DESCRIPTION')}}</p>
                                            <span class="data">{{ scene.short_description || 'No short description' }}</span>
                                        </div>
                                        <div v-if="details.show_time" class="details">
                                            <p class="label"><i class="las la-clock"></i> {{ $t('DATE_START') }}</p>
                                            <span class="data">{{ scene.date_starts || 'Not Set' }}</span>
                                        </div>
                                        <div v-if="details.show_time" class="details">
                                            <p class="label"><i class="las la-clock"></i> {{ $t('DATE_END') }}</p>
                                            <span class="data">{{ scene.date_ends || 'Not Set' }}</span>
                                        </div>
                                        <div v-if="details.show_objects" class="details">
                                            <p class="label"><i class="las la-list"></i> {{$t('ITEMS')}}</p>
                                            <span class="data">
                                                <i class="boxed" :key="item.uuid" v-for="item in $store.getters.getSceneItems(scene.uuid)">
                                                    {{ item.item.itemname }}
                                                </i>
                                            </span>
                                        </div>
                                        <div v-if="details.show_weather" class="details">
                                            <p class="label"><i class="las la-cloud-sun"></i> {{ $t('WEATHER') }}</p>
                                            <span class="data">{{ scene.weather_type || 'Not Set' }}</span>
                                        </div>
                                        <div v-if="details.show_perspective" class="details">
                                            <p class="label"><i class="las la-eye"></i> {{ $t('POINT_OF_VIEW') }}</p>
                                            <span class="data" v-if="scene.character_id_vp !== -1">{{ $store.getters.findCharacter({book_id: scene.book_id, uuid: scene.character_id_vp }).fullname }}</span>
                                            <span class="data" v-else>{{ $store.getters.getAuthorName }}</span>
                                        </div>
                                        <div v-if="details.show_marks" class="details">
                                            <p class="label"><i class="las la-user"></i> {{$t('CHARACTERS')}}</p>
                                            <span class="data">
                                                <i class="boxed" :key="character.uuid" v-for="character in $store.getters.getSceneCharacters(scene.uuid)">
                                                    {{ character.character.fullname }}
                                                </i>
                                            </span>
                                        </div>
                                        <div v-if="details.show_locations" class="details">
                                            <p class="label"><i class="las la-map-marker-alt"></i> {{$t('LOCATIONS')}}</p>
                                            <span class="data">
                                                <i class="boxed" :key="location.uuid" v-for="location in $store.getters.getSceneLocations(scene.uuid)">
                                                    {{ location.location.location }}
                                                </i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </draggable>
                <div class="es-storyboard-content-inner" v-bind:class="{'minify': !full }">
                    <div v-bind:class="{'view-list': other_scenes_view === 'list', 'view-minimize': other_scenes_view === 'minimize'}"  class="handle-chapters chapter-wrapper">
                        <div class="title" v-b-tooltip.hover v-bind:title="$t('OTHER_SCENES')">
                            {{ $t('OTHER_SCENES') }}
                        </div>

                        <div @click="toggleOtherScenesView('grid')" class="btn-view view-grid" v-bind:class="{'active': other_scenes_view === 'grid'}"><i class="las la-table"></i></div>
                        <div @click="toggleOtherScenesView('list')" class="btn-view view-list" v-bind:class="{'active': other_scenes_view === 'list'}"><i class="las la-th-list"></i></div>
                        <div @click="toggleOtherScenesView('minimize')" class="btn-view view-minimize" v-bind:class="{'active': other_scenes_view === 'minimize'}"><i class="las la-window-minimize"></i></div>

                        <draggable v-if="other_scenes_view !== 'minimize'"  class="scene-draggable" :list="$store.getters.getScenesByBook(bookUUID)" group="scenes" @change="sortScene(null)" :empty-insert-threshold="100" :scroll-sensitivity="500" :force-fallback="true" draggable=".handle-scenes" >
                            <div class="handle-scenes scene-wrapper" :key="scene.id" v-for="scene in $store.getters.getScenesByBook(bookUUID)">
                                <div class="scene-card">
                                    <p class="ellipsis-2 scene-title">{{ displayTitle(scene.title) }}</p>
                                    <div class="details-container">
                                        <div v-if="details.show_short_description" class="details">
                                            <p class="label"><i class="las la-info-circle"></i> {{$t('SHORT_DESCRIPTION')}}</p>
                                            <span class="data">{{ scene.short_description || 'No short description' }}</span>
                                        </div>
                                        <div v-if="details.show_time" class="details">
                                            <p class="label"><i class="las la-clock"></i> {{ $t('DATE_START') }}</p>
                                            <span class="data">{{ scene.date_starts || 'Not Set' }}</span>
                                        </div>
                                        <div v-if="details.show_time" class="details">
                                            <p class="label"><i class="las la-clock"></i> {{ $t('DATE_END') }}</p>
                                            <span class="data">{{ scene.date_ends || 'Not Set' }}</span>
                                        </div>
                                        <div v-if="details.show_objects" class="details">
                                            <p class="label"><i class="las la-list"></i> {{$t('ITEMS')}}</p>
                                            <span class="data">
                                                <i class="boxed" :key="item.uuid" v-for="item in $store.getters.getSceneItems(scene.uuid)">
                                                    {{ item.item.itemname }}
                                                </i>
                                            </span>
                                        </div>
                                        <div v-if="details.show_weather" class="details">
                                            <p class="label"><i class="las la-cloud-sun"></i> {{ $t('WEATHER') }}</p>
                                            <span class="data">{{ scene.weather_type || 'Not Set' }}</span>
                                        </div>
                                        <div v-if="details.show_perspective" class="details">
                                            <p class="label"><i class="las la-eye"></i> {{ $t('POINT_OF_VIEW') }}</p>
                                            <span class="data" v-if="scene.character_id_vp !== -1">{{ $store.getters.findCharacter({book_id: scene.book_id, uuid: scene.character_id_vp }).fullname }}</span>
                                            <span class="data" v-else>{{ $store.getters.getAuthorName }}</span>
                                        </div>
                                        <div v-if="details.show_marks" class="details">
                                            <p class="label"><i class="las la-user"></i> {{$t('CHARACTERS')}}</p>
                                            <span class="data">
                                                <i class="boxed" :key="character.uuid" v-for="character in $store.getters.getSceneCharacters(scene.uuid)">
                                                    {{ character.character.fullname }}
                                                </i>
                                            </span>
                                        </div>
                                        <div v-if="details.show_locations" class="details">
                                            <p class="label"><i class="las la-map-marker-alt"></i> {{$t('LOCATIONS')}}</p>
                                            <span class="data">
                                                <i class="boxed" :key="location.uuid" v-for="location in $store.getters.getSceneLocations(scene.uuid)">
                                                    {{ location.location.location }}
                                                </i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else style="position:absolute; top:0px; left:0px; background:#fff; width:100%; height:100%; text-align:center; padding-top:calc(50vh - 200px);">
        <img style="width:100px;" class="loader" src="@/assets/img/loader-cog.svg">
        <p style="margin-top:10px;">{{$t('LOADING_STORY_BOARD_PLEASE_WAIT')}}</p>
    </div>
</div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'storyboard',
  props: ['properties'],
  components: {
    draggable
  },
  data: function () {
    return {
      page: {
        is_ready: false
      },
      bookUUID: '',
      scenes: [],
      view: 'grid',
      full: true,
      details: {
        show_short_description: true,
        show_time: true,
        show_objects: false,
        show_weather: false,
        show_perspective: false,
        show_marks: false,
        show_locations: false
      },
      other_scenes_view: 'grid'
    }
  },
  computed: {
    book: function () {
      return this.properties
    },
    chapters: {
      get () {
        let scope = this
        let chapters = scope.$store.getters.getChaptersByBook(scope.bookUUID)
        return chapters
      },
      set (value) {
        let scope = this
        this.$store.commit('sortChapters', { bookUUID: scope.bookUUID, data: value })
      }
    }
  },
  methods: {
    sortScene: function (chapterUUID) {
      var scope = this
      var scenes = (chapterUUID !== null) ? this.$store.getters.getScenesByChapter(chapterUUID) : this.$store.getters.getScenesByBook(scope.bookUUID)
      for (let i = 0; i < scenes.length; i++) {
        scenes[i].chapter_id = chapterUUID
        if (i === (scenes.length - 1)) {
          var parent = (chapterUUID !== null) ? chapterUUID : scope.bookUUID
          this.$store.commit('sortScenes', { PARENT: parent, data: scenes })
        }
      }
    },
    displayTitle: function (title) {
      if (title === null) {
        return 'Untitled'
      }
      if (title.length > 70) {
        return title.slice(0, 70) + '...'
      } else if (title.length < 1) {
        return 'Untitled'
      } else {
        return title.slice(0, 39)
      }
    },
    toggleData: function (data) {
      var scope = this

      if (data === 'short-description') {
        scope.details.show_short_description = !scope.details.show_short_description
      } else if (data === 'time') {
        scope.details.show_time = !scope.details.show_time
      } else if (data === 'objects') {
        scope.details.show_objects = !scope.details.show_objects
      } else if (data === 'weather') {
        scope.details.show_weather = !scope.details.show_weather
      } else if (data === 'perspective') {
        scope.details.show_perspective = !scope.details.show_perspective
      } else if (data === 'marks') {
        scope.details.show_marks = !scope.details.show_marks
      } else if (data === 'locations') {
        scope.details.show_locations = !scope.details.show_locations
      }
    },
    toggleMinify: function () {
      this.full = !this.full
    },
    toggleView: function (data, view) {
      data.view = view
    },
    toggleOtherScenesView: function (view) {
      this.other_scenes_view = view
    },
    loadScenes: function () {
      var scope = this
      let chapters = scope.$store.getters.getChaptersByBook(scope.bookUUID)
      for (let i = 0; i < chapters.length; i++) {
        let chapter = chapters[i]
        scope.$set(chapters[i], 'view', 'grid')
        scope.$store.dispatch('loadScenesByChapter', chapter.uuid)
        scope.$store.dispatch('loadCharactersByBook', chapter.book_id)

        if (i === (chapters.length - 1)) {
          setTimeout(function () {
            // scope.page.is_ready = true
            scope.loadSceneChild()
          }, 500)
        }
      }
    },
    loadSceneChild: function () {
      var scope = this
      let chapters = scope.$store.getters.getChaptersByBook(scope.bookUUID)
      for (let i = 0; i < chapters.length; i++) {
        let chapter = chapters[i]
        let scenes = scope.$store.getters.getScenesByChapter(chapter.uuid)
        for (let x = 0; x < scenes.length; x++) {
          let scene = scenes[x]
          scope.$store.dispatch('loadItemsByScene', scene)
          scope.$store.dispatch('loadCharactersByScene', scene)
          scope.$store.dispatch('loadLocationsByScene', scene)
        }
        if (i === (chapters.length - 1)) {
          setTimeout(function () {
            scope.page.is_ready = true
          }, 1500)
        }
      }
    }
  },
  mounted () {
    var scope = this
    scope.bookUUID = scope.properties.uuid
    scope.$store.dispatch('loadChaptersByBook', scope.bookUUID)
    scope.$store.dispatch('loadScenesByBook', scope.bookUUID)

    setTimeout(function () {
      scope.loadScenes()
    }, 1000)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-storyboard { position:relative; }

.es-storyboard .tooltip { position:relative; background:red; z-index:9000 !important; }
.es-storyboard-settings { display: flex; justify-content: space-between; flex-direction: row-reverse; text-align:right; background:#fff; border-bottom:1px solid #ccc; height:40px; line-height:40px; padding:0px 10px; }

.es-storyboard-settings .btn-option { background:#dfe5ea; margin-right:5px; padding:5px 12px; color:#293742; font-size:12px; cursor:pointer; }
.es-storyboard-settings .btn-option.active { padding-left:8px;  background:#293742; color:#fff; }

.btn-view { cursor:pointer; border:1px solid #efce4a; background:#efce4a; position:absolute; top:-30px;  padding:1px 0px; width:28px; text-align:center; color:#fff; }
.btn-view.active { background:#fff;  color:#000; }

.btn-view.view-grid { left:148px;}
.btn-view.view-list { left:177px; }
.btn-view.view-minimize { left:206px; }

.es-storyboard-content { background:#3e6684; padding:10px 15px; padding-top:30px; max-height:calc(100vh - 283px); overflow-y:scroll; }
.es-storyboard-content .chapter-wrapper { margin-top:50px; margin-bottom:50px; position:relative; border:3px solid #efce4a; padding:5px; }
.es-storyboard-content .chapter-wrapper .title { text-align:center; background:#efce4a; color:#000; position:absolute; top:-30px; left:-3px; padding:3px 15px; width:150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.es-storyboard-content .scene-draggable { padding:0px 5px;  background:transparent; display:flex; flex-wrap: wrap; }
.es-storyboard-content .scene-wrapper { z-index:2000; width:calc(25% - 10px);  margin:5px; margin-bottom:10px;}

.es-storyboard-content .chapter-wrapper.sortable-chosen .title { background:#922c39 !important; color:#fff !important; }
.es-storyboard-content .chapter-wrapper.sortable-chosen { border:3px solid #922c39 !important; }
.es-storyboard-content .chapter-wrapper.sortable-chosen .btn-view { border:1px solid #922c39 !important; background:#922c39 !important;  }
.es-storyboard-content .chapter-wrapper.sortable-chosen .btn-view.active { color:#922c39 !important; }

.es-storyboard-content .scene-wrapper .scene-card { background:#fff; padding:10px 20px; border: 1px solid #e0e5ee; border-radius: 1px; }
.es-storyboard-content .scene-wrapper .scene-card .scene-title { font-weight:900; }
.es-storyboard-content .scene-wrapper .scene-card .details-container .details { margin-bottom:5px; }
.es-storyboard-content .scene-wrapper .scene-card .details-container .details .label { margin:0px; }
.es-storyboard-content .scene-wrapper .scene-card .details-container .details .data { color:#5c7c95; padding-left:20px; }
.es-storyboard-content .scene-wrapper .scene-card .details-container .details .boxed {
    margin-top:5px; margin-right:10px; font-size:12px; background:#efefef; border:1px solid #ccc;
    border-radius:3px; color:#293742; padding:2px 7px; color:#293742; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;
    max-width:150px; display:inline-block;
}

.es-storyboard-content .scene-wrapper.sortable-chosen  .scene-card  { background:#23bf5a !important; color:#fff !important; }

.es-storyboard-content-inner.minify { display:flex; flex-wrap: wrap; justify-content:flex-start;}
.es-storyboard-content-inner.minify .chapter-wrapper { width:calc(25% - 10px); margin-right:10px; }

.es-storyboard-content .scene-wrapper .es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
.es-storyboard-content .scene-wrapper .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }

.es-storyboard-content .es-storyboard-content-inner.minify  .btn-view   { display:none !important; }
.es-storyboard-content .es-storyboard-content-inner.minify  .scene-wrapper  { margin-bottom:5px !important; width:calc(50% - 10px) !important; max-width:200px !important; }
.es-storyboard-content .es-storyboard-content-inner.minify  .scene-wrapper .scene-card { padding:5px !important; }
.es-storyboard-content .es-storyboard-content-inner.minify  .scene-wrapper .scene-card .scene-title { text-align:center; margin:0px !important; }
.es-storyboard-content .es-storyboard-content-inner.minify  .scene-wrapper .scene-card .details-container { display:none !important; }

.es-storyboard-content .chapter-wrapper.view-list .scene-wrapper { width:100%; margin-bottom:0px; }
.es-storyboard-content .chapter-wrapper.view-list .scene-wrapper .scene-card .details-container { display:flex; }
.es-storyboard-content .chapter-wrapper.view-list .scene-wrapper .scene-card .details-container .details  {  margin-right:20px; }
.es-storyboard-content .chapter-wrapper.view-list .scene-wrapper .scene-card .details-container .details .data {  padding-left:0px; }
.es-storyboard-content .chapter-wrapper.view-list .scene-wrapper .es-card .es-card-content { padding:0px; }

.es-storyboard-content .scene-wrapper .es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; padding-right:110px; }
.es-storyboard-content .scene-wrapper .es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

.es-storyboard-content .chapter-wrapper.view-minimize { padding:0px; }

.es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }
.es-card .es-card-content .es-card-actions .btn-circle { background:transparent; border:1px solid #e0e5ee; border-radius:50%; width:30px; height:30px; line-height:22px; text-align:center; font-size:15px; }
.es-card .es-card-footer { background:#f5f8fa; height:40px; line-height:40px; padding:0px 20px; border-top:1px solid #e0e5ee; }

/* The switch - the box around the slider */
.kx-switch { position: relative; display: inline-block;  width: 45px; height: 24px; }
/* Hide default HTML checkbox */
.kx-switch input { opacity: 0; width: 0; height: 0; }
/* The slider */
.kx-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; }
.kx-slider:before { position: absolute; content: "";  height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s; }

input:checked + .kx-slider { background-color: #2196F3; }
input:focus + .kx-slider { box-shadow: 0 0 1px #2196F3; }
input:checked + .kx-slider:before { -webkit-transform: translateX(20px); -ms-transform: translateX(20px); transform: translateX(20px); }

/* Rounded sliders */
.kx-slider.round { border-radius: 24px; }
.kx-slider.round:before { border-radius: 50%; }

@media only screen and (max-width: 968px) {

}
</style>
