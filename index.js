// database connector
var database = require("./database"),
	util = require("util"),
	ObjectID = require("mongodb").ObjectID;

//
// GenericObject Constructor and important startup function
//
var GenericObject  = function(table_name) {
	var self = this;
	
	self._collection_name = table_name;
};

//
// CRUD action
//
GenericObject.prototype.create = function(dataObject, callback) {
	var self = this;

	database.getInstance(function(err, db) {
		if(err) {
			return callback(err);
		}
		
		db.collection(self._collection_name, function(err, collection) {
			if(err) {
				return callback(err);
			}
			
			collection.insert(dataObject, { safe: true }, function(err, result) {
				if(err) {
					return callback(err);
				}

				callback(null, { insertId: result[0]._id });
			});
		});
	});
};

GenericObject.prototype.select = function() {
	var self = this;

	// argument parser
	var callback, options;

	if( typeof arguments[0] === "function" ) {
		callback = arguments[0];
	} else {
		options = arguments[0];
		callback = arguments[1];
	}
	
	// just in case of no option exists
	options = (!options) ? {} : options;

	//
	// where
	// limit
	// offset
	// fields
	var _mongo_options = {}, _mongo_selector = {};

	// build selector
	if( options.where && (typeof options.where === "object") ) {
		if(options.where._id && typeof options.where._id === "string") {
            try {
                options.where._id = ObjectID(options.where._id);
            }
            catch (err) {
                return callback(err);
            }
		}

		_mongo_selector = options.where;
	}

	// build selected fields
	if( options.fields && util.isArray(options.fields) && options.fields.length > 0 ) {
		_mongo_options.fields = {};

		options.fields.map(function(selected_field) {
			_mongo_options.fields[selected_field] = 1;
		});
	}

	// limit
	if( options.limit && parseInt(options.limit) > 0 ) {
		_mongo_options.limit = options.limit;
	}

	// offset
	if( options.offset && parseInt(options.offset) > 0 ) {
		_mongo_options.skip = options.skip;
	}

	// start connect to database
	database.getInstance(function(err, db) {
		if(err) {
			return callback(err);
		}
		
		db.collection(self._collection_name, function(err, collection) {
			if(err) {
				return callback(err);
			}

			collection.find( _mongo_selector, _mongo_options, function(err, result) {
				if(err) {
					return callback(err);
				}

				result.toArray(function(err, result) {
					if(err) {
						return callback(err);
					}

					callback(null, result);
				});
			});
		});
	});
};

GenericObject.prototype.update = function(options, newDataObject, callback) {
	var self = this;

	// just in case of no option exists
	options = (!options) ? {} : options;

	// where
	var _mongo_selector = {},
		_mongo_options = { safe: true, multi: true },
		_mongo_query_object = {};

	// build selector
	if( options.where && (typeof options.where === "object")) {
		_mongo_selector = options.where;
	}

	// build data
	if( "$set" in newDataObject || "$push" in newDataObject || "$unset" in newDataObject || "$pull" in newDataObject ) {
		_mongo_query_object = newDataObject;
	} else {
		_mongo_query_object["$set"] = newDataObject;
	}

	// start connect to database
	database.getInstance(function(err, db) {
		if(err) {
			return callback(err);
		}
		
		db.collection(self._collection_name, function(err, collection) {
			if(err) {
				return callback(err);
			}

			collection.update( _mongo_selector , _mongo_query_object,  _mongo_options, function(err, result) {
				if(err) {
					return callback(err);
				}

				return callback( null, { success: true } );
			});
		});
	});
};

GenericObject.prototype.remove = function(options, callback) {
	var self = this;

	// just in case of no option exists
	options = (!options) ? {} : options;

	// where
	var _mongo_selector = {},
		_mongo_options = { safe: true };

	// build selector
	if( options.where && (typeof options.where === "object")) {
		_mongo_selector = options.where;
	}
	
	// start connect to database
	database.getInstance(function(err, db) {
		if(err) {
			return callback(err);
		}
		
		db.collection(self._collection_name, function(err, collection) {
			if(err) {
				return callback(err);
			}

			collection.remove( _mongo_selector, { safe: true }, function(err, affectDocuments) {
				if(err) {
					return callback(err);
				}

				callback(null, { affectedRows: affectDocuments });
			});
		});
	});
};

// module exporting
module.exports = GenericObject;
