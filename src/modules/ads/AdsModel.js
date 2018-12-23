'use strict'

// ---------------------------------- Database
import mongoose from 'mongoose'

const adsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  onsale: {
    type: Boolean,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  photo: String,
  tags: [String]
})

const AdsModel = mongoose.model('Ad', adsSchema)

export default AdsModel
