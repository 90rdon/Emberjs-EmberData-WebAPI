App.Pollster =
  start: ->
    @timer = setInterval(@onPoll.bind(this), 5000)

  stop: ->
    clearInterval @timer

  onPoll: ->
    App.NotesController.refresh()