const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now, // No parentheses here
    },
    active: {
        type: Boolean,
        default: true,
    },
    firstName: {
        type: String,
        required: [true, "Please provide a valid firstName"],
    },
    email: {
        type: String,
        required: [true, "Please provide a valid email-id"],
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return emailValidator.validate(v);
            },
            message: "Please provide a valid email!",
        },
    },
    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please provide a passwordConfirm"],
        select: false,
        validate: {
            validator: function(v) {
                return this.password === v;
            },
            message: "Provided passwords do not match!",
        },
    },
    passwordChangeAt: {
        type: Date,
        default: Date.now, // No parentheses here
        select: false,
    }
});

// Pre-save middleware to hash password
UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    // Update the passwordChangeAt timestamp
    this.passwordChangeAt = Date.now(); // Use parentheses to call the method

    next();
});

// Instance methods
UserSchema.methods.passwordChangeAfter = function(JWTissuedAt) {
    if (this.passwordChangeAt) {
        const timeStampInMilliseconds = this.passwordChangeAt.getTime();
        const changedTimestamp = parseInt(timeStampInMilliseconds / 1000, 10);
        return JWTissuedAt < changedTimestamp;
    }
    return false;
};

UserSchema.methods.isCorrectPassword = async function(rawPassword) {
    return bcrypt.compare(rawPassword, this.password);
};

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
