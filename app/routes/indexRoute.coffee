App.IndexRoute = Em.Route.extend
  setupController: (controller, model) ->
    @controllerFor('debtors').set 'model', App.Debtor.find()

  renderTemplate: ->
    @render 'debtors',
      controller: 'debtors'