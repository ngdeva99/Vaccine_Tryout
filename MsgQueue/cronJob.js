const cron = require("node-cron");
let client = require("../DB/connectToDB")
const amqp = require('amqplib/callback_api');

client.connect()
    .then(() => console.log("Connected Successfully"))
    .catch((err) => console.log(err))

let count = 0;
cron.schedule('* * * * * *', () => {
    count = count + 1;
    let today = new Date();
    today = today.toISOString().substring(0, 10);

    amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        let queue = 'v1eligible';
        channel.assertQueue(queue, {
            durable: false
        });

        let queue1 = 'v2eligible';
        channel.assertQueue(queue1, {
            durable: false
        });

        channel.consume(queue, function (msg) {
            let patient_details = msg.content.toString();
            patient_details = JSON.parse(patient_details);
            console.log(":",patient_details);
            //channel.ack(msg); // -- this will be the notification service

        });
        
        channel.consume(queue1, function (msg2) {
            let patient_details = msg2.content.toString();
            patient_details = JSON.parse(patient_details);
            console.log(":",patient_details);
            //channel.ack(msg2); //-- this will be the notification service
            });

        });
    });
});