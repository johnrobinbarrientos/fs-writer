<template>
  <div>
    <div class="page-location-form" v-if="page.is_ready">
      <div class="es-page-head-2 mb-0">
        <div class="row-head">
          <div>
            <h4 class="main-title"><i class="fas fa-graduation-cap mr-1"></i> {{ course.title }}</h4>
          </div>
        </div>
      </div>
      <div class="es-details-tab-wrapper">
        <div class="es-details-tab">
          <div v-bind:class="{ 'active' : tab.active == 'lessons' }" @click="changeTab('lessons')" class="es-details-tab-item">{{ $t('LESSON').toUpperCase() }}</div>
          <div v-bind:class="{ 'active' : tab.active == 'course-plan' }" @click="changeTab('course-plan')" class="es-details-tab-item">{{ $t('COURSE_PLAN').toUpperCase() }}</div>
          <div v-bind:class="{ 'active' : tab.active == 'course-webinars' }" @click="changeTab('course-webinars')" class="es-details-tab-item">{{ $t('WEBINARS').toUpperCase() }}</div>
        </div>
        <div>
          <ul class="es-breadcrumb mb-0">
            <li><a @click="CHANGE_COMPONENT({tabKey: 'courses', tabIndex: $store.getters.getActiveTab, tabComponent: 'course-listing',  tabData: null, tabTitle: 'COURSE'})"  href="javascript:void(0);">{{ $t('COURSES') }}</a></li>
            <li><a href="javascript:void(0);" style="padding-right: 20px;">{{ course.title }}</a></li>
          </ul>
        </div>
      </div>
      <div class="es-course-details-content">
        <div v-if="tab.active === 'lessons'"  class="es-course-details-tab-content"  id="custom-scrollbar">
          <div class="lesson-list" v-if="lessons">
            <div class="lesson-single" v-for="lesson in lessons" :key="lesson.uuid">
              <div v-if="isLessonAvailable(lesson) || hasLessonAccess(lesson)">
                <div style="cursor: pointer" @click="openLesson(lesson)">
                  <div class="details">
                    <strong>{{ lesson.title }}</strong>
                  </div>
                  <div class="footer">
                    {{ $t('AVAILABLE') }}
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="text-muted">
                  <div class="details">
                    <strong>{{ lesson.title }}</strong>
                  </div>
                  <div class="footer">
                    {{ $t('AVAILABLE_AT') }} {{ lessonAvailability(lesson) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab.active === 'course-plan'"  class="es-course-details-tab-content"  id="custom-scrollbar">
          <div class="cours-plan-details">
            <div class="basic-info">
              <img :src="course.picture_src">
              <hr />
              <div class="date-started"><i class="far fa-calendar-alt"></i> {{  $t('DATE_STARTED') }}: {{ formatDate(course_taken.started_at, 'll hh.mma') }}</div>
              <div class="date-started"><i class="far fa-calendar-times"></i> {{ $t('EXPIRES_ON') }}: {{ displayExpiryDate() }}</div>
              <div class="date-started"><i class="far fa-folder"></i> {{ lessons.length }} {{ $t('LESSON') }}</div>
            </div>
            <div class="plan-details">
              <h4>{{ course.title }}</h4>
              <p v-html="course.description"></p>
            </div>
          </div>
        </div>
        <div v-if="tab.active === 'course-webinars'"  class="es-course-details-tab-content"  id="custom-scrollbar">
          <div class="webinar-list" v-if="webinars">
            <div class="webinar-single" v-for="webinar in webinars" :key="webinar.id">
              <img v-bind:src="webinar.image_src">
              <div class="details">
                <strong>{{ webinar.title }}</strong> <br>
                <div class="date-started"><i class="far fa-calendar-alt"></i> {{ $t('STARTED_AT') }}: {{ formatDate(webinar.start_date, 'DD.MM.YYYY') }} {{ $t('CLOCKS') }} {{ formatDate(webinar.start_date, 'HH.mm') }}
                </div>
                <p class="ellipsis-3" v-html="webinar.description"></p>
                <!--<div>
                    {{ trans("site.presenter") }}:
                    <span class="webinar-badge" v-for="presenter in getPresenter(webinar)" :key="presenter.id">
                        {{ presenter.first_name }} {{ presenter.last_name }}
                    </span>
                </div>-->
              </div>
              <div class="card-footer p-0">
                <template v-if="webinar.webinar_registrant">
                  <a class="btn site-btn-global-w-arrow w-100 rounded-0"
                     @click.prevent="openExternalBrowser(webinar.webinar_registrant.join_url)">
                    {{ $t('SIGN_UP_TEXT') }}
                  </a>
                </template>
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
<!--              <h4><strong>{{ course.title }}</strong></h4>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="es-course-webinars-tab">-->
<!--        <div v-bind:class="{ 'active' : tab.active == 'lesson' }" @click="changeTab('lesson')" class="es-course-webinars-tab-item">{{$t('LESSON').toUpperCase()}}</div>-->
<!--        <div v-bind:class="{ 'active' : tab.active == 'course_plan' }" @click="changeTab('course_plan')" class="es-course-webinars-tab-item">{{$t('COURSE_PLAN').toUpperCase()}}</div>-->
<!--        <div v-bind:class="{ 'active' : tab.active == 'webinars' }" @click="changeTab('webinars')" class="es-course-webinars-tab-item">{{$t('WEBINARS').toUpperCase()}}</div>-->
<!--      </div>-->
<!--      <div style="position:relative; padding-bottom:40px;">-->
<!--        <div v-if="tab.active === 'lesson'"  class="">-->
<!--          <div class="es-page-content">-->
<!--            <div class="es-row">-->
<!--              <div class="es-col fadeIn animated" v-for="lesson in lessons" v-bind:key="lesson.uuid">-->
<!--                <div class="es-card" v-bind:style="{ opacity: lesson.is_available ? '100%' : '50%' }">-->
<!--                  <div class="es-card-content">-->
<!--                    <div class="es-card-actions" v-if="lesson.is_available">-->
<!--                      <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'lesson-details-' + lesson.uuid, tabComponent: 'lesson-details',  tabData: { lesson: lesson, course_taken: course_taken ,data: data}, tabTitle: $t('VIEW')+ ' - ' + lesson.title, newTab: true})"><i class="lar la-eye"></i></button>-->
<!--                    </div>-->
<!--                    <h3 class="title ellipsis-2">{{ DISPLAY_TITLE(lesson.title) }}</h3>-->
<!--                    <i class="description ellipsis-3"><span v-html="lesson.content"></span></i>-->
<!--                  </div>-->
<!--                  <div class="es-card-footer">-->
<!--                    <small style="float:right;">{{ lesson.is_available ? $t('AVAILABLE') : $t('AVAILABLE_AT') + ' : ' + lesson.availability_date}}</small>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-if="tab.active === 'course_plan'"  class="es-course-webinars-tab-content scene-listing">-->
<!--          <div class="row">-->
<!--            <div class="col-md-4">-->
<!--              <div class="uploaded-file-preview" style="height: 150px;background: #d2d2d2">-->
<!--                <div class="default-preview"><i class="fa fa-image"></i></div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="col-4">-->
<!--              <h4>{{ $t('TITLE')}}: {{course.title }}</h4>-->
<!--              <div>{{ $t('DATE_STARTED') }} - <i class="fa fa-calendar-check" aria-hidden="true"></i> {{ data.started_at  }}</div>-->
<!--              <div>{{ $t('EXPIRES_ON') }} - <i class="fa fa-calendar-times" aria-hidden="true"></i> {{ data.expired_at  }}</div>-->
<!--              <div><i class="fa fa-book"></i> {{ lessons.length }} {{ lessons.length > 1 ? $t('LESSONS') : $t('LESSON') }} </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="row mt-5">-->
<!--            <div class="col-md-12" v-html="course.description"></div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-if="tab.active === 'webinars'"  class="es-course-webinars-tab-content webinars">-->
<!--          <div class="webinar-list">-->
<!--            <div class="webinar-single" v-for="webinar in webinars" :key="webinar.id" @click.prevent="openExternalBrowser('https://attendee.gotowebinar.com/register/' + webinar.webinar_id)">-->
<!--              <img v-bind:src="webinar.image_src">-->
<!--              <div class="details">-->
<!--                <strong>{{ webinar.title }}</strong>-->
<!--                <p class="ellipsis-3" v-html="webinar.description"></p>-->
<!--                <div>-->
<!--                  {{ $t('PRESENTER') }}:-->
<!--                  <span class="webinar-badge" v-for="presenter in webinar.webinar_presenters" :key="presenter.id">-->
<!--                    {{ presenter.first_name }} {{ presenter.last_name }}-->
<!--                  </span>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'course-details',
  props: ['properties'],
  data: function () {
    return {
      tab: {
        active: 'lessons'
      },
      page: {
        is_ready: false
      }
    }
  },
  methods: {
    changeTab: function (tab) {
      let scope = this
      scope.tab.active = tab
    },
    openLesson: function (lesson) {
      let scope = this
      scope.CHANGE_COMPONENT({tabKey: 'lesson-details-' + lesson.id, tabIndex: scope.$store.getters.getActiveTab, tabComponent: 'lesson-details', tabData: { course_taken: scope.course_taken, lesson: lesson }, tabTitle: 'Lessons'})
    },
    isLessonAvailable: function (lesson) {
      let scope = this

      if (!scope.course_taken.started_at) { return 'Course not started' }

      let availableOn = scope.lessonAvailability(lesson)
      return moment().isSameOrAfter(availableOn)
    },
    hasLessonAccess: function (lesson) {
      let scope = this

      // eslint-disable-next-line camelcase
      let access_lesson = []
      if (scope.course_taken.access_lessons) {
        // eslint-disable-next-line camelcase
        access_lesson = JSON.parse(scope.course_taken.access_lessons).join(',')
      }

      return access_lesson.includes(lesson.id)
    },
    lessonAvailability: function (lesson) {
      let scope = this

      if (!scope.course_taken.started_at) return 'Course not started'

      let availableOn = moment(scope.course_taken.started_at)

      if (moment(lesson.delay).isValid()) {
        availableOn = moment(lesson.delay)
      } else {
        availableOn.add(lesson.delay, 'd')
      }

      return availableOn.format('ll')
    },
    displayExpiryDate: function () {
      let scope = this
      if (scope.end_date) {
        return scope.formatDate(scope.course_taken.end_date, 'll ') + scope.formatDate(scope.course_taken.started_at, 'hh.mma')
      }
      return scope.formatDate(scope.course_taken.started_at, 'll hh.mma')
    }
  },
  computed: {
    course: function () {
      return this.properties.courses_taken.package.course
    },
    course_taken: function () {
      return this.properties.courses_taken
    },
    lessons: function () {
      return this.properties.courses_taken.package.course.lessons
    },
    webinars: function () {
      console.log('this.properties.courses_taken.package.course.webinars')
      console.log(this.properties.courses_taken.package.course.webinars)
      return this.properties.courses_taken.package.course.webinars
    }
  },
  beforeMount () {},
  async mounted () {
    let scope = this

    console.log('course details')
    console.log(scope.course_taken)
    console.log(scope.course)
    console.log(scope.lessons)
    console.log(scope.webinars)

    // scope.data.started_at = moment(scope.course_taken.started_at).format('MMM D YYYY, h:mm:ss a').toString()
    // scope.data.expired_at = moment(scope.course_taken.end_date).format('MMM D YYYY, h:mm:ss a').toString()
    //
    // // Load lessons
    // await scope.loadLessons()
    //
    // // Load webinars
    // await scope.loadWebinars()

    scope.page.is_ready = true
  }
}
</script>

<style scoped>
  .es-course-details-content {  height:calc(100vh - 200px)!important; }

  .es-course-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
  .es-course-details-tab .es-course-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
  .es-course-details-tab .es-course-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
  .es-course-details-tab .es-course-details-tab-item.active:after { background:#922c39;  }

  .es-course-details-tab-content { position:relative; padding:30px; background:#fff; height:100%; overflow-y:auto; display:block; }
  .es-course-details-tab-content.no-padding { padding:0px; }
  .es-course-details-tab-content.active { display:block; }

  .webinar-list { width:100%; max-width:1300px; padding:10px; margin:0px auto; display:flex; flex-wrap: wrap; justify-content: left; }
  .webinar-list .webinar-single { width:calc(33.33% - 10px); background:#fff; border:1px solid #ccc; margin:0 5px 10px; }
  .webinar-list .webinar-single img { width:100%; height:auto; height:200px; object-fit: cover; border-bottom:1px solid #ccc; }
  .webinar-list .webinar-single .details { padding:10px; height: 180px; }
  .webinar-list .webinar-single .webinar-badge { background:#ae2937; color:#fff; padding:2px 5px; border-radius:3px; margin-right:5px; font-size:12px; display:inline-block; }

  .lesson-list { width:100%; max-width:1300px; padding:10px; margin:0px auto; display:flex; flex-wrap: wrap; justify-content: left; }
  .lesson-list .lesson-single { width:calc(33.33% - 10px); background:#fff; border:1px solid #ccc; margin:0 5px 10px; }
  .lesson-list .lesson-single .details { padding:10px; height: 120px }
  .lesson-list .lesson-single .footer { padding:10px; background-color: #f5f8fa; border-top: 1px solid #ccc; text-align: right }

  .cours-plan-details .basic-info { width: 40%; margin-right: 20px; margin-bottom: 0px; padding: 10px; border: 1px solid rgb(203, 214, 226); float: left }
  .cours-plan-details .basic-info img { width: 100%; }
  .cours-plan-details .basic-info hr { border-color: rgb(203, 214, 226); margin: 10px 0px 10px -10px; width: calc(100% + 20px); }
</style>
