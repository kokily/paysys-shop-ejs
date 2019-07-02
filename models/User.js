import mongoose from 'mongoose';

mongoose.set('useCreateIndex', true);

const User = new mongoose.Schema({
  username: String,
  password: String,
  employee: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

User.virtual('getDate').get(function () {
  const date = new Date(this.createdAt);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
});

export default mongoose.model('User', User);