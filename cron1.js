const cron = require("node-cron");
const amqp = require('amqplib/callback_api');
let client = require("./DB/connectToDB");
const queries = require('./DB/queries');
const sendQ = require('./MsgQueue/sendQ');
const dbaccess = require('./DB/dbAccessor');

client.connect()
    .then(() => console.log("Connected Successfully"))
    .catch((err) => console.log(err));

    var count1 = 0;
    cron.schedule('* * * * * *', () => { // 30 7 * * * esentially at 7 30 am everyday. cron JOB to check for 30 day span.
        let today = new Date();
        today = today.toISOString().substring(0, 10);

        count1 = count1 + 1;
        (async () => {
          try{  
              const b2 = await dbaccess.getV1BStocks();
              available_v1_stocks = b2;
              if(available_v1_stocks > 0){

                const b1 = await dbaccess.pplforPendingtoActive();
                const arr = b1.rows;

                for (let i = 0; i < arr.length; i++){
                    console.log(arr[i].mobile);
                    let this_patient_mobile = arr[i].mobile;
                    console.log("Updated to Active. Pushing to V1 queue");
                    const b3 = dbaccess.v1ToActive(this_patient_mobile);
                    console.log("Activated")
                    sendQ.sendToQueue(this_patient_mobile);
                    const b4 = dbaccess.reduceV1BStocks(available_v1_stocks);
                    console.log("reduced by 1 in v1 buffer");
                }
              }
            }
        catch(err){console.log(err);}
    })();
});
    
    var count = 0;
    cron.schedule('* * * * * *', () => {
        let today = new Date();
        today = today.toISOString().substring(0, 10);

        count = count + 1;
        (async () => {
    
    try{
        const response = await client.query(queries.day30window)
        const arr = response.rows;
        
        for (let i = 0; i < arr.length; i++){
            let this_patient_mobile = arr[i].mobile;
            const a1 = await dbaccess.getV2BStocks();
            available_v2_stocks = a1;
            if(available_v2_stocks > 0){
                    console.log("Updated to Active. Pushing to V2 queue");
                    const a2 = dbaccess.v2ToActive(this_patient_mobile);
                    console.log("Activated");
                    sendQ.sendToQueue1(this_patient_mobile);
                    const a3 = dbaccess.reduceV2BStocks(available_v2_stocks);
                    console.log("reduced by 1 in v2 buffer");
            }
                else{
                    console.log("Hi! V2 stock currently unavailable! We ll notify you");
                    const a4 = client.query(queries.IneligibleToPending);
                }
            }
        }
        catch(err){console.log(err);}
})();
    });

var count2 = 0;
cron.schedule('* * * * * *', () => {
    let today = new Date();
    today = today.toISOString().substring(0, 10);

    count2 = count2 + 1;
    (async () => {
    try{
    const response = await client.query(queries.pplforIneligibleToPending);
    const arr = response.rows;
    
    for (let i = 0; i < arr.length; i++){
        let this_patient_mobile = arr[i].mobile;
        const c1 = await dbaccess.getV2BStocks();
        available_v2_stocks = c1;
        if(available_v2_stocks > 0){
            const c2 = dbaccess.v2ToPending(this_patient_mobile);
            console.log("pending to ineligible"); 
        }
    }
}catch(err){console.log(err);}
    
        })();
        });