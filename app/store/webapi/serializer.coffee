#require('ember-data/serializers/json_serializer')

get = Em.get

DS.WebAPISerializer = DS.JSONSerializer.extend
  keyForAttributeName: (type, name) ->
    # do not do decamelize
    name

  extractMany: (loader, json, type, records) ->
    root = @rootForType(type)
    root = @pluralize(root)
    objects = undefined
    
    # detect if returned json is Array
    if json instanceof Array
      objects = json
    else
      @sideload loader, type, json, root
      @extractMeta loader, type, json
      objects = json[root]
    if objects
      references = []
      records = records.toArray()  if records
      i = 0

      while i < objects.length
        loader.updateId records[i], objects[i]  if records
        reference = @extractRecordRepresentation(loader, type, objects[i])
        references.push reference
        i++
      loader.populateArray references

  extract: (loader, json, type, record) ->
    # don't have json[root] in the returned json data
    loader.updateId record, json  if record
    @extractRecordRepresentation loader, type, json

  rootForType: (type) ->
    typeString = type.toString()
    Em.assert 'Your model must not be anonymous. It was ' + type, typeString.charAt(0) isnt '('
    
    # use the last part of the name as the URL
    parts = typeString.split('.')
    name = parts[parts.length - 1]
    
    # don't do capital case replacement
    name.toLowerCase()