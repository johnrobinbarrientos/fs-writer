<template>
    <li v-if="component.is_ready" v-bind:class="{ 'open' : $store.getters.isBookItemsFolderOpen(book) }">
        <div @click="TOGGLE_BOOK(book,'items')" class="label">
          <span>
            <span v-if="$store.getters.isBookItemsFolderOpen(book)">
              <i class="fas fa-chevron-down"></i>
              <i class="fas fa-folder-open"></i>
            </span>
            <span v-else>
              <i class="fas fa-chevron-right"></i>
              <i  class="fas fa-folder"></i>
            </span>
            {{ $t('ITEMS') }}
          </span>
        </div>
        <ul class="level-3">
            <li v-bind:key="item.id" v-for="item in items" class="ellipsis-2">
                <div @click="CHANGE_COMPONENT({tabKey: 'item-details-' + item.uuid, tabComponent: 'item-details',  tabData: {  book: book, item: item }, tabTitle: item.itemname})" class="label"><span><i class="fas fa-hammer"></i> <span>{{ item.itemname || 'Untitled' }}</span></span></div>
            </li>
        </ul>
    </li>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'book-items-folder',
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
    items: function () {
      return this.$store.getters.getItemsByBook(this.book.uuid)
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
