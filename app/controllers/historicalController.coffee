App.HistoricalController = Em.ObjectController.extend
  close: ->
    @transitionToRoute 'debtor'