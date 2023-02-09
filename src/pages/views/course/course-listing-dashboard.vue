<template>
  <div class="es-panel-2 h-100" v-if="page.is_ready">
    <div class="es-panel-head">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h5 class="mb-0">{{$t('COURSES')}}</h5>
        </div>
        <div class="col-md-6 text-right" v-if="courses_taken.length">
          <a href="javascript:void(0)" class="es-button white-special icon-right" @click="CHANGE_COMPONENT({tabKey: 'course-list', tabComponent: 'course-listing',  tabData: {}, tabTitle: $t('COURSES'), newTab: true})">
            {{ $t('VIEW_ALL') }} <i class="fas fa-chevron-right"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="es-panel-body h-100">
      <div class="row">
<!--        <div class="col-md-4" v-for="course_taken in courses_taken" :key="course_taken.uuid" v-if="isNotExpired(course_taken) && course_taken.started_at!=null">-->
<!--            <div class="uploaded-file-preview mb-3" style="height: 150px;background: #d2d2d2">-->
<!--              <div class="default-preview"><i class="fa fa-image"></i></div>-->
<!--            </div>-->
<!--            <h5 class="ellipsis-2 mb-3">{{ course_taken.course.title }}</h5>-->
<!--            <span class="ellipsis-2 mb-2" v-html="REMOVE_HTML(course_taken.course.short_description)"></span>-->
<!--            <a href="javascript:void(0)" @click="CHANGE_COMPONENT({tabKey: 'course-details-' + course_taken.uuid , tabComponent: 'course-details',  tabData: {course_taken:course_taken}, tabTitle: $t('COURSE'), newTab: true})" class="es-button icon-right">-->
<!--              {{ (course_taken.started_at) ? $t('CONTINUE_WITH_COURSE') : $t('START')}} <i class="fas fa-chevron-right"></i>-->
<!--            </a>-->
<!--        </div>-->
        <div class="course-list">
          <div class="course-item" v-for="course in courses_taken" :key="course.id">
            <img v-bind:src="course.package.course.picture_src">
            <div class="details">
              <strong class="ellipsis-1">{{ course.package.course.title }}</strong>
              <p class="ellipsis-4" v-html="course.package.course.short_description"></p>
            </div>
            <div class="footer">
              {{ course.hasStarted }}
              <div v-if="course.has_started">
                <button class="btn disabled" v-if="course.has_ended">{{ $tc('RENEW_SUBSCRIPTION') }}</button>
                <button class="btn" @click="viewDetail(course)" v-else>{{ $tc('CONTINUE_WITH_COURSE') }}</button>
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
  name: 'course-listing-dashboard',
  data: function () {
    return {
      courses_taken: [],
      page: {
        is_ready: false
      }
    }
  },
  methods: {
    viewDetail: async function (coursesTaken) {
      let scope = this
      scope.CHANGE_COMPONENT({tabKey: 'course-details-' + coursesTaken.uuid, tabIndex: scope.$store.getters.getActiveTab, tabComponent: 'course-details', tabData: {courses_taken: coursesTaken}, newTab: true, tabTitle: scope.$t('COURSE')})
    },
    async loadCourses () {
      const scope = this
      let response
      try {
        response = await scope.axios.get('http://localhost:3000/users/' + this.$store.getters.getUserID + '/courses')
      } finally {
        scope.courses_taken = response.data
        scope.page.is_ready = true
      }
    }
  },
  async mounted () {
    let scope = this
    await scope.loadCourses()

    scope.$root.$on('loadCourses', async () => {
      await scope.loadCourses()
    })
  }
}
</script>

<style scoped>
  .uploaded-file-preview { width:100%; cursor: pointer; }
  .uploaded-file-preview img { width:100%; }
  .uploaded-file-preview .default-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 150px;
    background-color: #293742;
    color: #fff;
    border-radius: 3px;
  }
  .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 100px; opacity: 0.8; }

  .course-list { width:100%; max-width:1300px; padding:10px; margin:0px auto; display:flex; flex-wrap: wrap; justify-content: left; }
  .course-list .course-item { width:calc(50% - 10px); background:#fff; border:1px solid #ccc; margin:0 5px 10px; }
  .course-list .course-item img { width:100%; height:auto; height:200px; object-fit: cover; border-bottom:1px solid #ccc; }
  .course-list .course-item .details { padding:10px; min-height: 126px }
  .course-list .course-item .details p { height:96px; }
  .course-list .course-item .details strong { font-size: 20px }
  .course-list .course-item .footer { padding:10px; }
  .course-list .course-item .footer .btn { width: 100%; color: #fff; background-color: #852635 }
</style>
