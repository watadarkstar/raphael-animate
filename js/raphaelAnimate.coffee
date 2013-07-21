#
# Name    : Raphael Animate
# Author  : Adrian Carolli, www.twitter.com/wataweb, @wataweb
# Version : 0.0.1
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
        looping: false

    # current state
    state = ''

    # desired FPS of animation
    FPS = 50

    # animations to play
    animations = {}

    # looping
    looping = null

    # key of animation
    key = ""

    # current size of window
    current_size = null

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
        $el.data('initialized', true).addClass('replaced');
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
        $el.addClass('looping-'+ani.looping)

        ani.step_once = bind(step_once, ani)
        ani.step = bind(step, ani)
        ani.play = bind(play, ani)

        if (has(sizes, key))
          ani.set_size = bind(set_size, ani)
          ani.sizes = sizes[key]
          if (current_size)
            ani.set_size(current_size)

        ani.step_once()
        $el.data('ani', ani)

        # TODO remove this and do window resizing using match queries
        current_size = "1120"
        size_animations()

    getAnimation = (key) =>
      animations[key]

    step_once = ->
      # only draw a frame if the data exists
      # it's possible that the frame is null, in which case we're just holding the previous frame
      self = this

      for layer, i in this.layers
        if (layer.frames[self.tick])
          layer.paper.clear()
          for shape in layer.frames[self.tick]
            attrs = $.extend({"stroke-width":"0","stroke":"none"}, if shape.attrs? then shape.attrs else shape)
            layer.paper
                  .path(shape.path)
                  .attr(attrs)

      this.tick++
      if this.tick > (this.nFrames - 1)
        this.tick = 0;
        if !this.looping
          this.playing = false;
          this.finished = true;

      this.lastFrame = Date.now();

    step = (timestamp) ->
      now = Date.now()
      if ((now - this.lastFrame) > (1000 / FPS))
        this.step_once()

      if this.playing
        requestAnimationFrame(this.step)

    play = ->
      this.playing = true
      requestAnimationFrame(this.step)

    size_animations = =>
      $el = @$el
      ani = $el.data('ani')
      if (ani && ani.set_size)
        ani.set_size(current_size)

    set_size = (size) ->
      s = this.sizes[size];
      if s?
        for layer, i in this.layers
          layer.paper.setSize(layer.container.width(), layer.container.height())
          layer.paper.setViewBox(s.x, s.y, this.canvas.width.replace(/px$/, '') * s.m, this.canvas.height.replace(/px$/, '') * s.m, false)

    ## -------------- event handlers --------------

    bindEvents = () =>
      @$el.on 'mouseover', 'path', (e) =>
        $el = $(e.currentTarget)
        $el.css
          webkitAnimation: "wobblepath 0.3s ease-in-out 0s infinite alternate"

      @$el.on 'mouseout', 'path', (e) =>
        $el = $(e.currentTarget)
        delay 300, ->
          $el.css
            webkitAnimation: "none"

      @$el.click (e) => 
        $el = $(e.currentTarget);
        ani = $el.data('ani')
        if (ani) 
          ani.play();

      $(window).on 'statechangecomplete', =>

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

    delay = (ms, func) -> setTimeout func, ms

    ## -------------- public methods -------------- 

    # set FPS
    @setFPS = (_FPS) -> FPS = _FPS

    # set looping
    @setLooping = (_looping) -> looping = _looping

    # set the key of the animation
    @setKey = (_key) -> key = _key

    # set the current state
    @setState = (_state) -> state = _state

    # set the animations
    @setAnimations = (_animations) -> animations = _animations

    # get FPS
    @getFPS = -> FPS

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
      @setFPS @getSetting("FPS")

      initAnimations()

      ani = @$el.data('ani');
      if (ani)
          ani.play()

      bindEvents()
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