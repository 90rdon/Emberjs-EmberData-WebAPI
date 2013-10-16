App.EmploymentController = App.EditObjectController.extend
  needs: [
    'debtor'
    'associations'
    'employmentStatuses'
    'countries'
    'sources'
  ]

  labelEmploymentStatus: (->
    status = @get('controllers.employmentStatuses').findProperty('id', @get('status'))
    return null   if status == null || status == undefined
    status.label
  ).property('status')

  labelSource: (->
    source = @get('controllers.sources').findProperty('id', @get('source'))
    return null   if source == null || source == undefined
    source.label
  ).property('source')

  actions:
    setSelections: ->
      @get('controllers.associations').setSelectedById(@get('association'))
      @get('controllers.countries').setSelectedByIdStr(@get('country'))
      @get('controllers.employmentStatuses').setSelectedById(@get('status'))
      @get('controllers.sources').setSelectedById(@get('source'))

    getSelections: ->
      @set('country', @get('controllers.countries').getSelectedId())
      @set('status', @get('controllers.employmentStatuses').getSelectedId())
      @set('association', @get('controllers.associations').getSelectedId())
      @set('source', @get('controllers.sources').getSelectedId())