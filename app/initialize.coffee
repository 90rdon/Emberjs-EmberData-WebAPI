window.App = require 'app'

#/////////////////////////////////
#// Helpers
#/////////////////////////////////

require 'helpers/handlebarsHelpers'
# require 'helpers/datePicker'

#/////////////////////////////////
#// Controllers
#/////////////////////////////////

require 'controllers/applicationController'
require 'controllers/helpers/columnItemController'
require 'controllers/helpers/columnSorterController'
require 'controllers/helpers/editObjectController'
require 'controllers/contactController'
require 'controllers/contactsController'
require 'controllers/debtorController'
require 'controllers/debtorsController'
require 'controllers/indexController'
require 'controllers/personsController'
require 'controllers/personController'
require 'controllers/employmentController'
require 'controllers/employmentsController'
require 'controllers/noteController'
require 'controllers/notesController'
# require 'controllers/cancellationController'

require 'controllers/lookupDataController'

#//////////////////////////////////
#// Models
#//////////////////////////////////

require 'models/client'
require 'models/contact'
require 'models/debtor'
require 'models/employment'
require 'models/note'
require 'models/person'
require 'models/relationship'
require 'models/country'
require 'models/phoneTypes'
require 'models/actionCode'
require 'models/resultCode'
require 'models/clientDebtor'

#/////////////////////////////////
#// Routes
#/////////////////////////////////

require 'routes/indexRoute'
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
require 'templates/contactDetail'
require 'templates/debtor/_edit'
require 'templates/debtor'
require 'templates/debtorDetail'
require 'templates/index'
require 'templates/person/_edit'
require 'templates/person'
require 'templates/persons'
require 'templates/employment/_edit'
require 'templates/employment'
require 'templates/employments'
require 'templates/note'
require 'templates/notes'
require 'templates/_cancellation'
require 'templates/modal_layout'
require 'templates/empty'
require 'templates/_confirmation'
require 'templates/_hold'
require 'templates/_cancellationSuccess'
require 'templates/_holdSuccess'
require 'templates/_loading'

#/////////////////////////////////
#// Views
#/////////////////////////////////

# require 'views/debtorsListView'
# require 'views/contactsListView'
require 'views/scrollView'
require 'views/datePickerField'
require 'views/modalView'
require 'views/confirmationView'

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

App.AJAX_LOADER_IMG = "/images/ajax_loader.gif"
App.DEFAULT_CSS_TRANSITION_DURATION_MS = 250

App.Router.map ->
  @resource     'index',      path: '/:client_id'
  @resource     'debtor',     path: 'debtor/:debtor_id', ->
    @resource   'contact',    path: 'contact/:contact_id',
    @resource   'person',     path: 'person/:person_id',
    @resource   'employment', path: 'employment/:employment_id',
    @resource   'note',       path: 'note/:note_id'


