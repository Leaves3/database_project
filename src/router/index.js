import { createRouter, createWebHistory } from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import register from "@/components/register.vue";
import { ElMessageBox } from 'element-plus'
import questionDetail from "@/components/questionDetail.vue";
import tagManage from "@/components/tagManage.vue";

const routes =[
        {
            path: '/',
            component:login,
            // 在后面菜单页面做循环路径的时候隐藏此路径，使他不做循环
            hidden:true
        },
        {
            path: '/home',
            name: 'home',
            component:home,
            // 在后面菜单页面做循环路径的时候隐藏此路径，使他不做循环
            hidden:true
        },
        {
            path: '/register',
            name: 'register',
            component:register,
            // 在后面菜单页面做循环路径的时候隐藏此路径，使他不做循环
            hidden:true
        },
        {
            path: '/question',
            name: 'question',
            component:questionDetail,
            // 在后面菜单页面做循环路径的时候隐藏此路径，使他不做循环
            hidden:true
        },
        {
            path: '/tag',
            name: 'tag',
            component:tagManage,
            // 在后面菜单页面做循环路径的时候隐藏此路径，使他不做循环
            hidden:true
        },

    ]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    let token = localStorage.getItem("token")
    if(token || to.path === "/" || to.path === "/register"){
        next();
    }
    else{
        next("/")
        ElMessageBox({
        title: '提示',
        message: '您已退出登录，请先进行登录！',
        showCancelButton: false,
        closeOnClickModal:true,
        confirmButtonText: '确认'
        })
    }

})
export default router;