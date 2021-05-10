const pg = require('pg')
const amqp = require('amqplib/callback_api');

const sendToQueue = function(mobileno){
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            let queue = 'v1eligible'; /// TODO :: enum type -- DOUBT ::
            let msg = `{"title":"V1 notification","patient":${mobileno}}`;

            channel.assertQueue(queue, { // TODO :: create queue in a seperate .sh file __ DOUBT ::
                durable: false
            });

            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
            });
        });
    }

const sendToQueue1 = function(mobileno){
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            let queue = 'v2eligible';
            let msg2 = `{"title":"V2 notification","patient":${mobileno}}`;

            channel.assertQueue(queue, {
                durable: false
            });

            channel.sendToQueue(queue, Buffer.from(msg2));
            console.log(" [x] Sent %s", msg2);
            });
        });
    }
module.exports = {
    sendToQueue : sendToQueue,
    sendToQueue1 : sendToQueue1
}