App.IndexRoute = Em.Route.extend
  # redirect: ->
  #   @transitionTo 'debtors'
  model: ->
    App.Debtor.find()