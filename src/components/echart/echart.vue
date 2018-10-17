<template>
    <div ref='chartStock' :id="chartID" style="height:200px">
    </div>
</template>  
<style>

</style>  
<script>  
import echarts from 'echarts'
export default {
    name: 'echart',
    props: {
        chartID: {
            type: String,
            default: 'chart-default'
        },
        height: {
            type: String,
            default: '320px'
        },
        options: {
            type: Object,
            default: function () {
                return {
                    title: { text: 'BQteam 图表示例' },
                    tooltip: {},
                    xAxis: {
                        data: ["数据清洗", "预处理", "数据分析"]
                    },
                    yAxis: {},
                    color: ['rgb(74, 101, 87)'],
                    series: [{
                        name: '搜索频次',
                        type: 'bar',
                        data: [15005, 23220, 30016]
                    }],
                }
            }
        }
    },
    data() {
        return {
            myChart: null
        }
    },
    components: {},
    mounted() {
        this.$nextTick(function () {
            window.addEventListener('resize', this.chartResize);
            //Init
            this.chartResize()
        })
        this.myChart = echarts.init(this.$refs.chartStock);
        this.setOption(this.options)
    },

    methods: {
        chartResize() {
            let node = document.getElementById(this.chartID)
            let parentNode = node.parentNode
            document.getElementById(this.chartID).style.width = parentNode.clientWidth + 'px'
            document.getElementById(this.chartID).style.height = this.height;
            this.myChart.resize();
        },
        setOption(options) {
            this.myChart.setOption(options);
        }
    },
    beforeDestroy() {
        this.myChart.dispose()
        window.removeEventListener('resize', this.chartResize)
    }
}
</script>