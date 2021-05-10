create database "sampledb"; -- kindly change according your preference.

create user "devanathan" with password '1234'; -- kindly change to your username and password

grant all  privileges on database "sampledb" to "devanathan";

\c sampledb

CREATE TABLE "reg_patients" (
    "firstname" character(20),
    "lastname" character(5),
    "mobile" character(10) PRIMARY KEY,
    "v1state" character(10),
    "v1done" date,
    "v2state" character(10),
    "v2done" date,
    "reg_date" date
);

CREATE UNIQUE INDEX "reg_patients_pkey" ON "reg_patients"(mobile bpchar_ops);

GRANT ALL PRIVILEGES ON TABLE "reg_patients" TO devanathan;

CREATE TABLE "stocks" (
    "v1" integer,
    "v2" integer,
    "v1_buffer" integer,
    "v2_buffer" integer
);

INSERT INTO "stocks" VALUES (2,2,2,2);

GRANT ALL PRIVILEGES ON TABLE "stocks" TO devanathan;

-- RUN the command ::: psql -U your_user_name  -d your_db_name -a -f DBProcess.sql (in terminal);   

