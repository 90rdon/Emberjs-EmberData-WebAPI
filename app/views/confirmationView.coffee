App.ConfirmationView = Em.View.extend
  titlePrefix: ''
  parentSelector: ''
  contentSelector: ''
  templateName: '_confirmation'

  willInsertElement: ->
    @set('contentSelector', '#content-' + @get('controller.id'))
    @set('templateName', '_confirmation')
    # @set('title', @get('titlePrefix') + @get('controller.phone'))
    @set('id', 'popover' + @get('controller.id'))
    @set('parentSelector', '#' + @get('controller.id'))

  didInsertElement: ->
    self = @
    $(self.parentSelector).popover
      html: true
      placement: 'right'
      container: 'body'
      title: 'Delete Confirmation'
      content: ->
        $content = $(self.contentSelector).html()

  willDestroyElement: ->
    @$().popover 'destroy'

  close: ->
    self = @
    $(self.parentSelector).popover 'hide'