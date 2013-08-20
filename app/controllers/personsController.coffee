App.PersonsController = App.ColumnSorterController.extend
  columns: (-> [
    Em.Object.create(column: 'name')
    Em.Object.create(column: 'relationship')
    Em.Object.create(column: 'phone')
    Em.Object.create(column: 'city')
    Em.Object.create(column: 'state')
    Em.Object.create(column: 'comment')
  ]).property()