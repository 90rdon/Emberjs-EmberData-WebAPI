App.CancellationPopupView = Em.View.extend
  titlePrefix: ''
  parentSelector: ''
  contentSelector: ''
  templateName: '_cancellationWarning'

  willInsertElement: ->
    @set('contentSelector', '#cancellationWarning')
    # @set('templateName', '_cancellationWarning')
    @set('id', 'popoverCancellationFee')
    @set('parentSelector', '#cancellationFee')

  didInsertElement: ->
    self = @
    $(self.parentSelector).popover
      html: true
      placement: 'right'
      container: 'body'
      title: 'Cancellation Fee Limit'
      trigger: 'manual'
      content: ->
        $content = $(self.contentSelector).html()

  willDestroyElement: ->
    @$().popover 'destroy'

  showWarning: (->
    self = @
    if @get('controller.showCancellationWarning')
      $(self.parentSelector).popover 'show'
    else
      $(self.parentSelector).popover 'hide'

  ).observes('controller.showCancellationWarning')

  actions:
    close: ->
      @set('controller.showCancellationWarning', false)

