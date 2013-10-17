App.DebtorAccountRoute = Em.Route.extend
  observesParameters: [ 'clientId', 'userId', 'canEditDebtor', 'feePercentage' ]
  
  model: (params) ->
    App.DebtorAccount.find(params.debtor_account_id)

  setupController: (controller, model, queryParams) ->
    controller.set 'model', model
    @controllerFor('application').set 'params', @get('queryParameters')
    @controllerFor('countries').set 'content', App.Country.find()
    @controllerFor('relationships').set 'content', App.Relationship.find()
    @controllerFor('actionCodes').set 'content', App.ActionCode.find()
    @controllerFor('resultCodes').set 'content', App.ResultCode.find()
