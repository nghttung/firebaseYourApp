var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var name = [
  validate({
    validator: 'matches',
    arguments: /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\d]+$/,
    message: 'Ho va ten khong duoc co ky tu dac biet'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 30],
    message: 'Username phai tu {ARGS[0]} den {ARGS[1]} ky tu'
  })
];

var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Email khong dung dinh dang'
  }),
  validate({
    validator: 'isLength',
    arguments: [6, 100],
    message: 'Email phai tu {ARGS[0]} den {ARGS[1]} ky tu'
  })
];

var passwordValidator = [
  validate({
    validator: 'isLength',
    arguments: [6, 35],
    message: 'Password phai tu {ARGS[0]} den {ARGS[1]} ky tu'
  })
];

var User = new Schema({
  name: {type: String, validate: name},
  email: { type: String, lowercase: true, unique: true, validate: emailValidator},
  pass: { type: String, validate: passwordValidator, select: false},
  active: {type: Boolean, required: true, default: false },
  temporarytoken: {type: String, required: true },
  resettoken: { type: String, required: false },
  permission: {type: String, required: true, default: 'user'}
});

/*
* mongoose pre save middleware
* http://mongoosejs.com/docs/middleware.html
* function called prior to saving schema
*/
User.pre("save", function(next) {
  // get this user object
  var user = this;
  
  if (!user.isModified('pass')) return next();

  // bcrypt-nodejs
  // native JS bcrypt library for NodeJS
  // https://www.npmjs.com/package/bcrypt-nodejs
  // hash(data, salt, progress, cb)
  bcrypt.hash(user.pass, null, null, function(err, hash) {
    if(err) {
      return next(err);
    }
    user.pass = hash;
    next();
  });
});

// mongoose-title-case plugin will force capitalization of 1st letter, lowercase of remaining chars
// https://www.npmjs.com/package/mongoose-title-case
// Attach some mongoose hooks 
User.plugin(titlize, {
  paths: ['name'] // Array of paths 
});


User.methods.comparePassword = function(pass) {
  return bcrypt.compareSync(pass, this.pass);
};

module.exports = mongoose.model('User', User)