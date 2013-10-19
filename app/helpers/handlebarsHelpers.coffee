Em.Handlebars.helper 'titleize', (value, options) ->
  return value if value is null or value is undefined
  title = value.replace(/^([a-z])/, (match) ->
    match.toUpperCase()
  )
  escaped = Handlebars.Utils.escapeExpression(title)
  new Handlebars.SafeString(escaped)

Em.Handlebars.helper 'humanize', (value, options) ->
  return value if value is null or value is undefined
  value = value.replace(/([A-Z]+|[0-9]+)/g, " $1").replace(/^./, (str) ->
    str.toUpperCase())

  escaped = Handlebars.Utils.escapeExpression(value)
  new Handlebars.SafeString(escaped)

Em.Handlebars.helper 'date', (value, options) ->
  return value if value is null or value is undefined
  escaped = moment(value).format('MMDDYYYY')
  new Handlebars.SafeString(escaped)

Em.Handlebars.helper 'smallDate', (value, options) ->
  return value if value is null or value is undefined
  escaped = Handlebars.Utils.escapeExpression(value.toLocaleDateString())
  new Handlebars.SafeString(escaped)

Em.Handlebars.helper 'percent', (value, options) ->
  return value if value is null or value is undefined
  escaped = Handlebars.Utils.escapeExpression(value.toFixed(0) + '%')
  new Handlebars.SafeString(escaped)

Em.Handlebars.helper 'currency', (value, options) ->
  return value if value is null or value is undefined
  escaped = Handlebars.Utils.escapeExpression('$' + value.toFixed(2))
  new Handlebars.SafeString(escaped)

Em.Handlebars.helper 'summarize', (value, oprions) ->
  return value if value is null or value is undefined
  value = value.substr(0, 255) + ' ...'

  escaped = Handlebars.Utils.escapeExpression(value)
  new Handlebars.SafeString(escaped)

Em.Handlebars.helper 'toFixed', (number, digits) ->
  number.toFixed(digits)