<template>
<div v-if="page.is_ready" class="es-page-main page-item-details">
  <div class="es-page-content">
    <ul class="es-breadcrumb">
      <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">{{ book.title }}</a></li>
      <li><a @click="CHANGE_COMPONENT({tabKey: 'item-listing-' + book.uuid, tabComponent: 'item-listing', tabData: book, tabTitle: $t('ITEMS') + ' - ' + book.title})" href="javascript:void(0);">{{ $t('ITEMS') }}</a></li>
      <li><a href="javascript:void(0);">{{ item.itemname }}</a></li>
    </ul>
    <div class="es-panel">
        <div class="es-panel-content">
            <div class="image-container">
              <div v-if="item.picture_src == false" class="default-preview"><i class="fa fa-image"></i></div>
              <div v-else><img :src="item.picture_src"></div>
            </div>
            <h2 class="title">{{ properties.item.itemname || 'Untitled' }}</h2>
            <p class="aka">{{ properties.item.AKA || $t('AKA_NOT_SET') }}</p>
            <i class="description" v-if="properties.item.description !== '' && properties.item.description !== null" v-html="properties.item.description" ></i>
            <i class="description" v-else>{{$t('NO_DESCRIPTION')}}</i>
        </div>
        <div class="es-panel-footer">
            <div class="cta" @click="CHANGE_COMPONENT({tabKey: 'item-form-' + properties.item.uuid, tabComponent: 'item-form', tabData: { book: book, item: properties.item }, tabTitle: $t('EDIT')+ ' - ' + properties.item.itemname, newTab: true})">{{$t('EDIT').toUpperCase()}}</div>
            <div class="cta" @click="deleteItem(properties.item)">{{$t('DELETE').toUpperCase()}}</div>
        </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'item-details',
  props: ['properties'],
  data: function () {
    return {
      page: {
        is_ready: false
      }
    }
  },
  computed: {
    book: function () {
      return this.properties.book
    },
    item: function () {
      const scope = this
      const item = scope.properties.item
      if (!scope.CHECK_VALID_IMAGE(item.pictures)) {
        item.picture_src = false
      }
      return item
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
                  scope.CHANGE_COMPONENT({tabKey: 'item-listing-' + item.book_id, tabComponent: 'item-listing', tabData: { uuid: item.book_id }, tabTitle: this.$t('ITEMS') + ' - ' + this.$t('LIST'), tabIndex: scope.$store.getters.getActiveTab})
                })
              }
            })
        }
      })
    }
  },
  beforeMount () {
    // var scope = this
  },
  mounted () {
    var scope = this
    setTimeout(function () {
      scope.page.is_ready = true
    }, 100)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .image-container { text-align: center; }
  .image-container img { width:100%; max-width:250px; }

  .es-panel { background:#fff; margin:0px auto; margin-top: 40px; max-width:500px; border:1px solid #e0e5ee; }
  .es-panel .es-panel-content { }
  .es-panel .es-panel-content .title { margin:0px; margin-top:20px; text-align:center;  font-size:25px; font-weight:600; color:#293742; }
  .es-panel .es-panel-content .aka { margin-top:0px; text-align:center;  font-size:16px; color:#922c39; font-weight:600; }
  .es-panel .es-panel-content .tags { text-align:center; font-size:16px; color:#293742; }
  .es-panel .es-panel-content .description { display:block; padding:20px 0px; font-size:18px; text-align:center; }

  .es-panel .es-panel-footer { display:flex; background:#f5f8fa; border-top:1px solid #e0e5ee; height:40px; line-height:40px; padding:0px 0px; }
  .es-panel .es-panel-footer .cta { font-weight:600; cursor:pointer; text-align:center; width:50%;}
  .es-panel .es-panel-footer .cta:first-child {  border-right:1px solid #e0e5ee; }

  .default-preview { min-height: 180px; background-color: #293742; color: #fff; text-align: center; }
  .default-preview i { font-size: 105px; line-height: 180px; opacity: 0.8; }
</style>
