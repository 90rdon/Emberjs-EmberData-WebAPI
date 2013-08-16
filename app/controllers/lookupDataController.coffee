App.LookupDataController = Em.ArrayController.extend
  selected: null
  content: []
  getSelectedId: ->
    return @get('selected.id')

  getObjectById: (id) ->
    return @get('content').filterProperty('id', id).get('firstObject')

  # getLabelById: (id) ->
  #   return @get('content').filterProperty('id', id).get('firstObject.type')

  setSelectedById: (id) ->
    @set('selected', @getObjectById(id))

# -----------------------------------------------------------------------------

App.ConsumerFlagsController = App.LookupDataController.extend
  content: [
    Em.Object.create({id: 'N', label: 'Consumer'}),
    Em.Object.create({id: 'Y', label: 'Commerical'})
  ]

App.TitlesController = App.LookupDataController.extend
  content: [
    Em.Object.create({id: 'Dr.'})
    Em.Object.create({id: 'Miss'})
    Em.Object.create({id: 'Mr.'})
    Em.Object.create({id: 'Mrs.'})
    Em.Object.create({id: 'Ms.'})
    Em.Object.create({id: 'Prof'})
  ]

App.SuffixesController = App.LookupDataController.extend
  content: [
    Em.Object.create({id: 'Jr.'})
    Em.Object.create({id: 'Sr.'})
    Em.Object.create({id: 'Esq.'})
    Em.Object.create({id: 'I'})
    Em.Object.create({id: 'II'})
    Em.Object.create({id: 'III'})
  ]

App.ValidInvalidController = App.LookupDataController.extend
  content: [
    Em.Object.create({id: 1, label: 'Valid'})
    Em.Object.create({id: 2, label: 'Invalid'})
  ]

App.YesNoController = App.LookupDataController.extend
  content: [
    Em.Object.create({id: 'Y', label: 'Yes'})
    Em.Object.create({id: 'N', label: 'No'})
  ]

App.PhoneTypesController = App.LookupDataController.extend
  content: [
    Em.Object.create({id: 0, label: 'Unknown'})
    Em.Object.create({id: 1, label: 'Home'})
    Em.Object.create({id: 2, label: 'Work'})
    Em.Object.create({id: 3, label: 'Cell'})
    Em.Object.create({id: 4, label: 'Fax'})
    Em.Object.create({id: 5, label: 'VOIP'})
  ]

App.PhoneStatusesController = App.LookupDataController.extend
  content: [
    Em.Object.create({id: 0, label: 'Unknown'})
    Em.Object.create({id: 1, label: 'Valid'})
    Em.Object.create({id: 2, label: 'Invalid'})
    Em.Object.create({id: 3, label: 'New'})
    Em.Object.create({id: 4, label: 'Valid - Do not call'})
  ]

App.PhoneSourcesController = App.LookupDataController.extend
  content: [
    Em.Object.create({id: 0, label: 'Unknown'})
    Em.Object.create({id: 1, label: 'Type In'})
    Em.Object.create({id: 2, label: 'Client'})
    Em.Object.create({id: 3, label: 'Skip Trance'})
    Em.Object.create({id: 4, label: 'Consumer Portal'})
  ]

App.AssociationsController = App.LookupDataController.extend
  content: [
    Em.Object.create({id: '1', label: 'Consumer'})
    Em.Object.create({id: '2', label: 'Spouse'})
  ]

App.EmploymentStatusesController = App.LookupDataController.extend
  content: [
    Em.Object.create({id: 1, label: 'Employed'})
    Em.Object.create({id: 2, label: 'Full Time'})
    Em.Object.create({id: 3, label: 'Part Time'})
    Em.Object.create({id: 4, label: 'Unemployed'})
    Em.Object.create({id: 5, label: 'Other'})
    Em.Object.create({id: 6, label: 'Self Employed'})
  ]

App.CountriesController = App.LookupDataController.extend
  loaded: (->
    @set('sortAscending', true)
  ).observes('@content.isloaded')

App.RelationshipsController = App.LookupDataController.extend()
    


