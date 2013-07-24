window.App = require 'app'

#/////////////////////////////////
#// Controllers
#/////////////////////////////////

require 'controllers/debtorsController'
require 'controllers/debtorController'

#//////////////////////////////////
#// Models
#//////////////////////////////////

require 'models/debtor'
require 'models/contact'
require 'models/relatedPerson'
require 'models/employment'
require 'models/historicalEvent'
require 'models/debtorData'

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

require 'store/fixtureAdapter'

#/////////////////////////////////
#// Router
#/////////////////////////////////

# App.Router.reopen(
#   location: 'history'
# )

App.Router.map ->
  @route 'about', path: '/about'
  # @route 'debtors', path: '/debtors'
  @route 'index', path: '/'
  @resource   'debtors', () ->
    @resource 'debtor', path: ':debtor_id'
