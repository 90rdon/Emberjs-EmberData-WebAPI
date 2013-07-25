exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.
  coffeelint:
    pattern:                                /^app\/.*\.coffee$/
    options:
      indentation:
        value: 2
        level: "error"

  files:
    javascripts:
      joinTo:
        'javascripts/app.js':               /^app/
        'javascripts/vendor.js':            /^vendor/
        'test/javascripts/test.js':         /^test[\\/](?!vendor)/
        'test/javascripts/test-vendor.js':  /^test[\\/](?=vendor)/
      order:
        # Files in `vendor` directories are compiled before other files
        # even if they aren't specified in order.
        before: [
          'vendor/scripts/console-helper.js'
          'vendor/scripts/jquery.js'
          'vendor/scripts/handlebars.js'
          'vendor/scripts/ember.js'
          'vendor/scripts/ember-data.js'
          'vendor/scripts/bootstrap.js'
        ]

    stylesheets:
      joinTo:
        'stylesheets/app.css':              /^(app|vendor)/
        'test/stylesheets/test.css':        /^test/
      order:
        before:         ['vendor/styles/normalize.css']
        after:          ['vendor/styles/helpers.css']

    templates:
      precompile:       true
      root:             'app/templates'
      joinTo:           'javascripts/app.js' : /^app/
      defaultExtension: 'emblem'
      paths:
        # If you don't specify jquery and ember there,
        # raw (non-Emberized) Handlebars templates will be compiled.
        jquery:         'vendor/scripts/jquery.js'
        ember:          'vendor/scripts/ember.js'
        handlebars:     'vendor/scripts/handlebars.js'
        emblem:         'vendor/scripts/emblem.js'

  conventions:
    ignored: -> false

  server:
    path:       'server.coffee'
    port:       3333
    run:        yes
    base:       '/'

