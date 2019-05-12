var DHTSensor = require('node-dht-sensor');
var Rx = require('rx-lite');
var defineOperator = require('./rx-operator');

// extends RxJS operator
defineOperator(Rx);

/**
 * create a dht driven instance
 *
 * @param {*} config
 * @param {string} config.model the model of dht. It can be 'dht11' 'dht22' 'am2302'.
 * @param {number} address the GPIO number. in BCM format. default is GPIO 4.
 * @param {string} description the description of driven. user's data.
 */
function DHTSeries(config) {
  // 设备标识 dht11 -> 11, dht22/am2302 -> 22
  var type = config.model === 'dht11' ? 11 : 22;
  var address = config.address || 4;

  this.config = {
    ready: true,
    model: config.model.toLowerCase(),
    description: config.description || '',
    interface: '1-wire',
    type: type,
    address: address
  };
  this.dht = DHTSensor;
}

/** 
 * read the value from dht-sensor.
 * 
 * @param {function} cb(err, temperature, humidity) the callback function to receive value.
 */
DHTSeries.prototype.fetch = function (cb) {
  var self = this;
  this.dht.read(this.config.type, this.config.address, function (error, temperature, humidity) {
    if (error) {
      self.error = error;
    }
    cb.call(self, error, temperature, humidity);
  });
}

/**
 * 返回一个观察者对象(Observable)，可使用then观察(subscribe)
 * @param {number} interval 刷新传感器数值的间隔，单位：毫秒
 * @param {string} type 观察的数据类型，t: 温度，h: 湿度，为空同时观察温度和湿度
 * @returns {Observable} the observable of dht-sensor.
 */
DHTSeries.prototype.observe = function (interval, type) {
  var self = this;
  interval = interval || 2000;
  return Rx.Observable.create(function (observe) {
    var handle;
    var update = function () {
      self.fetch(function (e, t, h) {
        handle = setTimeout(update, interval);
        if (e) {
          observe.onError(e);
        } else {
          if (type === 't') {
            observe.onNext(t);
          } else if (type === 'h') {
            observe.onNext(h);
          } else {
            observe.onNext({
              t: t,
              h: h
            });
          }
        }
      });
    };
    update();
    return function () {
      clearTimeout(handle);
    }
  });
}
module.exports = DHTSeries;
