App.ContactView = Bootstrap.ModalPane.popup
  heading: 'Sample modal pane'
  message: 'Sample message'
  primary: 'OK'
  secondary: 'Cancel'
  showBackdrop: true
  callback: (opts, event) ->
    if opts.primary

    
    # primary button was pressed
    else if opts.secondary

    
    # secondary button was pressed
    else
    # close was pressed