<template>
<div class="es-page-main page-location-listing">
    <div>
        <div class="es-page-head-2">
            <div class="row-head">
                <div>
                  <h4 class="main-title"><i class="fas fa-location-arrow mr-1"></i> {{$t('LOCATIONS')}}</h4>
                  <small>{{$t('BELOW_ARE_THE_LIST_OF_LOCATIONS_UNDER')}} {{ properties.title }}</small>
                </div>
                <div>
                  <button class="es-button btn-sm" @click="CHANGE_COMPONENT({tabKey: 'location-form', tabComponent: 'location-form', tabData: { list_index: -1, book: book, location: null }, tabTitle: $t('NEW_LOCATION'), newTab: true})">{{$t('NEW_LOCATION').toUpperCase()}}</button>
                </div>
            </div>
        </div>
        <div class="es-page-content">
            <ul class="es-breadcrumb">
              <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);">{{ book.title }}</a></li>
              <li><a href="javascript:void(0);">{{ $t('LOCATIONS') }}</a></li>
            </ul>
            <div class="row kj-row">
                <div class="col-3 col-md-3 col-sm-12 kj-col fadeIn animated" v-for="location in locations" v-bind:key="location.id">
                    <div class="es-card-2">
                        <div class="es-card-content">
                            <p class="title ellipsis-2">{{ location.location || 'Untitled' }}</p>
                            <div class="description ellipsis-2 text-italic display-webkit-box" v-if="location.description !== '' && location.description !== null" v-html="location.description"></div>
                            <div class="description text-italic display-webkit-box" v-else>{{$t('NO_DESCRIPTION')}}...</div>
                        </div>
                        <div class="es-card-footer">
                            <a class="btn-sm-rounded btn-bc-default-shade btn-bg-faint-default" @click="CHANGE_COMPONENT({tabKey: 'location-details-' + location.uuid, tabComponent: 'location-details', tabData: { book: book, location: location }, tabTitle:  $t('VIEW')+ ' - ' + location.location})" href="javascript:void(0);"><i class="lar la-eye"></i> {{$t('VIEW')}}</a>
                            <a class="btn-sm-rounded btn-bc-primary-shade btn-bg-faint-primary" @click="CHANGE_COMPONENT({tabKey: 'location-form-' + location.uuid, tabComponent: 'location-form', tabData: { book: book, location: location }, tabTitle: $t('EDIT')+ ' - ' + location.location, newTab: true})" href="javascript:void(0);"><i class="las la-pencil-alt"></i> {{$t('EDIT')}}</a>
                            <a class="btn-sm-rounded btn-bc-danger-shade btn-bg-faint-danger" @click="deleteLocation(location)" href="javascript:void(0);"><i class="las la-trash-alt"></i> {{$t('DELETE')}}</a>
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
  name: 'location-listing',
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
    locations: function () {
      return this.$store.getters.getLocationsByBook(this.bookUUID)
    }
  },
  methods: {
    deleteLocation: function (location) {
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
            .delete('http://localhost:3000/locations/' + location.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeLocationFromList', location)
                })
              }
            })
        }
      })
    },
    createLocation () {
      var scope = this
      scope.$parent.changeComponent('location-form', scope.properties)
    }
  },
  mounted () {
    var scope = this
    // scope.getLocations(scope.properties.uuid)
    scope.bookUUID = scope.properties.uuid
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; margin-bottom: 20px; }
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
