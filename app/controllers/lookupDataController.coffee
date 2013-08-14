App.ConsumerFlagsController = Em.ArrayController.create
  content: [
    Em.Object.create({id: 'N', type: 'Consumer'}),
    Em.Object.create({id: 'Y', type: 'Commerical'})
  ]

App.TitlesController = Em.ArrayController.create
  selected: null

  content: [
    Em.Object.create({title: ''})
  ]

  getObjectById: (id) ->
    return @get('content').filterProperty('id', id).get('firstObject')

  setSelectedById: (id) ->
    @set('selected', @getObjectById(id))