# DS.WebAPIAdapter.map 'App.Debtor',
  
#   # Web API server is not handling reference update/delete, so use 'load' instead of 'always'
#   address:
#     embedded: 'always'


# serializer = DS.WebAPISerializer
# serializer.configure 'App.Debtor',
#   sideloadAs: 'todoList'
#   primaryKey: 'todoListId'

# serializer.configure 'App.Todo',
#   sideloadAs: 'todo'
#   primaryKey: 'todoItemId'

App.Store = DS.Store.extend
  # adapter: DS.WebAPIAdapter.create()
  adapter: DS.RESTAdapter.extend
    url: 'http://localhost'
    namespace: 'hunter-warfield/api'
    bulkCommit: false
    serializer: DS.WebAPISerializer
    plurals:
      debtor: 'debtors'