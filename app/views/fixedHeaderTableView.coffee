App.FixedHeaderTableView = Em.View.extend
  classNames: ['table-fixed-header']

  didInsertElement: ->
    @$('.table-fixed-header').fixedHeader()