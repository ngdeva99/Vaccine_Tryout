
const isRegisteredUser = 'SELECT count(*) FROM "reg_patients" WHERE reg_patients.mobile = $1';

const assignV1 = 'INSERT into "reg_patients" (firstname,lastname,mobile,v1state,v2state,reg_date) values ($1,$2,$3,$4,$5,$6)';

const updateV1Stocks = 'UPDATE "stocks" set "v1" = $1';

const getV1Stocks = 'SELECT "v1" from "stocks"';

const getV2Stocks = 'SELECT "v2" from "stocks"';

const getV1BStocks = 'SELECT "v1_buffer" from "stocks"';

const getV2BStocks = 'SELECT "v2_buffer" from "stocks"'

const updateV2Stocks = 'UPDATE "stocks" set "v2" = $1';

const v1ToActive = 'UPDATE "reg_patients" set "v1state" = $1 where reg_patients.mobile = $2';

const v2ToActive = 'UPDATE "reg_patients" set "v2state" = $1 WHERE reg_patients.mobile = $2';

const reduceV1Stocks = 'UPDATE "stocks" set "v1" = $1';

const reduceV1BStocks = 'UPDATE "stocks" set "v1_buffer" = $1';

const reduceV2BStocks = 'UPDATE "stocks" set "v2_buffer" = $1';

const isV1active = 'SELECT COUNT(*) FROM "reg_patients" where reg_patients.mobile = $1 and reg_patients.v1state = $2';

const v1done = 'UPDATE "reg_patients" SET "v1state" = $1 WHERE reg_patients.mobile = $2';

const v2pending = 'UPDATE "reg_patients" SET "v1state" = $1 WHERE reg_patients.mobile = $2';

const v2dose = 'SELECT COUNT(*) FROM "reg_patients" WHERE reg_patients.mobile = $1 AND reg_patients.v1state = $2 AND reg_patients.v2state = $3'

const v2done = 'UPDATE "reg_patients" SET "v2state" = $1 where reg_patients.mobile = $2';

const reduceV2Stocks = 'UPDATE "stocks" set "v2" = $1';

const addV1BStocks = 'UPDATE "stocks" set "v1_buffer" = "v1_buffer" + $1';

const addV1Stocks = 'UPDATE "stocks" set "v1" = "v1" + $1';

const addV2BStocks = 'UPDATE "stocks" set "v2_buffer" = "v2_buffer" + $1';

const addV2Stocks = 'UPDATE "stocks" set "v2" = "v2" + $1';

const v1date ='UPDATE "reg_patients" SET "v1done" = $1 where reg_patients.mobile = $2';

const v2date ='UPDATE "reg_patients" SET "v2done" = $1 where reg_patients.mobile = $2';

const day30window = `select * from "reg_patients" where date_part('day',age(current_date,v1done)) >= 0 and "v1state" = 'DONE' and "v2state" = 'INELIGIBLE' order by "reg_date"`;

const v1pendingToActive = 'update "reg_patients" SET "v1state" = $2 where v1state = $1';

const pplforPendingtoActive = `SELECT * from "reg_patients" where "v1state" = 'PENDING' order by "reg_date"`;

const pendingToIneligibleV2 = `UPDATE "reg_patients" SET "v2state" = 'PENDING' where reg_patients.mobile = $1`;

const IneligibleToPending = `UPDATE "reg_patients" SET "v2state" = 'PENDING' where "v2state" = 'INELIGIBLE' and "v1state" = 'DONE'`;

const pplforIneligibleToPending = `SELECT * from "reg_patients" where "v2state" = 'PENDING' order by "reg_date"`;

module.exports = {
    isRegisteredUser,
    assignV1,
    updateV1Stocks,
    updateV2Stocks,
    getV1Stocks,
    getV2Stocks,
    v1ToActive,
    v2ToActive,
    reduceV1Stocks,
    isV1active,
    v1done,
    v2dose,
    v2done,
    reduceV2Stocks,
    getV1BStocks,
    getV2BStocks,
    reduceV1BStocks,
    reduceV2BStocks,
    v2pending,
    addV1BStocks,
    addV1Stocks,
    addV2BStocks,
    addV2Stocks,
    v1date,
    v2date,
    day30window,
    v1pendingToActive,
    pplforPendingtoActive,
    pendingToIneligibleV2,
    pplforIneligibleToPending,
    IneligibleToPending 
};
