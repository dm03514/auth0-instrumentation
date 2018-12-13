const appmetrics = require('appmetrics');
const agent = require('./index.js');

appmetrics.configure({
  mqtt: 'off',
  profiling: 'off'
});

agent.init({name: 'test'}, process.env);
const monitor = appmetrics.monitor();
agent.metrics.startRuntimeCollection(appmetrics, monitor);

var MongoClient = require('mongodb').MongoClient;
var db;

const express = require('express');
const app = express();
const port = 3000;

app.post(
  '/debug/v8/profiling',
  new agent.http.DebugRuntimeToggle('profiling', appmetrics).toggle
);

app.post(
  '/debug/mongodb',
  new agent.http.DebugRuntimeToggle('mongodb', appmetrics).toggle
);

app.post(
  '/debug/trace',
  new agent.http.DebugRuntimeToggle('trace', appmetrics).toggle
);

app.post(
  '/debug/requests',
  new agent.http.DebugRuntimeToggle('requests', appmetrics).toggle
);

// Connect to the db
MongoClient.connect("mongodb://localhost:27017", function(err, client) {
  if(!err) {
    console.log("We are connected");
  }

  db = client.db('test');

  app.get('/', (req, res) => {
    db.collection('test1').find({}, (err, result) => {
      agent.metrics.incrementOne('http.request');
      // console.log(err);
      // console.log(result);
      res.send('Hello World!');
    });
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});

