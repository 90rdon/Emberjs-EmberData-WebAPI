App.IndexController = App.ColumnSorterController.extend
  columns: (-> [
    Em.Object.create({ column: 'id', label: 'accountNumber' })
    Em.Object.create({ column: 'fullName', label: 'name' })
    Em.Object.create({ column: 'fullAddress', label: 'address' })
  ]).property()

  currentContent: Em.A([])

  filterDebtors: (->
    @get('filtered')
  ).observes('search')

  sorted: (->
    result = Em.ArrayProxy.createWithMixins Em.SortableMixin, { content:@get('filteredContent'), sortProperties: @get('sortProperties'), sortAscending: @get('sortAscending') }
    @set('currentContent', result)
  ).observes('arrangedContent', 'sortAscending')

  changed: (->
    @get('filtered')
  ).observes('content.@each')

  filteredContent: (->
    regexp = new RegExp(@get('search'))
    result = @get('content').filter (item) ->
      regexp.test item.get('id')
  ).property('search', 'content.@each.id')

  filtered: (->
    result = Em.ArrayProxy.createWithMixins Em.SortableMixin, { content:@get('filteredContent'), sortProperties: @get('sortProperties'), sortAscending: @get('sortAscending') }
    @set('currentContent', result)
  ).observes('filteredContent')