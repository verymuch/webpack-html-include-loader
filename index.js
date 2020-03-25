const validate = require('schema-utils')

const {getOptions} = require('loader-utils')
const {escapeForRegExp, isEmpty, replaceIncludeRecursive} = require('./util')

const schema = {
  type: 'object',
  properties: {
    includeStartTag: {type: 'string'},
    includeEndTag: {type: 'string'},
    variableStartTag: {type: 'string'},
    variableEndTag: {type: 'string'},
  },
}


module.exports = function (content) {
  const defaultOptions = {
    includeStartTag: '<%-',
    includeEndTag: '%>',
    variableStartTag: '<%=',
    variableEndTag: '%>',
    maxIncludes: 5,
  }
  const customOptions = getOptions(this)

  validate(schema, customOptions)

  if(!isEmpty(customOptions)) {
    // 对自定义选项中需要正则转义的内容进行转义
    Object.keys(customOptions).filter(key => key.endsWith('Tag')).forEach((tagKey) => {
      customOptions[tagKey] = escapeForRegExp(customOptions[tagKey])
    })
  }

  const options = Object.assign({}, defaultOptions, customOptions)

  const {
    includeStartTag, includeEndTag, maxIncludes, variableStartTag, variableEndTag,
  } = options

  const pathRelative = this.context

  const pathnameREStr = '[-_.a-zA-Z0-9/]+'
  const argsREStr = '{(\\S+?\\s*:\\s*\\S+?)(,\\s*(\\S+?\\s*:\\s*\\S+?)+?)*}'
  const includeRE = new RegExp(
    `${includeStartTag}\\s*include\\((['|"])(${pathnameREStr})\\1\\s*(?:,\\s*(${argsREStr}))?\\s*\\)\\s*${includeEndTag}`,
    'g',
  )

  const variableNameRE = '\\S+(\\s*\\?\\s*\\S+\\s*:\\s*\\S+\\s*)?'
  const variableRE = new RegExp(
    `${variableStartTag}\\s*(${variableNameRE})\\s*${variableEndTag}`,
    'g',
  )

  const source = replaceIncludeRecursive({
    apiContext: this, content, includeRE, variableRE, pathRelative, maxIncludes,
  })

  return source
}