var statik = require('statik');
console.log(process.env.PORT || 3000);
statik(process.env.PORT || 3000);