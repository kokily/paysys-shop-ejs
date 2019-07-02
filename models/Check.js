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

Check.plugin(autoIncrement.plugin, {
  model: 'Check',
  field: 'id',
  startAt: 1
});

export default mongoose.model('Check', Check);