<template>
<div>
  <h4><i class="las la-paperclip"></i> {{$t('REPORTS')}}</h4>
  <hr />
  <div class="component-report">
    <div class="row">
      <div class="col-12 col-md-3">
        <div class="blurb-report es-wrapper">
          <span class="day"><i class="fas fa-sun"></i></span>
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('today')) }}</h3>
          <p style="margin:0px;">{{$t('WORD_COUNT_FOR_THE_DAY')}}</p>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="blurb-report es-wrapper">
          <span class="month"><i class="fas fa-calendar-alt"></i></span>
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('monthly')) }}</h3>
          <p style="margin:0px;">{{$t('WORD_COUNT_FOR_THIS_MONTH')}}</p>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="blurb-report es-wrapper">
          <span class="year"><i class="fas fa-calendar-check"></i></span>
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('yearly')) }}</h3>
          <p style="margin:0px;">{{$t('WORD_COUNT_FOR_THIS_YEAR')}}</p>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="blurb-report es-wrapper">
          <span class="overall"><i class="fas fa-layer-group"></i></span>
          <h3>{{ numberFormat(GET_AUTHOR_PERSONAL_PROGRESS('all_time')) }}</h3>
          <p style="margin:0px;">{{$t('OVERALL_WORD_COUNT')}}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Report',
  methods: {
    numberFormat: function (number) {
      return number.toLocaleString()
    }
  },
  beforeMount () {
    let scope = this
    scope.$store.dispatch('loadAuthorPersonalProgress', { authorId: this.$store.getters.getAuthorID })
  },
  mounted () {
    // let scope = this
  }
}
</script>

<style scoped>

</style>
