'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const path = require('path');
//const psql = require('queries');
const client = require('./connectToDB');
const alert = require('alert');
const queries = require('./queries');
const pg = require('pg')
const pool = new pg.Pool();
const amqp = require('amqplib/callback_api');
const bs = require('./businessLogic');

const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: 1234,
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'static')
            }
        }
    });

    await server.register([{
        plugin: require('hapi-geo-locate'),
        options: {
            enabledByDefault: false
        }
    },
    {
        plugin: Inert
    },
    {
        plugin:require('@hapi/vision')
    }
]);

server.views({
    engines: {
        html : require('handlebars')
    },
    path: path.join(__dirname,'views')
})


client.connect()
    .then(() => console.log("Connnected to Database"))
    .catch(err => console.log(err))

server.route([{
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('welcome.html');
        }
    },

    {
        method: 'POST',
        path: '/register',
        handler: (request, h) => {

            var mobileno = request.payload.mobile;
            var fname = request.payload.fname;
            var lname = request.payload.lname;

            bs.register_patient(mobileno,fname,lname);


            // var isRegistered;
            // var available_v1_stocks;
            // const values = [`${mobileno}`]
            // let today = new Date();
            // today = today.toISOString().substring(0, 10);
            // const record = [`${fname}`,`${lname}`,`${mobileno}`,'PENDING',today]

            // client
            //     .query(queries.isRegisteredUser,values)
            //     .then(res => {
            //         isRegistered =res.rows[0].count

            //         if(isRegistered > 0){
            //             alert("You have already registered for vaccination under this Mobile No.",{mobileno})
                        
            //         }

            //         else{
            //             client
            //                 .query(queries.assignV1,record)
            //                 .then(resp => { 
            //                     console.log("inserted")
            //                     client
            //                         .query(queries.getV1BStocks)
            //                         .then(resp => {
            //                             console.log("HI",resp.rows[0].v1_buffer)
            //                             available_v1_stocks = resp.rows[0].v1_buffer;
            //                             if (available_v1_stocks > 0){
            //                                 console.log("Updated to Active. Pushing to V1 queue");

            //                                 client
            //                                 .query(queries.v1ToActive,['ACTIVE',`${mobileno}`])
            //                                 .then(resp => {
            //                                     console.log("Activated")

            //                                     // part of sending to RABBIT MQ

            //                                     // sending this person to v1 queue

            //                                     amqp.connect('amqp://localhost', function (error0, connection) {
            //                                         if (error0) {
            //                                             throw error0;
            //                                         }
            //                                         connection.createChannel(function (error1, channel) {
            //                                             if (error1) {
            //                                                 throw error1;
            //                                             }
            //                                             let queue = 'v1eligible';
            //                                             let msg = `{"title":"V1 notification","patient":${mobileno}}`;

            //                                             channel.assertQueue(queue, {
            //                                                 durable: false
            //                                             });

            //                                             channel.sendToQueue(queue, Buffer.from(msg));
            //                                             console.log(" [x] Sent %s", msg);
            //                                         });
            //                                     });
            //                                 })
            //                                 .catch(err => {})

            //                                 client
            //                                 .query(queries.reduceV1BStocks,[available_v1_stocks-1])
            //                                 .then(resp=>{ console.log("reduced by 1")})
            //                                 .catch(err => {})
            //                             }
            //                             else{
            //                                 console.log('WAIT FOR SOME TIME. YOU ll be notified on availability')
            //                             }
            //                         })
            //                         .catch(err => {})
            //                 })
            //             .catch(err => {})

            //         //return h.redirect('/');
            //         }
            //     })
            //     .catch(err => { return err })

                return h.redirect('/');
            }

          },

    {
        method: 'GET',
        path: '/checkV1Eligibility',
        handler: (request, h) => {
            console.log(request.payload.mobile)
        }
    },

    {
        method: 'POST',
        path : '/v1dose',
        handler : (request, h) => {
            //this flow has to accept mobile no as the input
            var mobile = request.payload.mobile;
            var available_v2_stocks;
            var isActive;
            let today = new Date();
            today = today.toISOString().substring(0, 10);


                    return client.
                        query(queries.isV1active,[`${mobile}`,'ACTIVE'])
                        .then(response =>{ 
                            isActive = response.rows[0].count
                            console.log(isActive)
                            if(isActive > 0){

                                client
                                .query(queries.v1done,['DONE',`${mobile}`])
                                .then(response =>{})
                                .catch(err =>{})


                                client
                                .query(queries.v1date,[today,`${mobile}`])
                                .then(response =>{})
                                .catch(err =>{})
                                
                                var  v1stocks;
                                client
                                .query(queries.getV1Stocks)
                                .then(resp => {
                                    
                                    v1stocks = resp.rows[0].v1;
                                    client
                                    .query(queries.reduceV1Stocks,[v1stocks - 1])
                                    .then(resp=>{ console.log("reduced by 1 in v1 stock")})
                                    .catch(err => {})
                                })
                                .catch(err => {})

                            }

                            else{
                                alert("Not eligible to take vaccine now")
                            }
                            return h.redirect('/');
                        })
                        .catch(error => {})

        }
    }
,
    {
        method: 'POST',
        path : '/v2dose',
        handler : (request, h) => {
            //this flow has to accept mobile no as the input
            var mobile = request.payload.mobile;
            let today = new Date();
            today = today.toISOString().substring(0, 10);

            console.log(mobile);
            var isv1doneV2active;
                    client.
                        query(queries.v2dose,[`${mobile}`,'DONE','ACTIVE'])
                        .then(response =>{ 
                            isv1doneV2active = response.rows[0].count

                            if(isv1doneV2active > 0){
                                client
                                .query(queries.v2done,['DONE',`${mobile}`])
                                .then(response =>{})
                                .catch(err =>{})

                                client
                                .query(queries.v2date,[today,`${mobile}`])
                                .then(response =>{})
                                .catch(err =>{})

                                var  v2stocks;
                                client
                                .query(queries.getV2Stocks)
                                .then(resp => {
                                    
                                    v2stocks = resp.rows[0].v2;
                                    client
                                    .query(queries.reduceV2Stocks,[v2stocks - 1])
                                    .then(resp=>{ console.log("reduced by 1 in v2 stock")})
                                    .catch(err => {})
                                })
                                .catch(err => {})

                                console.log("You are done with your vaccine now.")
                            }

                            else{
                                alert("Not eligible to take V2 vaccine now")
                            }
                            
                        })
                        .catch(error => {})

                        return h.redirect('/');
        }
    }
,

{
    method: 'PUT',
    path: '/addStocksV1',
    handler: (request,h) =>{

        var new_stocks = request.payload.new_stocks;
        console.log(new_stocks);
        client
        .query(queries.addV1BStocks,[new_stocks])
        .then(resp=>{})
        .catch(err => {})

        client
        .query(queries.addV1Stocks,[new_stocks])
        .then(resp=>{})
        .catch(err =>{})

        return h.redirect('/');
    }
}
, 

{
    method: 'PUT',
    path: '/addStocksV2',
    handler: (request,h) =>{

        var new_stocks = request.payload.new_stocks;
        console.log(new_stocks);
        client
        .query(queries.addV2BStocks,[new_stocks])
        .then(resp=>{})
        .catch(err => {})

        client
        .query(queries.addV2Stocks,[new_stocks])
        .then(resp=>{})
        .catch(err =>{})

        return h.redirect('/');
    }
}

]);

    await server.start();
    console.log(`Server started on: ${server.info.uri}`);

}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();