App.EmploymentController = App.EditObjectController.extend
  needs: [
    'debtor'
    'associations'
    'employmentStatuses'
    'countries'
  ]

  setSelections: ->
    @get('controllers.associations').setSelectedById(@get('association'))
    @get('controllers.countries').setSelectedById(@get('country'))
    @get('controllers.employmentStatuses').setSelectedById(@get('status'))

  getSelections: ->
    @set('country', @get('controllers.countries').getSelectedId())
    @set('status', @get('controllers.employmentStatuses').getSelectedId())
    @set('association', @get('controllers.associations').getSelectedId())