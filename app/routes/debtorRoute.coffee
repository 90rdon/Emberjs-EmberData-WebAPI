App.DebtorRoute = Em.Route.extend
  model: (params) ->
    App.Debtor.find(params.debtor_id)

  setupController: (controller, model) ->
    controller.set 'model', model
    @controllerFor('countries').set 'model', App.Country.find()