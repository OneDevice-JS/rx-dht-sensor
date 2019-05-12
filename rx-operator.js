module.exports = function defineOperator (Rx) {
  // 大于，condi < value
  Rx.Observable.prototype.max = function (condi) {
    var input = this;
    return Rx.Observable.create(function (observe) {
      var handle = input.subscribe(
        function (value) {
          if (value > condi) {
            observe.onNext(value);
          }
        },
        function (error) {
          observe.onError(error);
        },
        function (value) {
          observe.onCompleted(value);
        }
      );
      return function () {
        handle.dispose();
      }
    });
  };
  // 小于，value < condi
  Rx.Observable.prototype.min = function (condi) {
    var input = this;
    return Rx.Observable.create(function (observe) {
      var handle = input.subscribe(
        function (value) {
          if (value < condi) {
            observe.onNext(value);
          }
        },
        function (error) {
          observe.onError(error);
        },
        function (value) {
          observe.onCompleted(value);
        }
      );
      return function () {
        handle.dispose();
      }
    });
  };
  // 等于，value == condi
  Rx.Observable.prototype.when = function (condi) {
    var input = this;
    return Rx.Observable.create(function (observe) {
      var handle = input.subscribe(
        function (value) {
          if (value == condi) {
            observe.onNext(value);
          }
        },
        function (error) {
          observe.onError(error);
        },
        function (value) {
          observe.onCompleted(value);
        }
      );
      return function () {
        handle.dispose();
      }
    });
  };
  // 大于left并且小于right，left < value < right
  Rx.Observable.prototype.between = function (left, right) {
    var input = this;
    return Rx.Observable.create(function (observe) {
      var handle = input.subscribe(
        function (value) {
          if (value > left && value < right) {
            observe.onNext(value);
          }
        },
        function (error) {
          observe.onError(error);
        },
        function (value) {
          observe.onCompleted(value);
        }
      );
      return function () {
        handle.dispose();
      }
    });
  };
  /**
   * 订阅观察者，返回订阅对象(subscription)
   * @param {function} onsuccess 读取成功的订阅函数(subscribe)
   * @param {function} onerror 读取失败的订阅函数(subscribe)
   */
  Rx.Observable.prototype.then = function (onsuccess, onerror) {
    var input = this;
    if (typeof onsuccess === 'function') {
      return input.subscribe(
        function (value) {
          onsuccess(value);
        },
        function (error) {
          if (typeof onerror === 'function') {
            onerror(error);
          }
        },
        function (value) {
          onsuccess(value);
        }
      );
    }
    throw new Error('The parameter must be a function!');
  };
}
