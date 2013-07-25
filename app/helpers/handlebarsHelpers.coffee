Em.Handlebars.helper 'titleize', (value, options) ->
  title = value.replace(/^([a-z])/, (match) ->
    match.toUpperCase()
  )
  escaped = Handlebars.Utils.escapeExpression(title)
  new Handlebars.SafeString(escaped)

Em.Handlebars.helper 'date', (value, options) ->
  escaped = Handlebars.Utils.escapeExpression(value.toLocaleDateString())
  new Handlebars.SafeString(escaped)

Em.Handlebars.helper 'currency', (value, options) ->
  escaped = Handlebars.Utils.escapeExpression('$' + value.toFixed(2))
  new Handlebars.SafeString(escaped)