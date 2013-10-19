App.EditObjectController = Em.ObjectController.extend
  isEditing: false

  confirmationId: (->
    'content-' + @get('id')
  ).property('id')

  loaded: (->
    @setSelections()
  ).observes('@content.isLoaded')

  dirtied: (->
    if not @get('transaction') && @get('isDirty') == true
      @set('transaction', @get('store').transaction())
  ).observes('isDirty')

  actions:
    edit: ->
      @set('isEditing', true)
      @setSelections()

    doneEditing: ->
      @getSelections()
      
      if @get('transaction')
        @get('transaction').commit()

      @set('isEditing', false)
      @transitionToRoute 'debtor'
      
    cancelEditing: ->
      @setSelections()

      if @get('transaction')
        @get('transaction').rollback()
        @set('transaction', null)

      @set('isEditing', false)
      @transitionToRoute 'debtor'

    deleteRecord: (item) ->
      item.deleteRecord()
      @get('store').commit()