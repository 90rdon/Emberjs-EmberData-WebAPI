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
    Em.Object.create({
      column: 'id'
      label: 'accountNumber'
      width: 'width:15%;'
      align: 'text-align:left;'
    })
    Em.Object.create({
      column: 'fullName'
      label: 'name'
      width: 'width:30%;'
      align: 'text-align:left;'
    })
    Em.Object.create({
      column: 'placementDate'
      label: 'placementDate'
      width: 'width:15%;'
      align: 'text-align:left;'
    })
    Em.Object.create({
      column: 'totalOriginalBalance'
      label: 'originalBalance'
      width: 'width:10%;'
      align: 'text-align:right;'
    })
    Em.Object.create({
      column: 'totalPayment'
      label: 'totalPayment'
      width: 'width:10%;'
      align: 'text-align:right;'
    })
    Em.Object.create({
      column: 'currentBalance'
      label: 'currentBalance'
      width: 'width:10%;'
      align: 'text-align:right;'
    })
    Em.Object.create({
      column: 'status'
      label: 'status'
      width: 'width:10%;'
      align: 'text-align:center;'
    })
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

  # ----- paging -----
  page: 1
  perPage: 25
  totalPages: (->
    Math.ceil @get('length') / @get('perPage')
  ).property('length', 'perPage')


















