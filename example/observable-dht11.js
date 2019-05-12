var DHTSeries = require('../index');

var dht11 = new DHTSeries({
  model: 'dht11',
  address: 4
});

// We are interested in temperature and humidity.
var observable = dht11.observe(2000);

// Now we are monitoring.
var subscription = observable.then(function subscribe(value) {
    console.log('temperature: ' + value.t.toFixed(1) + ', humidity: ' + value.h.toFixed(1));
}, function onError(err) {
    console.error('dht-sensor monitoring error.');
});

// use dispose() to stop monitor.
// subscription.dispose()
