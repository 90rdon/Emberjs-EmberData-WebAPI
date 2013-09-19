# App.DebtorsListView = Em.ListView.extend
#   init: ->
#     @_super()
#     view = @
#     $(window).on 'resize', ->
#       Em.run.debounce(view, 'resize', 150)

#   resize: ->
#     @set('height', $(window).height() - 200)

#   height: $(window).height() - 90
  
#   rowHeight: 50
  
#   itemViewClass: Em.ListItemView.extend
#     templateName: 'debtorDetail'
