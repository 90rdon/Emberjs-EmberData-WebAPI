# App.ModalView = Em.View.extend
#   didInsertElement: ->
#     @$('.modal, .modal-backdrop').addClass 'in'

#   layoutName: 'modal_layout'
#   close: ->
#     view = this
    
#     # use one of: transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd
#     # events so the handler is only fired once in your browser
#     @$('.modal').one 'transitionend', (ev) ->
#       view.controller.send 'close'

#     @$('.modal, .modal-backdrop').removeClass 'in'

App.ModalView = Ember.View.extend
  templateName: 'modal'
  title: ''
  content: ''
  classNames: ['modal', 'fade', 'hide']
  didInsertElement: ->
    @$().modal 'show'
    @$().one 'hidden', @_viewDidHide

  
  # modal dismissed by example clicked in X, make sure the modal view is destroyed
  _viewDidHide: ->
    @destroy()  unless @isDestroyed

  
  # here we click in close button so _viewDidHide is called
  close: ->
    @$('.close').click()