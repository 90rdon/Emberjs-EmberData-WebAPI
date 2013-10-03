App.IndexController = App.ColumnSorterController.extend
  needs: [
    'application'
    'dataFilter'
  ]

  filterCriteria: [
    'Active'
    'Open'
    'All'
  ]

  params: (->
    @get('controllers.application.params')
  ).property('controllers.application.params')

  columns: (-> [
    Em.Object.create({ column: 'id', label: 'accountNumber' })
    Em.Object.create({ column: 'fullName', label: 'name' })
    Em.Object.create({ column: 'totalOriginalBalance', label: 'originalBalance' })
    Em.Object.create({ column: 'currentBalance', label: 'currentBalance' })
    Em.Object.create({ column: 'totalPayment', label: 'totalPayment' })
    Em.Object.create({ column: 'status', label: 'status' })
  ]).property()

  currentContent: Em.A([])

  filterStatus: null

  filterDebtors: (->
    @get('filtered')
  ).observes('search')

  filterByStatus: (->
    console.log 'filtering status ' + @get('filterStatus')
  ).observes('filterStatus')

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