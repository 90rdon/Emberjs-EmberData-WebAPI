App.CancellationFeeView = Em.TextField.extend
  elementId: 'cancellationFee'
  
  _updateElementValue: Em.observer(->
    ele = @$()
    value = ele.val().replace('%', '')
    length = value.length
    pos = length
    @$().val @get('value')
    ele.prop
      selectionStart: pos
      selectionEnd: pos

  , 'value')

  keyUp: (e) ->
    @interpretKeyEvents(e)
    @set('value', @get('value').replace('%', '') + '%')
