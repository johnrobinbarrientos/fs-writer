<template>
  <div>
    <div v-if="page.is_ready" class="page-chapter-details">
      <div class="es-page-head-2 mb-0">
        <div class="row-head">
          <div>
            <h4 class="main-title"><i class="fas fa-chalkboard-teacher mr-1"></i> {{ lesson.title }}</h4>
          </div>
        </div>
      </div>
      <div class="es-page-content" id="custom-scrollbar">
        <ul class="es-breadcrumb">
          <li><a @click="CHANGE_COMPONENT({tabKey: 'courses', tabIndex: $store.getters.getActiveTab, tabComponent: 'course-listing',  tabData: null, tabTitle: 'COURSE'})" href="javascript:void(0);">{{ $t('COURSES') }}</a></li>
          <li><a @click="CHANGE_COMPONENT({tabKey: 'course-details-' + course.uuid , tabIndex: $store.getters.getActiveTab, tabComponent: 'course-details',  tabData: {courses_taken:course_taken}, tabTitle: $t('COURSES') })" href="javascript:void(0);">{{ course.title }}</a></li>
          <li><a href="javascript:void(0);">{{ lesson.title }}</a></li>
        </ul>
        <div class="basic-info">
          <div class="date-started"><i class="far fa-calendar-alt"></i> {{ $t('DATE_STARTED') }}: {{ formatDate(course_taken.started_at, 'll hh.mma') }}</div>
          <div class="date-started"><i class="far fa-calendar-times"></i> {{ $t('EXPIRES_ON') }}: {{ displayExpiryDate() }}</div>
        </div>
        <div class="lesson-details">
          <p v-html="lesson.content"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'course-details',
  props: ['properties'],
  data: function () {
    return {
      page: {
        is_ready: false
      }
    }
  },
  computed: {
    course: function () {
      return this.properties.course_taken.package.course
    },
    course_taken: function () {
      return this.properties.course_taken
    },
    lesson: function () {
      return this.properties.lesson
    }
  },
  methods: {
    displayExpiryDate: function () {
      let scope = this
      if (scope.end_date) {
        return scope.formatDate(scope.course_taken.end_date, 'll ') + scope.formatDate(scope.course_taken.started_at, 'hh.mma')
      }
      return scope.formatDate(scope.course_taken.started_at, 'll hh.mma')
    }
  },
  beforeMount () {},
  mounted () {
    const scope = this
    console.log(this.properties)
    // try {
    //   scope.course_taken = scope.properties.course_taken
    //   scope.lesson = scope.properties.lesson
    //   scope.data = scope.properties.data
    // } finally {
    scope.page.is_ready = true
    // }
  }
}
</script>

<style scoped>
.basic-info { float: right }
</style>
