(function(global) {
var define = global.Orbit.__defineModule__;
var requireModule = global.Orbit.__requireModule__;
define("orbit-common/local-storage-source", 
  ["orbit/lib/assert","orbit/lib/objects","./memory-source","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var assert = __dependency1__.assert;
    var extend = __dependency2__.extend;
    var MemorySource = __dependency3__["default"];

    var supportsLocalStorage = function() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch(e) {
        return false;
      }
    };

    /**
     Source for storing data in local storage

     @class LocalStorageSource
     @extends MemorySource
     @namespace OC
     @param {OC.Schema} schema
     @param {Object}    [options]
     @constructor
     */
    var LocalStorageSource = function() {
      this.init.apply(this, arguments);
    };

    extend(LocalStorageSource.prototype, MemorySource.prototype, {
      constructor: LocalStorageSource,

      init: function(schema, options) {
        assert('Your browser does not support local storage!', supportsLocalStorage());

        MemorySource.prototype.init.apply(this, arguments);

        options = options || {};
        this.namespace = options['namespace'] || 'orbit'; // local storage key
        this._autosave = options['autosave'] !== undefined ? options['autosave'] : true;
        var autoload = options['autoload'] !== undefined ? options['autoload'] : true;

        this._isDirty = false;

        this.on('didTransform', function() {
          this._saveData();
        }, this);

        if (autoload) this.load();
      },

      load: function() {
        var storage = window.localStorage.getItem(this.namespace);
        if (storage) {
          this.reset(JSON.parse(storage));
        }
      },

      enableAutosave: function() {
        if (!this._autosave) {
          this._autosave = true;
          if (this._isDirty) this._saveData();
        }
      },

      disableAutosave: function() {
        if (this._autosave) {
          this._autosave = false;
        }
      },

      /////////////////////////////////////////////////////////////////////////////
      // Internals
      /////////////////////////////////////////////////////////////////////////////

      _saveData: function(forceSave) {
        if (!this._autosave && !forceSave) {
          this._isDirty = true;
          return;
        }
        window.localStorage.setItem(this.namespace, JSON.stringify(this.retrieve()));
        this._isDirty = false;
      }
    });

    __exports__["default"] = LocalStorageSource;
  });
global.OC.LocalStorageSource = requireModule('orbit-common/local-storage-source');
}(window));