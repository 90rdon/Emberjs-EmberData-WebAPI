App.DebtorRoute = Em.Route.extend
  model: (params) ->
    App.Debtor.find(params.debtor_id)

  setupController: (controller, model) ->
    controller.set 'model', model
    @controllerFor('countries').set 'content', App.Country.find()
    @controllerFor('relationships').set 'content', App.Relationship.find()