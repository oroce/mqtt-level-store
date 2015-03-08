
var level = require('level-browserify');
var msgpack = require('msgpack5');

function Store (options) {
  if (!(this instanceof Store)) {
    return new Store(options);
  }

  if (!options.level) {
    throw new Error('missing level');
  }

  this._level = options.level;
  this._levelOpts = {
    valueEncoding: msgpack()
  }
}

Store.prototype.put = function (packet, cb) {
  this._level.put('' + packet.messageId, packet, this._levelOpts, cb);
  return this;
};

Store.prototype.get = function (packet, cb) {
  this._level.get('' + packet.messageId, this._levelOpts, cb);
  return this;
};

Store.prototype.del = function (packet, cb) {
  var key = '' + packet.messageId,
    that = this;
  this._level.get(key, this._levelOpts, function(err, _packet) {
    if (err) {
      return cb(err);
    }

    that._level.del(key, this._levelOpts, function(err) {
      if (err) {
        return cb(err);
      }

      cb(null, _packet);
    });
  });
  return this;
};

Store.prototype.createStream = function() {
  return this._level.createValueStream(this._levelOpts);
};

Store.prototype.close = function (cb) {
  this._level.close(cb);
  return this;
};

module.exports.single = Store;