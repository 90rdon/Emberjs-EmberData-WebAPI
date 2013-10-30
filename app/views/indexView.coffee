App.IndexView = Ember.View.extend
  didInsertElement: ->
    
    # we want to make sure 'this' inside `didScroll` refers
    # to the IndexView, so we use jquery's `proxy` method to bind it
    $('#debtors-grid').on 'scroll', $.proxy(@didScroll, this)

  willDestroyElement: ->
    
    # have to use the same argument to `off` that we did to `on`
    $('#debtors-grid').off 'scroll', $.proxy(@didScroll, this)

  
  # this is called every time we scroll
  didScroll: ->
    if @isScrolledToBottom() == 1
      @get('controller').send 'getMore'
    else if @isScrolledToBottom() == 0
      return false
  
  # we check if we are at the bottom of the page
  isScrolledToBottom: ->
    documentHeight = $('#table-body').height()
    gridHeight = $('#debtors-grid').height()
    viewPortTop = $('#debtors-grid').scrollTop()
    distance = documentHeight - gridHeight + 20
    pos = distance - viewPortTop

    return 0 if viewPortTop is 0
    return 1 if pos is 0
    2