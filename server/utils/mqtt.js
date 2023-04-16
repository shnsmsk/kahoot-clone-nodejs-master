const mqtt = require('mqtt');


const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');



//Import classes


const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


const {Players} = require('./players');
const {LiveGames} = require('./liveGames');

var games = new LiveGames();
var players = new Players();



var answer2;


const client = mqtt.connect('mqtt://192.168.68.102:1883', {
  clean: true,
  connectTimeout: 4000,
  username: 'sahin',
  password: 'simsek',
  reconnectPeriod: 1000,
})

const topic = 'myTopic'
var answer = '';
var user;

function subscribe(io,data) {
  client.on('connect', function() {
    console.log('Connected to MQTT broker');
    client.subscribe('myTopic', function(err) {
      if (err) {
        console.log(err);
      }
    });
    client.publish('myTopic', 'Test message');
  });

  client.on('message', function(topic, message) {
    console.log('Received message on topic ' + topic + ': ' + message.toString());
    answer2= message.toString();
    const sockets = io.sockets;
    const connectedSockets = Object.keys(sockets.sockets);
    console.log('Connected sockets:', connectedSockets);
    //io.to(connectedSockets[1]).emit('answer',answer2);
    io.to(connectedSockets[1]).emit('message', { message: answer2 });
    // if(answer2.startsWith("answer")){
    //   io.to(connectedSockets[1]).emit('message', { message: answer2 });
    // }
    // else if(answer2.startsWith("controller2")){
    //   io.to(connectedSockets[2]).emit('message', { message: answer2.substring(11) });
    // }
  });
}

module.exports = subscribe,answer;