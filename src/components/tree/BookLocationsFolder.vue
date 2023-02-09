<template>
    <li v-if="component.is_ready" v-bind:class="{ 'open' : $store.getters.isBookLocationsFolderOpen(book)  == true }">
        <div @click="TOGGLE_BOOK(book,'locations')" class="label">
            <span>
                <span v-if="$store.getters.isBookLocationsFolderOpen(book)">
                  <i class="fas fa-chevron-down"></i>
                  <i class="fas fa-folder-open"></i>
                </span>
                <span v-else>
                  <i class="fas fa-chevron-right"></i>
                  <i  class="fas fa-folder"></i>
                </span>
                {{ $t('LOCATIONS') }}
            </span>
        </div>
        <ul class="level-3">
            <li v-bind:key="location.id" v-for="location in locations" class="ellipsis-2">
                <div @click="CHANGE_COMPONENT({tabKey: 'location-details-' + location.uuid, tabComponent: 'location-details',  tabData: { book: book, location: location }, tabTitle: location.location})" class="label"><span><i class="fas fa-map-marker-alt"></i> <span>{{ location.location || 'Untitled' }} </span></span></div>
            </li>
        </ul>
    </li>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'book-characters-folder',
  props: ['properties'],
  data: function () {
    return {
      component: {
        title: '',
        is_ready: false,
        data: null
      },
      chapter: null
    }
  },
  components: {
    draggable
  },
  computed: {
    locations: function () {
      return this.$store.getters.getLocationsByBook(this.book.uuid)
    }
  },
  methods: {

  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this
    scope.book = scope.properties

    scope.component.is_ready = true
  }
}
</script>
