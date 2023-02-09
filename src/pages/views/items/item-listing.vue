<template>
<div class="es-page-main page-item-listing">
    <div>
        <div class="es-page-head-2">
            <div class="row-head">
                <div>
                    <h4 class="main-title"><i class="fas fa-box-open mr-1"></i> {{$t('ITEMS')}}</h4>
                    <small>{{$t('BELOW_ARE_THE_LIST_OF_ITEMS_UNDER')}} {{ properties.title }}</small>
                </div>
                <div>
                    <button class="es-button btn-sm" @click="CHANGE_COMPONENT({tabKey: 'item-form', tabComponent: 'item-form', tabData: { list_index: -1, book: book, item: null }, tabTitle: $t('NEW_ITEM'), newTab: true })">{{$t('NEW_ITEM').toUpperCase()}}</button>
                </div>
            </div>
        </div>
        <div class="es-page-content">
            <ul class="es-breadcrumb">
              <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">{{ book.title }}</a></li>
              <li><a @click="CHANGE_COMPONENT({tabKey: 'item-listing-' + book.uuid, tabComponent: 'item-listing', tabData: book, tabTitle: $t('ITEMS') + ' - ' + book.title})" href="javascript:void(0);">{{ $t('ITEMS') }}</a></li>
            </ul>
            <div class="row kj-row">
                <div class="col-3 col-md-3 col-sm-12 kj-col fadeIn animated" v-for="item in items" v-bind:key="item.id">
                    <div class="es-card-2">
                        <div class="es-card-content">
                            <p class="title ellipsis-2">{{ item.itemname || 'Untitled' }}</p>
                            <div class="description ellipsis-2 text-italic display-webkit-box" v-if="item.description !== '' && item.description !== null" v-html="item.description"></div>
                            <div class="description text-italic display-webkit-box" v-else>{{$t('NO_DESCRIPTION')}}...</div>
                        </div>
                        <div class="es-card-footer">
                            <a class="btn-sm-rounded btn-bc-default-shade btn-bg-faint-default" @click="CHANGE_COMPONENT({tabKey: 'item-details-' + item.uuid, tabComponent: 'item-details', tabData: { book: book, item: item }, tabTitle: $t('VIEW')+ ' - ' + item.itemname})" href="javascript:void(0);"><i class="lar la-eye"></i> {{$t('VIEW')}}</a>
                            <a class="btn-sm-rounded btn-bc-primary-shade btn-bg-faint-primary" @click="CHANGE_COMPONENT({tabKey: 'item-form-' + item.uuid, tabComponent: 'item-form', tabData: { book: book, item: item }, tabTitle: $t('EDIT')+ ' - ' + item.itemname, newTab: true})" href="javascript:void(0);"><i class="las la-pencil-alt"></i> {{$t('EDIT')}}</a>
                            <a class="btn-sm-rounded btn-bc-danger-shade btn-bg-faint-danger" @click="deleteItem(item)" href="javascript:void(0);"><i class="las la-trash-alt"></i> {{$t('DELETE')}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'item-listing',
  props: ['properties'],
  data: function () {
    return {
      bookUUID: ''
    }
  },
  computed: {
    book: function () {
      return this.properties
    },
    items: function () {
      return this.$store.getters.getItemsByBook(this.bookUUID)
    }
  },
  methods: {
    deleteItem: function (item) {
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
            .delete('http://localhost:3000/items/' + item.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeItemFromList', item)
                })
              }
            })
        }
      })
    }
  },
  mounted () {
    var scope = this
    // scope.getItems(scope.properties.uuid)
    scope.bookUUID = scope.properties.uuid
  }
}
</script>
