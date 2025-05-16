const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        firstname: {
            type: String,
            required: true,
            minlength: [3,'Firstname should atleast be 3 characters long']
        },
        lastname: {
            type: String,
            minlength: [3,'lastname should atleast be 3 characters long']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function(v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            }
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        socketId: {
            type: String,
        },

    }
});
userSchema.methods.generateAuthToken = function(){
    const token =jwt.sign({ _id: this._id},process.env.JWT_SECRET);
    return token;
}
userSchema.comparePass = async function(pass){
    return await bcrypt.compare(pass, this.password);
}
userSchema.statics.hashPassword = async function(pass){
    
    return await bcrypt.hash(pass, 10);
}
const userModel = mongoose.model("user", userSchema);


module.exports = userModel;