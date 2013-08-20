App.EmploymentsController = App.ColumnSorterController.extend
  columns: (-> [
    Em.Object.create(column: 'name')
    Em.Object.create(column: 'status')
    Em.Object.create(column: 'source')
    Em.Object.create(column: 'phone')
    Em.Object.create(column: 'title')
    Em.Object.create(column: 'hireDate')
  ]).property()