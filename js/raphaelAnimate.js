(function() {
  jQuery(function() {
    $.raphaelAnimate = function(el, options) {
      var FPS, animations, bind, bindEvents, current_size, delay, getAnimation, has, initAnimations, isFunction, key, log, looping, play, set_size, size_animations, state, step, step_once,
        _this = this;
      $.raphaelAnimate.prototype.defaults = {
        FPS: 50,
        animations: {},
        debug: true,
        key: "animation1",
        looping: false
      };
      state = '';
      FPS = 50;
      animations = {};
      looping = null;
      key = "";
      current_size = null;
      this.settings = {};
      this.$el = $(el);
      initAnimations = function() {
        var $canvas, $el, ani, i, layer, _i, _len, _ref;
        _this.setAnimations(_this.getSetting("animations"));
        _this.setKey(_this.getSetting("key"));
        $el = _this.$el;
        if (has(animations, key)) {
          $el.data('initialized', true).addClass('replaced');
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
          $el.addClass('looping-' + ani.looping);
          ani.step_once = bind(step_once, ani);
          ani.step = bind(step, ani);
          ani.play = bind(play, ani);
          if (has(sizes, key)) {
            ani.set_size = bind(set_size, ani);
            ani.sizes = sizes[key];
            if (current_size) {
              ani.set_size(current_size);
            }
          }
          ani.step_once();
          $el.data('ani', ani);
          current_size = "1120";
          return size_animations();
        }
      };
      getAnimation = function(key) {
        return animations[key];
      };
      step_once = function() {
        var attrs, i, layer, self, shape, _i, _j, _len, _len1, _ref, _ref1;
        self = this;
        _ref = this.layers;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          layer = _ref[i];
          if (layer.frames[self.tick]) {
            layer.paper.clear();
            _ref1 = layer.frames[self.tick];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              shape = _ref1[_j];
              attrs = $.extend({
                "stroke-width": "0",
                "stroke": "none"
              }, shape.attrs != null ? shape.attrs : shape);
              layer.paper.path(shape.path).attr(attrs);
            }
          }
        }
        this.tick++;
        if (this.tick > (this.nFrames - 1)) {
          this.tick = 0;
          if (!this.looping) {
            this.playing = false;
            this.finished = true;
          }
        }
        return this.lastFrame = Date.now();
      };
      step = function(timestamp) {
        var now;
        now = Date.now();
        if ((now - this.lastFrame) > (1000 / FPS)) {
          this.step_once();
        }
        if (this.playing) {
          return requestAnimationFrame(this.step);
        }
      };
      play = function() {
        this.playing = true;
        return requestAnimationFrame(this.step);
      };
      size_animations = function() {
        var $el, ani;
        $el = _this.$el;
        ani = $el.data('ani');
        if (ani && ani.set_size) {
          return ani.set_size(current_size);
        }
      };
      set_size = function(size) {
        var i, layer, s, _i, _len, _ref, _results;
        s = this.sizes[size];
        if (s != null) {
          _ref = this.layers;
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            layer = _ref[i];
            layer.paper.setSize(layer.container.width(), layer.container.height());
            _results.push(layer.paper.setViewBox(s.x, s.y, this.canvas.width.replace(/px$/, '') * s.m, this.canvas.height.replace(/px$/, '') * s.m, false));
          }
          return _results;
        }
      };
      bindEvents = function() {
        _this.$el.on('mouseover', 'path', function(e) {
          var $el;
          $el = $(e.currentTarget);
          return $el.css({
            webkitAnimation: "wobblepath 0.3s ease-in-out 0s infinite alternate"
          });
        });
        _this.$el.on('mouseout', 'path', function(e) {
          var $el;
          $el = $(e.currentTarget);
          return delay(300, function() {
            return $el.css({
              webkitAnimation: "none"
            });
          });
        });
        _this.$el.click(function(e) {
          var $el, ani;
          $el = $(e.currentTarget);
          ani = $el.data('ani');
          if (ani) {
            return ani.play();
          }
        });
        return $(window).on('statechangecomplete', function() {});
      };
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
      delay = function(ms, func) {
        return setTimeout(func, ms);
      };
      this.setFPS = function(_FPS) {
        return FPS = _FPS;
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
      this.getFPS = function() {
        return FPS;
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
        var ani;
        this.settings = $.extend({}, this.defaults, options);
        this.setLooping(this.getSetting("looping"));
        this.setFPS(this.getSetting("FPS"));
        initAnimations();
        ani = this.$el.data('ani');
        if (ani) {
          ani.play();
        }
        bindEvents();
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
