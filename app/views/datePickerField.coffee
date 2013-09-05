App.DatePickerField = Em.TextField.extend
  classNames: ['date-picker']

  textToDateTransform: ((key, value) ->
    if arguments.length == 2
      if value instanceof Date
        @set 'date', date
        @close()
      else if value && /\d{4}\/\d{2}\/\d{2}/.test(value)
        parts = value.split '-'
        date = new Date()
        date.setYear parts[0]
        date.setMonth parts[1] - 1
        date.setDate parts[2]

        @set 'date',  date
        @close()
      else
        @set 'date', null
    else if arguments.length == 1 && @get('date')
      month =  @get('date').getMonth() + 1
      date = @get('date').getDate()

      month = "0#{month}" if month < 10
      date = "0#{date}" if date < 10

      "%@-%@-%@".fmt @get('date').getFullYear(), month, date
  ).property('value')

  format: "mm/dd/yyyy"
  placeholder: Ember.computed.alias('format')

  size: 8

  valueBinding: "textToDateTransform"

  yesterday: (->
    date = new Date()
    date.setDate date.getDate() - 1
    date
  ).property()

  didInsertElement: ->
    @$().datepicker({
      format: @get('format')
      autoclose: true
      todayHighlight: true
      keyboardNavigation: false
      # startDate: @get('yesterday') # datepicker is not inclusive
    }).on 'changeDate', (ev) =>
      @set('date', ev.date)
      @$().datepicker('setValue', ev.date)

  close: ->
    @$().datepicker('hide')