App.Store = DS.Store.extend
  adapter:                    DS.WebAPIAdapter.extend
    url:                      'http://10.211.55.4'
    namespace:                'hunter-warfield/api'
    bulkCommit:               false,
    antiForgeryTokenSelector: '#antiForgeryToken'

    pluralize: (string) ->
      string + 's'