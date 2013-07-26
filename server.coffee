config                  = require './config'
express                 = require 'express'
http                    = require 'http'
 
app                     = express()
server                  = http.createServer(app)
 
app.configure ->
  app.use express.static(__dirname + '/public')
  app.use express.bodyParser()

exports.startServer = (port, path, callback) ->
  server.listen process.env.PORT || port, ->
    addr                = server.address()
    console.log         '---------------------------------------------'
    console.log         '--- app is listening on http://' + addr.address + ':' + addr.port
    console.log         '---------------------------------------------'

if process.env.NODE_ENV == 'production'
  exports.startServer()