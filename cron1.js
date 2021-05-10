const cron = require("node-cron");
const amqp = require('amqplib/callback_api');
let client = require("./DB/connectToDB");
const queries = require('./DB/queries');
const sendQ = require('./MsgQueue/sendQ');
    
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
              const b2 = await client.query(queries.getV1BStocks);
              available_v1_stocks = b2.rows[0].v1_buffer;
              if(available_v1_stocks > 0){

                const b1 = await client.query(queries.pplforPendingtoActive);
                const arr = b1.rows;

                for (let i = 0; i < arr.length; i++){
                    console.log(arr[i].mobile);
                    let this_patient_mobile = arr[i].mobile;
                    console.log("Updated to Active. Pushing to V1 queue");
                    const b3 = await client.query(queries.v1ToActive,['ACTIVE',`${this_patient_mobile}`]);
                    console.log("Activated")
                    sendQ.sendToQueue(this_patient_mobile);
                    const b4 = await client.query(queries.reduceV1BStocks,[available_v1_stocks-1]);
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
        const arr = await client.query(queries.day30window)
        .then((res) => { return res.rows })
        .catch(err => { return { message: err } })
        
        for (let i = 0; i < arr.length; i++){
            let this_patient_mobile = arr[i].mobile;
            const a1 = await client.query(queries.getV2BStocks);
            available_v2_stocks = a1.rows[0].v2_buffer;
            if(available_v2_stocks > 0){
                    console.log("Updated to Active. Pushing to V2 queue");
                    const a2 = await client.query(queries.v2ToActive,['ACTIVE',`${this_patient_mobile}`]);
                    console.log("Activated");
                    sendQ.sendToQueue1(this_patient_mobile);
                    const a3 = await client.query(queries.reduceV2BStocks,[available_v2_stocks-1]);
                    console.log("reduced by 1 in v2 buffer");
            }
                else{
                    console.log("Hi! V2 stock currently unavailable! We ll notify you");
                    const a4 = await client.query(queries.IneligibleToPending);
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
    const response = await client.query(queries.pplforIneligibleToPending)
    const arr = response.rows;
    
    for (let i = 0; i < arr.length; i++){
        let this_patient_mobile = arr[i].mobile;
        const c1 = await client.query(queries.getV2BStocks);
        available_v2_stocks = c1.rows[0].v2_buffer;
        if(available_v2_stocks > 0){
            const c2 = await client.query(queries.v2ToActive,['INELIGIBLE',`${this_patient_mobile}`]);
            console.log("pending to ineligible"); 
        }
    }
}catch(err){console.log(err);}
    
        })();
        });



        // var count2 = 0;
        // cron.schedule('* * * * * *', () => { // 30 7 * * * esentially at 7 30 am everyday. cron JOB to check for 30 day span.
        //     let today = new Date();
        //     today = today.toISOString().substring(0, 10);
    
        //     count2 = count2 + 1;
        //     (async () => {
        //         console.log(today,"::",count2);
        //     const arr = await client.query(queries.pplforIneligibleToPending)
        //     .then((res) => { return res.rows })
        //     .catch(err => { return { message: err } })
            
        //     for (let i = 0; i < arr.length; i++){
        //         console.log(arr[i].mobile);
        //         let this_patient_mobile = arr[i].mobile;
    
    
        //         client
        //         .query(queries.getV2BStocks)
        //         .then(resp => {
        //             console.log("HI",resp.rows[0].v2_buffer)
        //             available_v2_stocks = resp.rows[0].v2_buffer;
        //             if (available_v2_stocks > 0){
    
        //                 client
        //                 .query(queries.v2ToActive,['PENDING',`${this_patient_mobile}`])
        //                 .then(resp => {
        //                     console.log("inelgible to pending")
        //                 })
        //                 .catch(err => {})
        //             }
        //         })
        //         .catch(err => {})
    
        //     }
        
        //     })();
        //     });