import mongoose from "mongoose";
import User from "./../schema/UserSchema";

export function createUser(data, callback) {
    const userModel = new User(data);
    userModel.save(function (err, user) {
        callback(err, user);
    })
}

export function getUserById(id, callback) {
    User.findOne({ "id": parseInt(id) }, function (err, user) {
        callback(err, user)
    });
}

export function getUsers(callback) {
    User.find({}, function (err, users) {
        callback(err, users)
    });
}

export function getUserByEmail(email, callback) {
    User.findOne({ "email": email }, function (err, user) {
        callback(err, user)
    });
}

export function getUserByUsername(username, callback) {
    User.findOne({ "username": username }, function (err, user) {
        callback(err, user)
    });
}

export function updateUserById(id, data, callback) {
    data.lastModifiedAt = new Date((new Date()).getTime() + (3600000*(-7)));
    User.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, user) {
        callback(err, user);
    });
}

export function removeUserById(id, callback) {
    //data.lastModifiedAt = new Date();
    User.findOneAndRemove({ "id": parseInt(id) }, function (err, user) {
        callback(err, user);
    });
}
