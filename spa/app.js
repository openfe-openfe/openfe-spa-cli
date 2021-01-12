let app = window.myapp || (window.myapp = {})

!app.init && (app.init = function(options) {
    Object.assign(app, options)
})

/**
 * 对外暴露所有模块信息
 */
app.getModuleInfos = function(){
    return window.moduleInfos || []
}

/**
 * 对外暴露所有bundle信息
 */
app.getBundleInfos = function(){
    return window.bundleInfos || {}
}

export default app
