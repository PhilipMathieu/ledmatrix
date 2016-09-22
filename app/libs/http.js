#!/bin/env node

{
    'use strict';
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');
    const express = require('express');
    const serveStatic = require('serve-static');
    const compression = require('compression');
    const path = require('path');
    const mime = require('mime');
    const debug = require('debug')('http');
    const bodyParser = require("body-parser");
    const _ = require('lodash');
    const app = express();

    function errorHandler(err, req, res, next) {
        res.status(500);
        res.render('error', {
            error: err
        });
    }
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(errorHandler);

    // declaring server
    let server = function() {
        this.port = (process.env.WEB_SERVER_PORT == null) ? 80 : process.env.WEB_SERVER_PORT;
        if (!(this instanceof server)) return new server();
    };
    util.inherits(server, EventEmitter);

    server.prototype.start = function(callback) {
        let self = this;

        app.use(serveStatic('/usr/src/app/public', {'index': ['index.html']}));
        app.get('/', function(req, res) {
          res.sendfile('/usr/src/app/public/index.html');
        });
        app.post('/v1/emoji/:emoji', (req, res) => {
            // Draws the Emoji on the LED Display
            if (!req.params.emoji) {
                return res.status(400).send('Bad Request');
            }
            let emoji = req.params.emoji.split(",");
            let emojiParsed = [];
            _.forEach(emoji, function(value) {
                dot = parseInt(value);
                emojiParsed.push(dot);
            });
            self.emit("emoji", emojiParsed);
            res.status(200).send('OK');
        });

        app.delete('/v1/emoji', (req, res) => {
            // Clears the LED Dipsplay
            let emoji = [
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0

            ];
            self.emit("emoji", emoji);
            res.status(200).send('OK');
        });

        app.listen(self.port, (req, res) => {
            callback();
        });

    }

    module.exports = server();
}
