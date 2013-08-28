App.ContactsListView = Em.ListView.extend
  height: 200
  
  rowHeight: 50
  
  itemViewClass: Em.ListItemView.extend
    templateName: 'contactDetail'
