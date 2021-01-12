/*
 * @Author: openFe
 * @LastEditors: openFe
 */
import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' //这个样式必须引入
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
let originalPush = Router.prototype.push
Router.prototype.push = function () {
    return originalPush.apply(this, arguments).catch(function(err){ return err; })
}

Vue.use(Vuex)
Vue.use(Router)

/**
 * 合并bundle信息
 * @param {Object} portalInfo portal配置信息
 * @param {Object} bundleInfos bundle配置信息集合
 */
function mergeBundle(portalInfo, bundleInfos){
    let bundleName, bundleExports, routers = [], 
    store = new Vuex.Store()

    for(bundleName in bundleInfos){
        bundleExports = bundleInfos[bundleName] || {}

        //合并bundle路由
        routers = routers.concat(bundleExports.router)
        //注册bundle的store模块，并触发store的命名空间机制
        store.registerModule(bundleName, Object.assign({}, bundleExports.store, {namespaced: true}))
    }

    //合并portal路由
    routers = routers.concat(portalInfo.router)
    //注册portal的store模块，并触发store的命名空间机制
    store.registerModule(process.env.MODULE_NAME, Object.assign({}, portalInfo.store, {namespaced: true}))

    const vueRouter = new Router({
        mode: 'hash',
        scrollBehavior: () => ({ y: 0 }),
        routes: routers
    })
    vueRouter.beforeEach((to,from,next) => {
        NProgress.start() 
        next()
    })
    vueRouter.afterEach((to, from) => {
        window.scrollTo(0, 0)
        NProgress.done()
    })

    portalInfo.router = vueRouter
    portalInfo.store = store

    return portalInfo
}

/**
 * portal初始化
 * @param {Object} params 初始化参数
 */
export function portalInit (exportInfo = {}) {
    let bundleInfos = window.bundleInfos = window.bundleInfos || {}
    let moduleInfos = window.moduleInfos = window.moduleInfos || []
    moduleInfos.unshift({
        module: process.env.MODULE_NAME,
        moduleOptions: exportInfo.moduleOptions || {},
    })
    delete exportInfo.moduleOptions

    let vm = new Vue(mergeBundle(exportInfo, bundleInfos))
    window.vm = vm
    vm.$mount('#MOUNT_NODE')
}
