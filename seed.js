const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const Category = require('./models/Category');

dotenv.config();

const categories = [
  { name: 'Salary', color: '#2ECC71', type: 'income' },
  { name: 'Food', color: '#FF9F43', type: 'expense' },
  { name: 'Fuel', color: '#FF5E5E', type: 'expense' },
  { name: 'Shopping', color: '#54A0FF', type: 'expense' },
  { name: 'Groceries', color: '#10AC84', type: 'expense' },
  { name: 'Travelling', color: '#00D2D3', type: 'expense' },
  { name: 'Entertainment', color: '#5F27CD', type: 'expense' },
  { name: 'Health', color: '#EE5253', type: 'expense' },
  { name: 'Others', color: '#8395A7', type: 'expense' }
];

const seedData = async () => {
  try {
    const uri = process.env.MONGO_URL;
    await mongoose.connect(uri);
    console.log('Connected to DB for seeding...');

    // Clear existing
    await Transaction.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});

    // Create a Default User
    const user = await User.create({
      name: 'Adrian Thorne',
      email: 'adrian@architect.com',
      avatar: 'https://i.pravatar.cc/150?u=adrian',
      theme: 'dark'
    });

    // Create Categories linked to User
    await Category.insertMany(categories.map(c => ({ ...c, userId: user._id })));

    const now = new Date();
    const transactions = [];

    // Generate 5 months of data
    for (let i = 0; i < 5; i++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        
        // One Salary per month
        transactions.push({
            title: `Monthly Salary - ${monthDate.toLocaleString('default', { month: 'long' })}`,
            amount: 75000 + Math.random() * 5000,
            type: 'income',
            category: 'Salary',
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
            userId: user._id
        });

        // 15-20 random expenses per month
        const numExpenses = 15 + Math.floor(Math.random() * 10);
        for (let j = 0; j < numExpenses; j++) {
            const cat = categories.filter(c => c.type === 'expense')[Math.floor(Math.random() * 8)];
            const day = 1 + Math.floor(Math.random() * 28);
            
            transactions.push({
                title: `${cat.name} Purchase #${j+1}`,
                amount: 100 + Math.random() * 5000,
                type: 'expense',
                category: cat.name,
                date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
                userId: user._id
            });
        }
    }

    await Transaction.insertMany(transactions);
    console.log(`Successfully seeded ${transactions.length} records!`);
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
