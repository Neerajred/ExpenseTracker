const mongoose = require('mongoose');
const Category = require('./models/Category');

require('dotenv').config();

async function checkCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to DB');
    
    const count = await Category.countDocuments();
    console.log('Total category count:', count);
    
    if (count > 0) {
      const sample = await Category.findOne();
      console.log('Sample category:', JSON.stringify(sample, null, 2));
    } else {
      console.log('No categories found at all. Need to seed.');
    }
    
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

checkCategories();