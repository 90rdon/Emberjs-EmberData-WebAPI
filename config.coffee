fs      = require 'fs'
sysPath = require 'path'

exports.config =
  paths:
    public: 'public'

  coffeelint:
    pattern:                                                            /^app\/.*\.coffee$/
    options:
      indentation:
        value: 2
        level: "error"
      max_line_length:
        value: 500
        level: 'warn'

  files:
    javascripts:
      joinTo:
        'javascripts/app.js':                                           /^app/
        'javascripts/vendor.js':                                        /^vendor/
        '../server/hunter-warfield.WebAPI/Scripts/app.js':              /^app/
        '../server/hunter-warfield.WebAPI/Scripts/vendor.js':           /^vendor/
        'test/javascripts/test.js':                                     /^test[\\/](?!vendor)/
        'test/javascripts/test-vendor.js':                              /^test[\\/](?=vendor)/
      order:
        # Files in `vendor` directories are compiled before other files
        # even if they aren't specified in order.
        before: [
          'vendor/scripts/console-helper.js'
          'vendor/scripts/jquery-1.9.1.js'
          'vendor/scripts/jquery-ui-1.10.1.custom.min.js'
          'vendor/scripts/jquery.mousewheel.js'
          'vendor/scripts/handlebars-1.0.0.js'
          'vendor/scripts/ember-1.0.0.js'
          'vendor/scripts/ember-data.js'
          'vendor/scripts/router.js'
          'vendor/scripts/bootstrap.js'
          'vendor/scripts/ember-bootstrap.js'
          'vendor/scripts/bootstrap-datepicker.js'
          'vendor/scripts/moment.js'
        ]

    stylesheets:
      joinTo:
        'stylesheets/app.css':                                          /^(app|vendor)/
        '../server/hunter-warfield.WebAPI/Content/app.css':             /^(app|vendor)/
        'test/stylesheets/test.css':                                    /^test/
      order:
        before: [
          'vendor/styles/normalize.css'
        ]
        after: [
          'vendor/styles/helpers.css'
          'vendor/styles/hwi.css'
        ]

    templates:
      precompile:       true
      root:             'app/templates'
      joinTo:           
        'javascripts/app.js' :                                          /^app/
        '../server/hunter-warfield.WebAPI/Scripts/app.js':              /^app/
      defaultExtension: 'emblem'
      paths:
        # If you don't specify jquery and ember there,
        # raw (non-Emberized) Handlebars templates will be compiled.
        jquery:         'vendor/scripts/jquery-1.9.1.js'
        ember:          'vendor/scripts/ember-1.0.0.js'
        handlebars:     'vendor/scripts/handlebars-1.0.0.js'
        emblem:         'vendor/scripts/emblem.js'

  conventions:
    ignored: (path) ->
      startsWith = (string, substring) ->
          string.indexOf(substring, 0) is 0
      sep = sysPath.sep
      if path.indexOf("app#{sep}templates#{sep}") is 0
          false
      else
          startsWith sysPath.basename(path), '_'
  
  server:
    path:       'server.coffee'
    port:       3333
    run:        yes
    base:       '/'

