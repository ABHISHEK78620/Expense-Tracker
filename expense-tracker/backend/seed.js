const mongoose = require('mongoose');
const Income = require('./models/IncomeModel');
const User = require('./models/User'); // Import the User model

const incomeData = [
    {
        title: "Ayush Chaturvedi",
        amount: 12,
        type: "income",
        date: new Date(),
        category: "Salary",
        description: "Salary",
    },
    {
        title: "Aman",
        amount: 120,
        type: "race",
        date: new Date(),
        category: "Salary",
        description: "Salary",
    }
];

async function seedDB() {
    try {
        // Find the user 'ayushch07'
        const user = await User.findOne({ username: "ayushch07" });

        if (!user) {
            console.error("User 'ayushch07' not found.");
            return;
        }

        // Populate the user field in the income data with the user's _id
        const incomeWithUser = incomeData.map(entry => ({
            ...entry,
            user: user._id
        }));

        // Insert the income data
        await Income.insertMany(incomeWithUser);
        console.log("Data seeded successfully.");
    } catch (err) {
        console.error("Error seeding data:", err);
    }
}

module.exports = seedDB;
