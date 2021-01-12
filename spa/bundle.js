

/**
 * bundle初始化
 * @param {Object} params 初始化参数
 */
export function bundleExport (exportInfo = {}) {
    let bundleInfos = window.bundleInfos = window.bundleInfos || {}
    bundleInfos[process.env.MODULE_NAME] = exportInfo || {}

    let moduleInfos = window.moduleInfos = window.moduleInfos || []
    moduleInfos.push({
        module: process.env.MODULE_NAME,
        moduleOptions: exportInfo.moduleOptions || {},
    })
    delete exportInfo.moduleOptions
}
