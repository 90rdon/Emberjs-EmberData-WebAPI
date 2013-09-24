App.ClientRoute = Em.Route.extend
  model: (params) ->
    App.Client.find(params.client_id)

  setupController: (controller, model) ->
    controller.set 'model', model