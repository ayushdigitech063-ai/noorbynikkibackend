const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role : {
         type : String,
         enum : ['user' , 'admin'],
         default : 'user',

    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords do not match',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);