App.DebtorsRoute = Em.Route.extend
  model: ->
    App.Debtor.find()