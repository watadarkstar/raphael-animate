# [Raphael Animate jQuery Plugin](http://twitter.com/wataweb) [![Build Status](https://secure.travis-ci.org/watadarkstar/raphael-animate.png?branch=master)](http://travis-ci.org/watadarkstar/raphael-animate)

jQuery Animation Plugin written in CoffeeScript to help you create animations in a clean and quick way.

## Version

v0.0.1 Develop

## Dev Commands

Clone Repo:

	git clone git@github.com:watadarkstar/raphael-animate.git

Install needed libraries:

	npm install

Compile CoffeeScript:

	grunt coffee

Run test suite in the terminal (headless):

	grunt jasmine

Compile CoffeeScript and run tests suite:

	grunt

Compile CoffeeScript and run tests suite whenever files change (recommended):

	grunt watch

Build and minify plugin:

	grunt build

Running Test Scirpt (for Travis CI):

	npm test

Converting a SVG for use in vectors.js:

	node rappar.js html5.svg

## Documenation

HTML

	<div id="logo"></div>

JavaScript (simple):

	$( '#logo' ).raphaelAnimate( { animations: animations, key: "logo"} );

## Website Url

No URL

## Bug tracker

If you find a bug, please raise it [here](https://github.com/watadarkstar/raphael-animate/issues) on Github! 

## Technologies Used
+ [Raphael](http://raphaeljs.com/)
+ [Rappar](https://github.com/DmitryBaranovskiy/rappar)
+ [CoffeScript](http://coffeescript.org/)
+ [MiniBoilerplate](http://miniboilerplate.com/)

## Resources
+ [The Playground Vector Animation Process](http://playgroundinc.com/blog/the-playground-vector-animation-process/)
+ [Raphael vs Paper vs Processing](http://coding.smashingmagazine.com/2012/02/22/web-drawing-throwdown-paper-processing-raphael/)
+ [DOM vs Canvas vs OpenGL](http://www.goodboydigital.com/to-dom-or-not-to-dom/)
+ [jQuery plugin boilerplate](http://miniboilerplate.com/)

## Developer

Developed by Adrian Carolli

+ [@wataweb](http://twitter.com/wataweb)
+ [Github Profile](http://github.com/watadarkstar)

## Originally authored by

+ [PLAYGROUNDINC.COM](http://playgroundinc.com/)
