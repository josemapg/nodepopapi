'use strict'

// ---------------------------------- Database
import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    min: 0
  },
  passwd: {
    type: String,
    required: true,
    trim: true
  }
})

const AdsModel = mongoose.model('User', userSchema)

export default AdsModel
