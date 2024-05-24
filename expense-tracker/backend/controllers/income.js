const Income = require('../models/IncomeModel');

exports.addIncome = async (req, res) => {
    try {
        const { title, amount, category, description, date, userId } = req.body;

        if (!title || !amount || !category || !description || !date || !userId) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        await Income.create({ title, amount, category, description, date, user: userId });

        res.status(200).json({ message: 'Income Added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.getIncomes = async (req, res) => {
    try {
        const  userId= req.query.userId;
      //  console.log(userId);
        const incomes = await Income.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.deleteIncome = async (req, res) => {
    try {
        const  userId= req.query.userId;
        const { id } = req.params;
        const deletedIncome = await Income.findOneAndDelete({ _id: id, user: userId });

        if (!deletedIncome) {
            return res.status(404).json({ message: 'Income not found' });
        }

        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
