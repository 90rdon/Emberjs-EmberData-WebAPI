App.NotesController = App.ColumnSorterController.extend
  needs: [
    'actionCodes'
    'debtor'
  ]

  columns: (-> [
    Em.Object.create(column: 'time')
    Em.Object.create(column: 'actionCode')
    Em.Object.create(column: 'resultCode')
    Em.Object.create(column: 'message')
  ]).property()

  loaded: (->
    @set('sortProperties', ['time'])
    @set('sortAscending', false)
  ).observes('content.@each')


  # # note array collection
  # content: []
  
  # # Default query is blank.
  # query: []
  
  # # Simple id-to-model mapping for searches and duplicate checks.
  # _idCache: {}
  
  # Add a Note.note instance to this collection.
  # Most of the work is in the built-in `pushObject` method,
  # but this is where we add our simple duplicate checking.
  addNote: (note) ->
    
    # The `id` from Twitter's JSON
    id = note.id
    
    # If we don't already have an object with this id, add it.
    if typeof @_idCache[id] is 'undefined'
      @pushObject note
      @_idCache[id] = note.id

  
  # # Public method to fetch more data. Get's called in the loop
  # # above as well as whenever the `query` variable changes (via
  # # an observer).
  
  # # Only fetch if we have a query set.
  
  # # Poll for notes
  
  # # Make a model for each result and add it to the collection.
  # refresh: ((debtorId)->
  #   console.log 'debtor id = ' + debtorId
  #   query = @get('query')
  #   if Em.isEmpty(debtorId)
  #     @set 'content', []
  #     return
  #   self = this
  #   url = App.serverUrl + '/' + App.serverNamespace + '/debtorNotes/?debtorId=' + debtorId
  #   console.log 'refresh url = ' + url
  #   $.getJSON url, (data) ->
  #     i = 0

  #     while i < data.length
  #       # self.addNote App.Note.createRecord(data[i])
  #       console.log data[i]
  #       self.addNote data[i]
  #       i++

  # ).observes('query')