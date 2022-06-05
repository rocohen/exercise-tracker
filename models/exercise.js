const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

exerciseSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    // returnedObject.date = new Date(returnedObject.date).toDateString()
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Exercise', exerciseSchema);
