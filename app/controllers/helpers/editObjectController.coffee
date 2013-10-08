App.EditObjectController = Em.ObjectController.extend
  isEditing: false

  confirmationId: (->
    'content-' + @get('id')
  ).property('id')

  loaded: (->
    @setSelections()
  ).observes('@content.isLoaded')

  dirtied: (->
    if (@get('transaction') == null || @get('transaction') == undefined) && @get('isDirty') == true
      @set('transaction', @get('store').transaction())
  ).observes('isDirty')

  actions:
    edit: ->
      @set('isEditing', true)
      @setSelection

    doneEditing: ->
      @getSelections()
      
      if @get('transaction') != null || @get('transaction') == undefined
        @get('transaction').commit()

      @set('isEditing', false)
      @transitionToRoute 'debtor'
      
    cancelEditing: ->
      @setSelections()

      if @get('transaction') != null || @get('transaction') == undefined
        @get('transaction').rollback()

      @set('isEditing', false)
      @transitionToRoute 'debtor'

    deleteRecord: (item) ->
      item.deleteRecord()
      @get('store').commit()