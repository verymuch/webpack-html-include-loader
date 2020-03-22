const fs = require('fs')
const path = require('path')

// 转义正则中的特殊字符
function escapeForRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 判断是否是对象
function isObject(obj) {
  // incase of arrow function and array
  return Object(obj) === obj && typeof obj !== 'function' && !Array.isArray(obj)
}

// 判断是否是string
function isString(str) {
  return typeof str === 'string' || str instanceof String
}

// 判断是否为空
// '', {}, [], 0, null, undefined, false
function isEmpty(obj) {
  if(Array.isArray(obj)) {
    return obj.length === 0
  } if(isObject(obj)) {
    return Object.keys(obj).length === 0
  }
  return !obj
}

// 替换include
function replaceIncludeRecursive({
  apiContext, content, includeRE, variableRE, pathRelative, maxIncludes,
}) {
  return content.replace(includeRE, (match, quotationStart, filePathStr, argsStr) => {
    let args = {}
    try {
      if(argsStr) {
        args = JSON.parse(argsStr)
      }
    } catch (e) {
      apiContext.emitError(new Error('传入参数格式错误，无法进行JSON解析成'))
    }
    const filePath = path.resolve(pathRelative, filePathStr)
    const fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'})

    apiContext.addDependency(filePath)

    // 先替换当前文件内的变量
    const fileContentReplacedVars = fileContent.replace(variableRE, (matchedVar, variable) => {
      return args[variable] || ''
    })


    if(--maxIncludes > 0 && includeRE.test(fileContent)) {
      return replaceIncludeRecursive({
        apiContext, content: fileContentReplacedVars, includeRE, variableRE, pathRelative: path.dirname(filePath), maxIncludes,
      })
    }
    return fileContentReplacedVars
  })
}

module.exports = {
  escapeForRegExp,
  isObject,
  isString,
  isEmpty,
  replaceIncludeRecursive,
}