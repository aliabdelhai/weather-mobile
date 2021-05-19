const mongoose = require('mongoose')
const Schema = mongoose.Schema

const citySchema = new Schema({
    name: String,
    temperature: Number,
    condition: String,
    conditionIcon: String,
    diff: Number,
    lastUpdated: Date,
    lastRefreshed: Date
})

const City = mongoose.model("city", citySchema)
module.exports = City