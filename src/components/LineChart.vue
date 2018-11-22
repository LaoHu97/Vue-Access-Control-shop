<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import * as util from '../util/util'
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = util.debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods: {
    setOptions({ expectedData, actualData } = {}) {
      let myDate = Date.now();
      this.chart.setOption({
        xAxis: {
          data: [
            util.dateFormat((myDate - 3600 * 1000 * 24 * 7), 'yyyy-MM-dd'),
            util.dateFormat((myDate - 3600 * 1000 * 24 * 6), 'yyyy-MM-dd'), 
            util.dateFormat((myDate - 3600 * 1000 * 24 * 5), 'yyyy-MM-dd'), 
            util.dateFormat((myDate - 3600 * 1000 * 24 * 4), 'yyyy-MM-dd'), 
            util.dateFormat((myDate - 3600 * 1000 * 24 * 3), 'yyyy-MM-dd'), 
            util.dateFormat((myDate - 3600 * 1000 * 24 * 2), 'yyyy-MM-dd'), 
            util.dateFormat((myDate - 3600 * 1000 * 24 * 1), 'yyyy-MM-dd')
          ],
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          }
        },
        grid: {
          show: true,
          left: 10,
          right: 30,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          }
        },
        legend: {
          data: ['交易金额(元)']
        },
        series: [{
          name: '交易金额(元)', itemStyle: {
            normal: {
              color: '#409EFF',
              lineStyle: {
                color: '#409EFF',
                width: 2
              }
            }
          },
          smooth: false,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>