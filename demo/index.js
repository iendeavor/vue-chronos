import Vue from 'vue'
import ElementUI from 'element-ui'
import Chronos from '@/main.js'
import Demo from './components/Demo.vue'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(Chronos, {
  optionName: 'dependentPairPaths',
  getterName: '$c',
})

export default new Vue({
  el: '#app',
  render: h => h(Demo),
})
