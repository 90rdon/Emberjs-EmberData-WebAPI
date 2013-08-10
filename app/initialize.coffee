window.App = require 'app'

#/////////////////////////////////
#// Helpers
#/////////////////////////////////

require 'helpers/handlebarsHelpers'
require 'helpers/radioButton'

#/////////////////////////////////
#// Controllers
#/////////////////////////////////

require 'controllers/columnItemController'
require 'controllers/contactController'
# require 'controllers/contactEditController'
require 'controllers/contactsController'
require 'controllers/debtorController'
require 'controllers/debtorsController'

#//////////////////////////////////
#// Models
#//////////////////////////////////

require 'models/contact'
require 'models/debtor'
require 'models/employment'
require 'models/historicalEvent'
require 'models/relatedPerson'

#/////////////////////////////////
#// Routes
#/////////////////////////////////

require 'routes/indexRoute'
require 'routes/debtorsRoute'
require 'routes/debtorRoute'

#//////////////////////////////////
#// Templates
#//////////////////////////////////

require 'templates/_well'
require 'templates/about'
require 'templates/application'
require 'templates/contact/_edit'
require 'templates/contact'
require 'templates/contacts'
require 'templates/debtor/_edit'
require 'templates/debtor'
require 'templates/debtors'
require 'templates/index'

#/////////////////////////////////
#// Views
#/////////////////////////////////



#/////////////////////////////////
#// Store
#/////////////////////////////////

# require 'store/fixtureAdapter'
require 'store/webapi/serializer'
require 'store/webapi/adapter'
require 'store/RESTfulAdapter'

#/////////////////////////////////
#// Router
#/////////////////////////////////

# App.Router.reopen(
#   location: 'history'
# )

App.Router.map ->
  @route          'about', path: '/about'
  @route          'index', path: '/'
  @route          'debtors'
  @resource       'debtor', path: '/debtor/:debtor_id', ->
    @resource     'contact', path: '/contact/:contact_id'



