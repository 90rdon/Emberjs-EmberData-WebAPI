App.JQuerySortableView = Em.CollectionView.extend
  tagName: 'ul'
  contentBinding: 'App.router.applicationController'
  itemViewClass: App.JQuerySortableItemView
  didInsertElement: ->
    @_super()
    @$().sortable().disableSelection()