var DHTSeries = require('../index');

var dht11 = new DHTSeries({
  model: 'dht11',
  address: 4
});

dht11.fetch(function (err, temperature, humidity) {
  if (err) {
    return console.error('a error occur when read dht-sensor:', err);
  }
  console.log('temperature: ' + temperature.toFixed(1) + ', humidity: ' + humidity.toFixed(1));
});
