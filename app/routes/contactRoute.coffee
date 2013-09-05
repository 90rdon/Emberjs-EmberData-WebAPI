# App.ContactRoute = Em.Route.extend
#   events:
#     # open: (modal) ->
#     #   console.log 'opening modal from route ' + modal
#     #   # @render 'contact',
#     #   #   into: 'debtor'
#     #   #   outlet: 'modal'
#     showModal: (model) ->
#       App.ModalView.create
#         title: 'My title'
#         content: model
#       .append()


#     close: ->
#       console.log 'closing modal'
#       # App.animateModalClose().then(->
#       #   @render 'empty',
#       #     into: 'debtor'
#       #     outlet: 'modal'
#       # ).bind(this)