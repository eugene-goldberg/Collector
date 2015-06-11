'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Datacollector Schema
 */
var DatacollectorSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Datacollector name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Datacollector', DatacollectorSchema);