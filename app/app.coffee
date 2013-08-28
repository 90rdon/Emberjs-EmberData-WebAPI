# Application bootstrapper

module.exports = Em.Application.create
  LOG_TRANSITIONS:  true

  # web API
  serverUrl:        'http://10.211.55.4'
  serverNamespace:  'hunter-warfield/api'
  paymentPostingUrl:'http://paymentposting.hunterwarfield.com'