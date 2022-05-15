require('../utils/database');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required']
    },
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required']
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    personGroupId: {
        type: String,
        trim: true,
        default: process.env.PERSON_GROUP_ID
    },
    personId: {
        type: String,
        trim: true
    },
    persistedFaceId: {
        type: String,
        trim: true
    },
    organisations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'organisation'
        }
    ]
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

//used to login user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email');
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
        throw new Error('Invalid password');
    }
    return user;
};

//for hashing the password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
