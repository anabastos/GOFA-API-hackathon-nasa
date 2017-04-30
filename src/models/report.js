import mongoose from 'mongoose'
import config from '../../config'

const Report = new mongoose.Schema({
  rain: { type: Number, required: true },
  status: { type: Number, required: true },
  location: { type: [Number], index: '2dsphere', required: true },
  message: { type: String }
});


export default mongoose.model('report', Report)