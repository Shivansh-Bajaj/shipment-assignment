var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}

var bcrypt = require('bcrypt-nodejs');


var newSchema = new Schema({
  
  'username': { type: String, unique : true, required : true, dropDups: true },
  'password': { type: String },
  'questions': [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  'favQuestions': [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  'createdAt': { type: Date, default: Date.now },
  'updatedAt': { type: Date, default: Date.now }
});

newSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

newSchema.pre('update', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

newSchema.pre('findOneAndUpdate', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});


newSchema.pre('save', function(next) {
  var record = this;

  // only hash if it has been modified (or is new)
  if (!record.isModified('password')) return next();

  // hash the password using our new salt
  bcrypt.hash(record['password'], null, null, function(err, hash) {
    if (err) return next(err);
    record['password'] = hash;
    next();
  });
});

newSchema.methods['passwordCompare'] = function(attempt, next) {
  bcrypt.compare(attempt, this['password'], function(err, isMatch) {
    if (err) return next(err);
    next(null, isMatch);
  });
};


module.exports = mongoose.model('User', newSchema);
