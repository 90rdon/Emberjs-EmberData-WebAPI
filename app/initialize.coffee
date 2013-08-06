window.App = require 'app'

#/////////////////////////////////
#// Helpers
#/////////////////////////////////

require 'helpers/handlebarsHelpers'
require 'helpers/radioButton'

#/////////////////////////////////
#// Controllers
#/////////////////////////////////

require 'controllers/debtorsController'
require 'controllers/debtorController'
require 'controllers/columnItemController'

#//////////////////////////////////
#// Models
#//////////////////////////////////

require 'models/debtor'
require 'models/contact'
require 'models/relatedPerson'
require 'models/employment'
require 'models/historicalEvent'
# require 'models/debtorData'

#/////////////////////////////////
#// Routes
#/////////////////////////////////

require 'routes/indexRoute'
require 'routes/debtorsRoute'
require 'routes/debtorRoute'

#//////////////////////////////////
#// Templates
#//////////////////////////////////

require 'templates/application'
require 'templates/index'
require 'templates/about'
require 'templates/_well'
require 'templates/debtors'
require 'templates/debtor'
require 'templates/debtor/_edit'

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
  @route 'about', path: '/about'
  @route 'index', path: '/'
  @resource   'debtors', () ->
    @resource 'debtor', path: ':debtor_id'
