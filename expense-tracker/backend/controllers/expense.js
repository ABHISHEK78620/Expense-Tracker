const ExpenseSchema = require("../models/ExpenseModel")


exports.addExpense = async (req, res) => {
    
    const {title, amount, category, description, date,userId}  = req.body
     //console.log(userId);
    try {
        //validations
        if(!title || !category || !description || !date || !userId) {
            return res.status(400).json({message: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
    await ExpenseSchema.create({ title, amount, category, description, date, user: userId });
        res.status(200).json({message: 'Expense Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.getExpense = async (req, res) =>{
    try {
        const  userId= req.query.userId;
          const incomes = await ExpenseSchema.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteExpense = async (req, res) =>{
    const {id} = req.params;
    const  userId= req.query.userId;
    ExpenseSchema.findByIdAndDelete({
        _id: id,
        user: userId
    })
        .then((income) =>{
            res.status(200).json({message: 'Expense Deleted'})
        })
        .catch((err) =>{
            res.status(500).json({message: 'Server Error'})
        })
}