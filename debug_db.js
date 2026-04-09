const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('./models/Transaction');
const User = require('./models/User');

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to DB');
    
    const user = await User.findOne({ email: 'adrian@architect.com' });
    if (!user) {
      console.log('User adrian@architect.com NOT FOUND');
    } else {
      console.log('User ID:', user._id);
      const count = await Transaction.countDocuments({ userId: user._id });
      console.log('Transaction count for user:', count);
      
      const oneTx = await Transaction.findOne({ userId: user._id });
      if (oneTx) {
          console.log('Sample Tx userId type:', typeof oneTx.userId);
          console.log('Sample Tx userId value:', oneTx.userId);
      }
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDB();
