'use strict';

const dbaccess = require('../DB/dbAccessor');
const sendQ = require('../MsgQueue/sendQ');

const register_patient = async function (mobileno,fname,lname){

    var isRegistered;
    var available_v1_stocks;
    const values = [`${mobileno}`]
    let today = new Date();
    today = today.toISOString().substring(0, 10);
    const record = [`${fname}`,`${lname}`,`${mobileno}`,'PENDING','INELIGIBLE',today];

    try {
        const response = await dbaccess.isRegisteredUser(values);
        isRegistered = response; 

        if(isRegistered > 0){
            return "Sorry! you have already registered.";
        }
        else{
            const r1 = dbaccess.assignV1(record);
            console.log("inserted");
            var v1stocks;
            const r3 = await dbaccess.getV1BStocks();
            available_v1_stocks = r3;
            if(available_v1_stocks > 0){
                console.log("Updated to Active. Pushing to V1 queue");
                const r4 = dbaccess.v1ToActive(mobileno);
                console.log("Activated");
                sendQ.sendToQueue(mobileno);
                const r5 = dbaccess.reduceV1BStocks(available_v1_stocks);
                console.log("reduced by 1");
            }
            else{
                console.log('WAIT FOR SOME TIME. YOU ll be notified on availability');
            }
            return "You have successfully registered.";
        }
    }
    catch(err){console.log(err);}
  
}

const v1Vaccine = async function(mobile){
    var isActive;
    let today = new Date();
    today = today.toISOString().substring(0, 10);

    try {
        const response = await dbaccess.isV1active(mobile);
        isActive = response; 

        if(isActive > 0){
            const r1 = dbaccess.v1done(mobile);
            const r2 = dbaccess.v1date(today,mobile);
            var v1stocks;
            const r3 = await dbaccess.getV1Stocks();
            v1stocks = r3;
            const r4 = dbaccess.reduceV1Stocks(v1stocks);
            return "V1 vaccination complete";
        }
        else{
            return "Not eligible to take vaccine now";
        }
    }
    catch(err){console.log(err);}          
}

const v2Vaccine = async function(mobile){
    let today = new Date();
    today = today.toISOString().substring(0, 10);
    var isv1doneV2active;

    try {
        const response = await dbaccess.v2dose(mobile);
        isv1doneV2active = response; 

        if(isv1doneV2active > 0){
            const r1 = dbaccess.v2done(mobile);
            const r2 = dbaccess.v2date(today,mobile);
            var v2stocks;
            const r3 = await dbaccess.getV2Stocks();
            v2stocks = r3;
            const r4 = dbaccess.reduceV2Stocks(v2stocks);
            return "Your vaccination process is done";
        }
        else{
            return "Not eligible to take vaccine now";
        }
    }
    catch(err){console.log(err);}  
}

const addV1Stocks = function (new_stocks){
    dbaccess.addV1Stocks(new_stocks);
    return "Added in V1 stocks";
}

const addV2Stocks = function (new_stocks) {
    dbaccess.addV2Stocks(new_stocks);
    return "Added in V2 stocks";
}

module.exports = {
    register_patient : register_patient,
    v1Vaccine        : v1Vaccine,
    v2Vaccine        : v2Vaccine,
    addV1Stocks      : addV1Stocks,
    addV2Stocks     : addV2Stocks
}