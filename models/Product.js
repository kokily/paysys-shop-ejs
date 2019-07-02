import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

autoIncrement.initialize(mongoose.connection);
mongoose.set('useCreateIndex', true);

const Product = new mongoose.Schema({
  native: String,
  division: String,
  productName: String,
  price: Number,
  unit: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

Product.virtual('getDate').get(function () {
  const date = new Date(this.createdAt);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
});

Product.plugin(autoIncrement.plugin, {
  model: 'Product',
  field: 'id',
  startAt: 1
});

export default mongoose.model('Product', Product);