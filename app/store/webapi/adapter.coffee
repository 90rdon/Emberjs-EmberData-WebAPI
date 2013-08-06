#require('ember-data/core')
#require('ember-data/system/adapter')
#require('ember-data/adapater/rest_adapter')
#require('ember-data/serializers/webapi_serializer')
#global jQuery


rejectionHandler = (reason) ->
  Em.Logger.error reason, reason.message
  throw reason

get = Em.get

DS.WebAPIAdapter = DS.RESTAdapter.extend
  serializer: DS.WebAPISerializer
  antiForgeryTokenSelector: null
  
  shouldSave: (record) ->
    # By default Web API doesn't handle children update from parent.
    true

  
  # Delete parent records does not dirty the children records
  dirtyRecordsForBelongsToChange: null
  createRecord: (store, type, record) ->
    root = @rootForType(type)
    adapter = this
    data = @serialize(record,
      includeId: false
    )
    
    # need to remove the primaryKey field
    config = get(this, 'serializer').configurationForType(type)
    primaryKey = config and config.primaryKey
    delete data[primaryKey]  if primaryKey
    @ajax(@buildURL(root), 'POST',
      data: data
    ).then((json) ->
      adapter.didCreateRecord store, type, record, json
    , (xhr) ->
      adapter.didError store, type, record, xhr
      throw xhr
    ).then null, rejectionHandler

  updateRecord: (store, type, record) ->
    id = get(record, 'id')
    adapter = this
    root = @rootForType(type)
    data = @serialize(record,
      includeId: true
    )
    @ajax(@buildURL(root, id), 'PUT',
      data: data
    , 'text').then((json) ->
      adapter.didSaveRecord store, type, record, json
      record.set 'error', ''
    , (xhr) ->
      adapter.didSaveRecord store, type, record
      record.set 'error', 'Server update failed'
    ).then null, rejectionHandler

  deleteRecord: (store, type, record) ->
    id = get(record, 'id')
    adapter = this
    root = @rootForType(type)
    config = get(this, 'serializer').configurationForType(type)
    primaryKey = config and config.primaryKey
    
    # webAPI delete will just return the original record, shouldn't save it back
    # ignore the returned json object
    @ajax(@buildURL(root, id), 'DELETE').then((json) ->
      if json[primaryKey] is id
        adapter.didSaveRecord store, type, record
      else
        adapter.didSaveRecord store, type, record, json
    , (xhr) ->
      adapter.didError store, type, record, xhr
      throw xhr
    ).then null, rejectionHandler

  ajax: (url, type, hash, dataType) ->
    adapter = this
    new Em.RSVP.Promise((resolve, reject) ->
      hash = hash or {}
      hash.url = url
      hash.type = type
      hash.dataType = 'json' #dataType or 'json'
      hash.context = adapter
      if hash.data and type isnt 'GET'
        hash.contentType = 'application/json; charset=utf-8'
        hash.data = JSON.stringify(hash.data)
      
      # if antiForgeryTokenSelector attribute exists, pass it in the hearder
      antiForgeryTokenElemSelector = get(adapter, 'antiForgeryTokenSelector')
      if antiForgeryTokenElemSelector
        antiForgeryToken = $(antiForgeryTokenElemSelector).val()
        hash.headers = RequestVerificationToken: antiForgeryToken  if antiForgeryToken
      hash.success = (json) ->
        Em.run null, resolve, json

      hash.error = (jqXHR, textStatus, errorThrown) ->
        Em.run null, reject, errorThrown

      jQuery.ajax hash
    )




