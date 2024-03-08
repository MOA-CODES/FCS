                        FCS (FEE CONFIGURATION SPECS)
How I approached the problem
    I first identified the models (FCS, CUSTOMER, PAYMENT ENTITY & TRANSACTION) and endpoints I would need to make use of (POST /fees, POST /compute-transaction-fee), and started by creating a FCS folder, initialized node project, created File structure folders and proceeded from there.

Dependencies Installed
    •	Bcryptjs – for password encryption.
    •	Country-data – for country code and currency
    •	Dotenv – for making .env variables in js files
    •	Express – to make use of the Express framework
    •	Express-async-errors – to handle Express async errors
    •	Jsonwebtoken – to generate tokens for authentication
    •	Mongoose – An ORM for simplified mongoose queries 

File Structure
    •	Controllers – holds controller files
    •	Db – holds database setup file
    •	Middleware – holds middleware files
    •	Models – holds model or table setup files
    •	Routes – holds routes files

Env Variables
    When you want to set up the project, add a .env file with these variables:
        •	MONGO_URI – the connection string to your mongo database
        •	SECRET_KEY – a 256- Bit encryption key
        •	SECRET_TIME – minute, hour, week, or day interval for tokens to expire

TBlacklist_M.js
	Database schema that holds blacklisted tokens 

Authentication.js
	Checks autheader for Bearer token, if the token exists in Tblacklist its blacklisted, if the token is valid attach customerId and token and pass to next function

Authentication is invalid when there exists no Bearer <Token> or an error occurs when verifying the token.

Auth_C.js
	Provides functions to register a customer, login a customer and logout a customer.
	Register
        •	Checks if email and password is present, if not throws a validation error
        •	Checks if fullname is present, if not makes use of email to generate it
        •	Makes use of the data above to create a customer

Login
    •	Checks if email and password is present, if not throws a validation error
    •	Checks if customer exist, if not throws a not found error
    •	Compares password provided and that of the customer to found validate or invalidate login in

Logout
    •	Gets customer
    •	Checks if customer exist, if not throws a not found error
    •	Compares password provided and that of the customer to found validate or invalidate login in

Fcs_C.js
	Provides functions createFCS, to handle receiving of FeeConfiguration Specs and TransactionFee to handle computing of transaction fee 
	CreateFCS
        •	Checks if FeeConfigurationSpec exists in body, if not throws a bad request error
        •	Passes the FeeConfigurationSpec to getFeeConfig function from services.js
        •	If an array is not received it throws an error with the next, if an array is received adds the content of the array to fcs_M table.

    GetAllFcs
        •	Checks if variables like: page, limit and some fcs_M data fields,  exist in req.query
        •	Uses those variables to query the fcs_M tables
        •	If they don’t retuns fee configurations with a default page of 1 and limit of 3 items in a page

	TransactionFee
        •	Gets a transaction variable from req.body
        •	Passes it to transactionValidator from Services.js, if it doesn’t return true throws a bad request error
        •	If true passes it to computeTransaction from Services.js, if it doesn’t return an Object, throws a not implemented error


Services.js
	Provides functions getFeeConfig, and … to handle or store reusuable codes
	GetFeeConfig
        •	Gets a text
        •	Divides the text into indexes of each new line
        •	If the number of indexes according to “ “ in the current row is not 8 throws an invalid syntax eror
        •	Gets specific data from an text and places it into an object that stores accordingly to data fields in the fcs_M table.
       
        •	If a specific data, is null, undefined or ‘’, returns a text to explaining to provide the specific data.
        •	Returns the object created



    TransactionValidator
        •	Validates a transaction based of:
        •	 the length transaction
        •	Availability of the needed fields of a transaction
        •	The length and content of the customer object within the transaction 
        •	The length and content of the PaymentEntity object within the transaction .
        •	If all are valid returns true

	ComputeTransaction
        •	Destructures a transaction and searches for a Fee configuration spec that matches a transaction
        •	If none are found sends a not found error
        •	If one is found, creates an object and attaches appliedfeeid, appliedfeevalue, chargedamount and settlementamount to it
        •	Appliedfeeid is the fee id of the fee configuration spec found
        •	 Appliedfeevalue is passed to calculate fee with paramers amount, feetype and fee value to calculate the fee
        •	Chargedamount is amount if bearsfee is false, but if true chargedamount is amount + appliedfeevalue
        •	SettlementAmount is chargedamount - appliedfee

    CalculateFee
        •	If fee type is flat, applied fee is fee value  
        •	If fee type is perc, applied fee is (fee value /100) * amount
        •	If fee type is flat_perc, applied fee is fee value  + ((fee value /100) * amount)



How to start the Project
    •	On Bash or Terminal type in “node index.js” and click Enter

 Or,
        
    •	Install nodemon as a dev dependency “npm I nodemon –save-dev”
    •	Set up a start script as:
    "scripts": {
    "start": "nodemon index.js"
    },
    •	On Bash or Terminal type in “npm start” and click Enter

