App.PersonController = Em.ObjectController.extend
  needs: [
    'countries'
    'relationships'
    'titles'
  ]

  loaded: (->
    @get('controllers.countries').setSelectedById(@get('country'))
    @get('controllers.relationships').setSelectedById(@get('relationship'))
    @get('controllers.titles').setSelectedById(@get('title'))
  ).observes('@content.isloaded')

  doneEditing: ->
    @set('country', @get('controllers.countries').getSelectedId())
    @set('relationship', @get('controllers.relationships').getSelectedId())
    @set('title', @get('controllers.titles').getSelectedId())

    @get('store').commit()
    @transitionToRoute 'debtor'