#
# Name    : Raphael Animate
# Author  : Adrian Carolli, www.twitter.com/wataweb, @wataweb
# Version : 0.1
# Repo    : https://github.com/watadarkstar/raphael-animate
# Website : www.twitter.com/wataweb
#

jQuery ->
  $.raphaelAnimate = ( el, options ) ->
    # default plugin settings
    $.raphaelAnimate::defaults =
        FPS:      50
        animations: {}
        debug: true
        key: "animation1"
        looping: true

    # current state
    state = ''

    # animations to play
    animations = {}

    # looping
    looping = true

    # key of animation
    key = "animation1"

    # plugin settings
    @settings = {}

    # jQuery version of DOM element attached to the plugin
    @$el = $ el

    ## -------------- private methods -------------- 

    initAnimations = =>
      @setAnimations @getSetting("animations")
      @setKey @getSetting("key")
      $el = @$el

      if has(animations, key)
        $el.data('initialized', true)#.addClass('replaced');
        ani = getAnimation(key)
        ani.nFrames = 0

        for layer, i in ani.layers
          $canvas = $('<div></div>').addClass('dynamic-canvas').appendTo($el)
          layer.container = $canvas
          layer.paper = Raphael($canvas[0], $canvas.width(), $canvas.height())
          ani.nFrames = Math.max(ani.nFrames, layer.frames.length);

        ani.playing = false
        ani.finished = false
        ani.lastFrame = 0
        ani.tick = 0

        ani.looping = looping
        if (ani.looping)
            $el.addClass('looping');
        else
            $el.addClass('play-once');

        ani.step_once = bind(step_once, ani)
        ani.step = bind(step, ani)
        ani.play = bind(play, ani)

        self = ani
        for layer, i in ani.layers
            layer.paper.setSize(layer.container.width(), layer.container.height())

        ani.step_once()
        $el.data('ani', ani)

    getAnimation = (key) =>
      animations[key]

    # TODO implement
    step_once = =>

    # TODO implement
    step = (timestamp) =>

    # TODO implement
    play = =>

    ## -------------- helper methods --------------

    log = (msg) => console.log msg if @getSetting "debug"

    has = (obj, key) => hasOwnProperty.call(obj, key)

    isFunction = (obj) => typeof obj is "function"

    bind = (func, context) =>
      nativeBind = Function.prototype.bind
      slice = Array.prototype.slice
      if (func.bind is nativeBind && nativeBind) 
        return nativeBind.apply(func, slice.call(arguments, 1))
      if (!isFunction(func)) 
        throw new TypeError
      args = slice.call(arguments, 2)

      return bound = ->
        if (!(this instanceof bound)) 
          return func.apply(context, args.concat(slice.call(arguments)))
        ctor.prototype = func.prototype
        self = new ctor
        ctor.prototype = null
        result = func.apply(self, args.concat(slice.call(arguments)))
        if (Object(result) is result) 
          return result
        return self

    ## -------------- public methods -------------- 

    # set looping
    @setLooping = (_looping) -> looping = _looping

    # set the key of the animation
    @setKey = (_key) -> key = _key

    # set the current state
    @setState = (_state) -> state = _state

    # set the animations
    @setAnimations = (_animations) -> animations = _animations

    # get looping
    @getLooping = -> looping

    # get animations
    @getAnimations = -> animations

    # get key
    @getKey = -> key

    #get current state
    @getState = -> state

    # get particular plugin setting
    @getSetting = ( key ) -> @settings[ key ]

    # call one of the plugin setting functions
    @callSettingFunction = ( name, args = [] ) ->
      @settings[name].apply( this, args )

    ## ------------------ init ---------------------

    # initialize the plugin
    @init = ->
      @settings = $.extend( {}, @defaults, options )
      @setLooping @getSetting("looping")

      initAnimations()

      @setState 'ready'

    # initialise the plugin
    @init()

    # make the plugin chainable
    this

  $.fn.raphaelAnimate = ( options ) ->
    this.each ->
      if $( this ).data( 'raphaelAnimate' ) is undefined
        plugin = new $.raphaelAnimate( this, options )
        $( this).data( 'raphaelAnimate', plugin )