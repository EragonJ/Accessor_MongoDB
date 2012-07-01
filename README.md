# Accesor_MongoDB 0.2.0

A wrapper for Access to connect with ease and flexiblity.

---

## Package Install

1. Install via npm is a prefer way for users to obtain a copy of Access_MongoDB
		
		npm install Accessor_MongoDB

2. Create a config directory under your application directory, create a file called **databaseConfig.js** which may contains like this:

		var databaseConfig = { 
			// server
			host: "localhost",
			
			server_options: {
				auto_reconnect: true,
			},  
        
        	// database
        	name: "ddns",
        	
        	db_options: {
        		native_parser: true,
        	},  
        };
        
        module.exports = databaseConfig;

3. Now, Accessor_MongoDB is ready.

## Usage

1. Require the Accessor module in your script

2. Place constructor where you need that. And don't forget to specify database engine.

		var tester = Accessor("YOUR_TARGET_COLLECTION", "MongoDB");

3. After initialization, Accessor will connect to MongoDB server.

### Methods

#### accessor.select( {options}, callback(err, data_fields) );

Perform a select query to obtain data, for example:

		var tester = Accessor("test_collection");
		
		var options = {
			where: {
				name: "bu"
			},
			
			limit: 100,
			offset: 50,
			
			fields: ["name"]
		};
		
		tester.select( options, function(err, data) {
			if(err) {
				throw err;
			}	
			
			return data;
		});
		
Currently, {options} has implements following attributes:
 
 * where
 * limit
 * offset
 * fields
 
##### Note
 
Options may omit, which retrieve all records, i.e.

		var tester = Accessor("test_collection");
		
		tester.select( function(err, data) {
			if(err) {
				throw err;
			}	
			
			return data;
		});

#### accessor.create( {dataObject}, callback(err, info) );


Insert data record by given dataObject

		var tester = Accessor("test_collection");
		
		var dataObject = {
			name: "bu",
			email: "bu@hax4.in",
		};
		
		tester.create( dataObject, function(err, info) {
			if(err) {
				throw err;
			}	
			
			return info.insertId;
		});

#### accessor.update( {options}, {dataObject}, callback(err, info) );


Update records filter by option.where with updated_dataObject

		var tester = Accessor("test_collection");
		
		var dataObject = {
			email: "bu@hax4.in",
		};
		
		var options = {
			where: {
				username: "bu"
			}
		};
		
		tester.update( options, dataObject, function(err, info) {
			if(err) {
				throw err;
			}	
			
			return info.affectedRows;
		});
		
Despite it simple syntax, in fact, you could do more with it:
If given dataObject is wrapper in MongoDB operator, it will automaticlly use that mode to update.

		var tester = Accessor("test_collection");
		
		var dataObject = {
			$unset: {
				email: 1
			}
		};
		
		var options = { 
			where: {
				username: "bu"
			}
		};
		
		tester.update( options, dataObject, function(err, info) {
			if(err) {
				throw err;
			}
			
			return info.affectedRows;
		};

* If options is omitted, it will update all records. (due to no filter)

		var tester = Accessor("test_collection");
		
		var dataObject = {
			email: "bu@hax4.in"
		};
	
		tester.update( {}, dataObject, function(err, info) {
			if(err) {
				throw err;
			}	
			
			return info.affectedRows;
		});
		


#### accessor.remove( {options}, callback(err, info) );

Remove records filter by options.where

		var tester = Accessor("test_collection");
		
		var options = {
			where: {
				username: "bu"
			}
		};
		
		tester.update( options, function(err, info) {
			if(err) {
				throw err;
			}	
			
			return info.affectedRows;
		});
		
##### Note

* If options is omitted, it will remove all records. (due to no filter)

		var tester = Accessor("test_collection");
	
		tester.remove( {}, function(err, info) {
			if(err) {
				throw err;
			}	
			
			return info.affectedRows;
		});

### LICENSE

Copyright (c) 2012 Buwei Chiu <bu@hax4.in>

Licensed under the MIT License
