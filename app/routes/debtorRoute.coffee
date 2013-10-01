App.DebtorRoute = Em.Route.extend
  observesParameters: [ 'clientId', 'userId', 'canEditDebtor' ]
  
  model: (params) ->
    App.Debtor.find(params.debtor_id)

  setupController: (controller, model) ->
    controller.set 'model', model
    @controllerFor('application').set 'clientId', @get('queryParameters').clientId
    @controllerFor('application').set 'params', @get('queryParameters')
    @controllerFor('countries').set 'content', App.Country.find()
    @controllerFor('relationships').set 'content', App.Relationship.find()
    @controllerFor('actionCodes').set 'content', App.ActionCode.find()
    @controllerFor('resultCodes').set 'content', App.ResultCode.find()

  # events:
  #   openContact: (modal) ->
  #     console.log 'opening modal with ' + modal
  #     @render 'contact',
  #       into: 'debtor'
  #       outlet: 'modal'
  #       controller: modal


  #   close: ->
  #     App.animateModalClose().then(->
  #       @render 'empty',
  #         into: 'debtor'
  #         outlet: 'modal'

  #     ).bind(this)