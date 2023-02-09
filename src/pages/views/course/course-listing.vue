<template>
  <div>
    <div class="page-location-form" v-if="page.is_ready">
      <div class="es-page-head">
        <div class="inner">
          <div class="details">
            <h4><strong>{{ $t('COURSES') }}</strong></h4>
          </div>
          <div class="actions">
          </div>
        </div>
      </div>
      <div class="es-page-content">
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
<!--    <div v-if="page.is_ready" class="page-chapter-details">-->
<!--      <div class="es-page-head">-->
<!--        <div class="inner">-->
<!--          <div class="details">-->
<!--            <div>-->
<!--              <h4><strong>{{ $t('COURSES') }}</strong></h4>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--&lt;!&ndash;      <div class="es-chapter-details-tab">&ndash;&gt;-->
<!--&lt;!&ndash;        <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-chapter-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>&ndash;&gt;-->
<!--&lt;!&ndash;        <div v-bind:class="{ 'active' : tab.active == 'document' }" @click="changeTab('document')" class="es-chapter-details-tab-item">{{$tc('DOCUMENT', 2).toUpperCase()}}</div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--      <div style="position:relative; padding-bottom:40px;">-->
<!--        <div v-if="tab.active === 'course-list'"  class="">-->
<!--          <div class="es-page-content">-->
<!--&lt;!&ndash;            <div class="text-right">&ndash;&gt;-->
<!--&lt;!&ndash;              <b-badge href="#" variant="dark" class="p-2">{{ $tc('DATE_STARTED') }}: <i class="fa fa-calendar-check" aria-hidden="true"></i> {{ data.started_at }}</b-badge>&ndash;&gt;-->
<!--&lt;!&ndash;              <b-badge href="#" variant="dark" class="p-2">{{ $tc('EXPIRES_ON') }}: <i class="fa fa-calendar-times" aria-hidden="true"></i> {{ data.expired_at }}</b-badge>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--            <div class="es-row">-->
<!--              <div class="es-col fadeIn animated" v-for="course_taken in courses_taken" v-bind:key="course_taken.uuid">-->
<!--                <div class="es-card">-->
<!--                  <div class="es-card-content">-->
<!--                    <div class="uploaded-file-preview" style="height: 150px;background: #d2d2d2">-->
<!--                      <div class="default-preview"><i class="fa fa-image"></i></div>-->
<!--                    </div>-->
<!--                    <div class="mt-3">-->
<!--                      <h3 class="title ellipsis-2">{{ DISPLAY_TITLE(course_taken.course.title) }}</h3>-->
<!--                      <i class="description ellipsis-3"><span v-html="REMOVE_HTML(course_taken.course.short_description)"></span></i>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                  <div class="es-card-footer text-center">-->
<!--                    <b-button class="es-button-white mb-1" @click="CHANGE_COMPONENT({tabKey: 'course-details-' + course_taken.uuid , tabComponent: 'course-details',  tabData: {course_taken:course_taken}, tabTitle: $t('COURSE'), newTab: true})">{{ (course_taken.started_at) ? $tc('CONTINUE_WITH_COURSE') : $tc('START')}}</b-button>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-if="tab.active === 'content'"  class="es-chapter-details-tab-content scene-listing">-->
<!--&lt;!&ndash;          <div class="row">&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="col-md-4">&ndash;&gt;-->
<!--&lt;!&ndash;              <div class="uploaded-file-preview" style="height: 150px;background: #d2d2d2">&ndash;&gt;-->
<!--&lt;!&ndash;                <div class="default-preview"><i class="fa fa-image"></i></div>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="col-4">&ndash;&gt;-->
<!--&lt;!&ndash;              <h4>{{ $t('TITLE')}}: {{course_taken.course.title }}</h4>&ndash;&gt;-->
<!--&lt;!&ndash;              <div>{{ $tc('DATE_STARTED')}} - {{ data.started_at  }}</div>&ndash;&gt;-->
<!--&lt;!&ndash;              <div>{{ $tc('EXPIRES_ON')}} - {{ data.expired_at  }}</div>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->

<!--          <div class="row mt-2">-->
<!--&lt;!&ndash;            <div class="col-md-12" v-html="lesson.content"></div>&ndash;&gt;-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  name: 'course-listing',
  props: ['properties'],
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
      // let coursesTaken = await scope.axios.get('http://localhost:3000/courses/' + course.id)
      scope.CHANGE_COMPONENT({tabKey: 'course-details-' + coursesTaken.uuid, tabIndex: scope.$store.getters.getActiveTab, tabComponent: 'course-details', tabData: {courses_taken: coursesTaken}, tabTitle: scope.$t('COURSE')})
    },
    getCourses: async function () {
      const scope = this

      let coursesTaken = await scope.axios.get('http://localhost:3000/users/' + this.$store.getters.getUserID + '/courses')
      scope.courses_taken = coursesTaken.data
      console.log('coursesTaken >>>>')
      console.log(scope.courses_taken)
    }
  },
  async mounted () {
    const scope = this
    try {
      await scope.getCourses()
    } finally {
      scope.page.is_ready = true
    }
  }
}
</script>

<style scoped>
  .es-page-content {
    background: #fff;
    position: relative;
  }
  .course-list { width:100%; max-width:1300px; padding:10px; margin:0px auto; display:flex; flex-wrap: wrap; justify-content: left; }
  .course-list .course-item { width:calc(33.33% - 10px); background:#fff; border:1px solid #ccc; margin:0 5px 10px; }
  .course-list .course-item img { width:100%; height:auto; height:200px; object-fit: cover; border-bottom:1px solid #ccc; }
  .course-list .course-item .details { padding:10px; min-height: 126px }
  .course-list .course-item .details p { height:96px; }
  .course-list .course-item .details strong { font-size: 20px }
  .course-list .course-item .footer { padding:10px; }
  .course-list .course-item .footer .btn { width: 100%; color: #fff; background-color: #852635 }
</style>
