((exports) ->
  Em.RadioButton = Em.View.extend
    tagName:            'input'
    type:               'radio'
    attributeBindings:  [ 'name', 'type', 'value', 'checked:checked:' ]
    click: ->
      @set 'selection', @$().val()

    checked: (->
      @get('value') is @get('selection')
    ).property()
) {}