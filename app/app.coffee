# Application bootstrapper

module.exports = Em.Application.create
  LOG_TRANSITIONS:  true

  # web API
  # prod
  # serverUrl:        'https://crmtitaniuminterface.hunterwarfield.com'
  # serverNamespace:  'api'

  #dev
  serverUrl:        'http://10.211.55.4'
  serverNamespace:  'hunter-warfield/api'
  paymentPostingUrl:'http://paymentposting.hunterwarfield.com'