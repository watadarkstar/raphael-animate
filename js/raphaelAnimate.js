(function() {
  jQuery(function() {
    $.raphaelAnimate = function(el, options) {
      var animations, bind, getAnimation, has, initAnimations, isFunction, key, log, looping, play, state, step, step_once,
        _this = this;
      $.raphaelAnimate.prototype.defaults = {
        FPS: 50,
        animations: {},
        debug: true,
        key: "animation1",
        looping: true
      };
      state = '';
      animations = {};
      looping = true;
      key = "animation1";
      this.settings = {};
      this.$el = $(el);
      initAnimations = function() {
        var $canvas, $el, ani, i, layer, self, _i, _j, _len, _len1, _ref, _ref1;
        _this.setAnimations(_this.getSetting("animations"));
        _this.setKey(_this.getSetting("key"));
        $el = _this.$el;
        if (has(animations, key)) {
          $el.data('initialized', true);
          ani = getAnimation(key);
          ani.nFrames = 0;
          _ref = ani.layers;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            layer = _ref[i];
            $canvas = $('<div></div>').addClass('dynamic-canvas').appendTo($el);
            layer.container = $canvas;
            layer.paper = Raphael($canvas[0], $canvas.width(), $canvas.height());
            ani.nFrames = Math.max(ani.nFrames, layer.frames.length);
          }
          ani.playing = false;
          ani.finished = false;
          ani.lastFrame = 0;
          ani.tick = 0;
          ani.looping = looping;
          if (ani.looping) {
            $el.addClass('looping');
          } else {
            $el.addClass('play-once');
          }
          ani.step_once = bind(step_once, ani);
          ani.step = bind(step, ani);
          ani.play = bind(play, ani);
          self = ani;
          _ref1 = ani.layers;
          for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
            layer = _ref1[i];
            layer.paper.setSize(layer.container.width(), layer.container.height());
          }
          ani.step_once();
          return $el.data('ani', ani);
        }
      };
      getAnimation = function(key) {
        return animations[key];
      };
      step_once = function() {};
      step = function(timestamp) {};
      play = function() {};
      log = function(msg) {
        if (_this.getSetting("debug")) {
          return console.log(msg);
        }
      };
      has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
      };
      isFunction = function(obj) {
        return typeof obj === "function";
      };
      bind = function(func, context) {
        var args, bound, nativeBind, slice;
        nativeBind = Function.prototype.bind;
        slice = Array.prototype.slice;
        if (func.bind === nativeBind && nativeBind) {
          return nativeBind.apply(func, slice.call(arguments, 1));
        }
        if (!isFunction(func)) {
          throw new TypeError;
        }
        args = slice.call(arguments, 2);
        return bound = function() {
          var result, self;
          if (!(this instanceof bound)) {
            return func.apply(context, args.concat(slice.call(arguments)));
          }
          ctor.prototype = func.prototype;
          self = new ctor;
          ctor.prototype = null;
          result = func.apply(self, args.concat(slice.call(arguments)));
          if (Object(result) === result) {
            return result;
          }
          return self;
        };
      };
      this.setLooping = function(_looping) {
        return looping = _looping;
      };
      this.setKey = function(_key) {
        return key = _key;
      };
      this.setState = function(_state) {
        return state = _state;
      };
      this.setAnimations = function(_animations) {
        return animations = _animations;
      };
      this.getLooping = function() {
        return looping;
      };
      this.getAnimations = function() {
        return animations;
      };
      this.getKey = function() {
        return key;
      };
      this.getState = function() {
        return state;
      };
      this.getSetting = function(key) {
        return this.settings[key];
      };
      this.callSettingFunction = function(name, args) {
        if (args == null) {
          args = [];
        }
        return this.settings[name].apply(this, args);
      };
      this.init = function() {
        this.settings = $.extend({}, this.defaults, options);
        this.setLooping(this.getSetting("looping"));
        initAnimations();
        return this.setState('ready');
      };
      this.init();
      return this;
    };
    return $.fn.raphaelAnimate = function(options) {
      return this.each(function() {
        var plugin;
        if ($(this).data('raphaelAnimate') === void 0) {
          plugin = new $.raphaelAnimate(this, options);
          return $(this).data('raphaelAnimate', plugin);
        }
      });
    };
  });

}).call(this);
