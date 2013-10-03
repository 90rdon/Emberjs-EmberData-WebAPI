App.RadioButton = Em.CollectionView.extend
  classNames:     ['btn-group']
  itemViewClass:  Em.View.extend
    template:     Em.Handlebars.compile('{{view.content.name}}')
    tagName:      'button'
    classNames:   ['btn']
  
  attributeBindings: ['data-toggle','name', 'type', 'value']
  'data-toggle': 'buttons-radio'
  click: ->
    @set 'controller.filterStatus', @$().val()