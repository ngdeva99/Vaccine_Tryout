'use strict';

const Hapi = require('@hapi/hapi');
const path = require('path');
const pg = require('pg')
const client = require('./DB/connectToDB');
const bs = require('./Controller/businessLogic');
const {register_patient,v1orv2dose,addstocks} = require('./schemas/user_schema');

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
        handler: async (request, h) => {     // JOI validation
            var mobileno = request.payload.mobile;
            var fname = request.payload.fname;
            var lname = request.payload.lname;
            const respo = await bs.register_patient(mobileno,fname,lname);
            const data = { response: respo }
            return h.response(data).code(409)
            },
            config: {
            validate: {
                payload: register_patient
            }
        }
    },

    {
        method: 'POST',
        path : '/v1dose',
        handler : async (request, h) => {
            //this flow has to accept mobile no as the input
            var mobile = request.payload.mobile;
            const respo = await bs.v1Vaccine(mobile);
            const data = { response: respo }
            return h.response(data).code(200)
        },
        config: {
            validate: {
                payload: v1orv2dose
            }
        }
    }
,
    {
        method: 'POST',
        path : '/v2dose',
        handler : async (request, h) => {
            //this flow has to accept mobile no as the input
            var mobile = request.payload.mobile;
            const respo = await bs.v2Vaccine(mobile);
            const data = { response: respo }
            return h.response(data).code(200)
        },
        config: {
            validate: {
                payload: v1orv2dose
            }
        }
    },
    {
        method: 'PUT',
        path: '/addStocksV1',
        handler: async (request,h) =>{

            var new_stocks = request.payload.new_stocks;
            const respo =await bs.addV1Stocks(new_stocks);
            const data = { response: respo }
            return h.response(data).code(200)
        },
        config: {
            validate: {
                payload: addstocks
            }
        }
    }, 
    {
        method: 'PUT',
        path: '/addStocksV2',
        handler: async (request,h) =>{

            var new_stocks = request.payload.new_stocks;
            const respo = await bs.addV2Stocks(new_stocks);
            const data = { response: respo }
            return h.response(data).code(200)
        },
        config: {
            validate: {
                payload: addstocks
            }
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