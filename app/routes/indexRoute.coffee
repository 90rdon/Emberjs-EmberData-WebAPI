App.IndexRoute = Em.Route.extend
  setupController: (controller, model) ->
    controller.set 'model', App.Debtor.find()
    @controllerFor('countries').set 'content', App.Country.find()
    @controllerFor('relationships').set 'content', App.Relationship.find()