import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

autoIncrement.initialize(mongoose.connection);
mongoose.set('useCreateIndex', true);

const Check = new mongoose.Schema({
  totalAmount: Number,
  username: String,
  employee: String,
  title: {
    type: String,
    default: 'No Title'
  },
  etc: {
    type: String,
    default: '특이사항 없음'
  },
  hall: String,
  cartList: [{
    native: String,
    productName: String,
    price: Number,
    number: Number,
    amount: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

Check.virtual('getDate').get(function () {
  const date = new Date(this.createdAt);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
});

Check.plugin(autoIncrement.plugin, {
  model: 'Check',
  field: 'id',
  startAt: 1
});

export default mongoose.model('Check', Check);