App.PersonController = App.EditObjectController.extend
  needs: [
    'countries'
    'relationships'
    'titles'
  ]

  setSelections: ->
    @get('controllers.countries').setSelectedById(@get('country'))
    @get('controllers.relationships').setSelectedById(@get('relationship'))
    @get('controllers.titles').setSelectedById(@get('title'))

  getSelections: ->
    @set('country', @get('controllers.countries').getSelectedId())
    @set('relationship', @get('controllers.relationships').getSelectedId())
    @set('title', @get('controllers.titles').getSelectedId())