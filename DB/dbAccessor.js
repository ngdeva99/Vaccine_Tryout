const client = require('./connectToDB');
const queries = require('./queries');

const isRegisteredUser = async (values) => {
    try 
    {  
            const result = await client.query(queries.isRegisteredUser,values);
            return result.rows[0].count;

    }
    catch (err){return err;}
}

const assignV1 = async (record) => {
    try 
    {  
            const result = await client.query(queries.assignV1,record);
    }
    catch (err){return err;}
}

const getV1BStocks = async () => {
    try 
    {  
            const result = await client.query(queries.getV1BStocks);
            return result.rows[0].v1_buffer;

    }
    catch (err){return err;}
}

const v1ToActive = async (mobileno) => {
    try 
    {  
            const result = await client.query(queries.v1ToActive,['ACTIVE',`${mobileno}`]);
    }
    catch (err){return err;}
}

const reduceV1BStocks = async (available_v1_stocks) => {
    try 
    {  
            const result = await client.query(queries.reduceV1BStocks,[available_v1_stocks-1]);
    }
    catch (err){return err;}
}

const isV1active = async (mobile) => {
    try 
    {  
            const result = await client.query(queries.isV1active,[`${mobile}`,'ACTIVE']);
            return result.rows[0].count;

    }
    catch (err){return err;}
}

const v1done = async (mobile) => {
    try 
    {  
            const result = await client.query(queries.v1done,['DONE',`${mobile}`]);

    }
    catch (err){return err;}
}


const v1date = async (today,mobile) => {
    try 
    {  
            const result = await client.query(queries.v1date,[today,`${mobile}`]);

    }
    catch (err){return err;}
}

const getV1Stocks = async () => {
    try 
    {  
            const result = await client.query(queries.getV1Stocks);
            return result.rows[0].v1;
    }
    catch (err){return err;}
}

const reduceV1Stocks = async (v1stocks) => {
    try 
    {  
            const result = await client.query(queries.reduceV1Stocks,[v1stocks - 1]);
    }
    catch (err){return err;}
}

const v2dose = async (mobile) => {
    try 
    {  
            const result = await client.query(queries.v2dose,[`${mobile}`,'DONE','ACTIVE']);
            return result.rows[0].count;
    }
    catch (err){return err;}
}

const v2done = async (mobile) => {
    try 
    {  
            const result = await client.query(queries.v2done,['DONE',`${mobile}`]);
    }
    catch (err){return err;}
}

const v2date = async (today,mobile) => {
    try 
    {  
            const result = await client.query(queries.v2date,[today,`${mobile}`]);

    }
    catch (err){return err;}
}

const getV2Stocks = async () => {
    try 
    {  
            const result = await client.query(queries.getV2Stocks);
            return result.rows[0].v2;
    }
    catch (err){return err;}
}

const reduceV2Stocks = async (v2stocks) => {
    try 
    {  
            const result = await client.query(queries.reduceV2Stocks,[v2stocks - 1]);
    }
    catch (err){return err;}
}

const addV1Stocks = async (new_stocks) => {
    console.log(new_stocks);

    try{
    const addV1BStocks = await client.query(queries.addV1BStocks,[new_stocks]);
    const addV1Stocks = await client.query(queries.addV1Stocks,[new_stocks]);
    }
    catch(err){
        console.log(err);
    }
}

const addV2Stocks = async (new_stocks) => {
    console.log(new_stocks);

    try{
    const addV2BStocks = await client.query(queries.addV2BStocks,[new_stocks]);
    const addV2Stocks = await client.query(queries.addV2Stocks,[new_stocks]);
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    isRegisteredUser : isRegisteredUser,
    assignV1 : assignV1,
    getV1BStocks        : getV1BStocks,
    v1ToActive        : v1ToActive,
    reduceV1BStocks : reduceV1BStocks,
    addV1Stocks : addV1Stocks,
    addV2Stocks : addV2Stocks,
    isV1active  : isV1active,
    v1done        : v1done,
    v1date        : v1date,
    getV1Stocks        : getV1Stocks,
    reduceV1Stocks        : reduceV1Stocks,
    v2dose        : v2dose,
    v2done        : v2done,
    v2date        : v2date,
    getV2Stocks        : getV2Stocks,
    reduceV2Stocks        : reduceV2Stocks
}
