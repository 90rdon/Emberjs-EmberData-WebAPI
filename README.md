# Hunter Warfield

Debtor information from Titanium ORE to Dynamics CRM Project.

### About
This project combines an ASP.NET Web API backend with Ember.js as the frontend.

#### Building Ember.js with Brunch - *Brunch is an assembler for HTML5 applications.*

* Make sure you have Node.js and NPM installed on your machine. Or install them from [Node.js](http://nodejs.org/)
* Get [brunch.io](brunch.io). 
	
	* Mac OSX - [Click here](http://blog.stevenlu.com/2012/05/04/brunchio-on-mac-osx/)
	* Windows - [Click here](http://www.axelscript.com/2013/02/06/installing-brunch-io-on-windows/)

This project is design to run Ember.js with Node.js and IIS as the web server. It is configured to output the javascripts and stylesheets to the `/public/javascripts` and `/public/stylesheets` folders for Node.js and the `/server/hunter-warfield.WebAPI/Scripts` and `/server/hunter-warfield.WebAPI/Content` folders for ASP.NET. Check [*Config.Coffee*](https://github.com/octapus/Hunter-Warfield/blob/master/config.coffee) for more details.

* Git clone the project. 

		$-> git clone https://github.com/octapus/Hunter-Warfield.git
		$-> cd Hunter-Warfield

			
* Install dependencies for the client project.
		
		$-> npm install

* Run from [Node.js](https://github.com/octapus/Hunter-Warfield/wiki/1.--Running-from-Node.js)
* Run from [Windows IIS 7.5](https://github.com/octapus/Hunter-Warfield/wiki/a.-Running-from-Windows-IIS-7.5)