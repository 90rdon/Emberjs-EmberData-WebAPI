App.DebtorsController = App.ColumnSorterController.extend
  columns: (-> [
    Em.Object.create(column: 'id')
    Em.Object.create(column: 'firstName')
    Em.Object.create(column: 'middleName')
    Em.Object.create(column: 'lastName')
    Em.Object.create(column: 'address1')
    Em.Object.create(column: 'address2')
    Em.Object.create(column: 'city')
    Em.Object.create(column: 'state')
    Em.Object.create(column: 'zip')
  ]).property()

  filterId: null