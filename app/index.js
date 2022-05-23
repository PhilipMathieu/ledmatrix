#!/bin/env node

{
    'use strict';
    const display = require(__dirname + '/libs/display.js');
    const server = require(__dirname + '/libs/http.js');
    const chalk = require('chalk');
    const _ = require('lodash');
    const debug = require('debug')('main');
    let dots = 0;

    display.init();
    console.log(chalk.cyan('Main application running'));
    server.start(() => {
        server.on('emoji', (emoji) => {
            console.log(chalk.magenta('new emoji received! applying...'));
            display.image(emoji);
            dots = _.filter(emoji, function(o) {
                return o;
            });
        });
    });
}
