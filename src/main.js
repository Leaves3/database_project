import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "@/router";
import head from "./components/head.vue"
import questionLeft from "./components/question/questionLeft.vue"
import questionRight from "./components/question/questionRight.vue"
import * as ELIcons from '@element-plus/icons-vue'
import axios from 'axios'
import mitt from 'mitt'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.component('Head',head)
app.component('questionLeft',questionLeft)
app.component('questionRight',questionRight)
app.config.globalProperties.$mitt = new mitt();
app.config.globalProperties.$axios = axios
for (let iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
}
app.mount('#app')