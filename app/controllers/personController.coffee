App.PersonController = App.EditObjectController.extend
  needs: [
    'countries'
    'relationships'
    'titles'
    'suffixes'
  ]

  setSelections: ->
    @get('controllers.countries').setSelectedByIdStr(@get('country'))
    @get('controllers.relationships').setSelectedByIdNum(@get('relationship'))
    @get('controllers.titles').setSelectedById(@get('title'))
    @get('controllers.suffixes').setSelectedById(@get('suffix'))

  getSelections: ->
    @set('country', @get('controllers.countries').getSelectedId())
    @set('relationship', @get('controllers.relationships').getSelectedId())
    @set('title', @get('controllers.titles').getSelectedId())
    @set('suffix', @get('controllers.suffixes').getSelectedId())

  relationshipLoaded: (->
    @get('labelRelationship')
  ).observes('@controllers.relationships.isLoaded')

  labelRelationship: (->
    relationship = @get('controllers.relationships.content').findProperty('idNum', @get('relationship'))
    return null   if relationship == null || relationship == undefined
    relationship.label
  ).property('relationship')