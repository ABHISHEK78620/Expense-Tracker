import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import axios from 'axios';

const BASE_URL = "http://localhost:8000/";
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('');
    const loggedInUserId = localStorage.getItem('userId');

    // Function to add a new income
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, { ...income, userId: loggedInUserId });
            getIncomes();
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while adding income.');
        }
    }

    // Function to retrieve incomes
    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`, {
                params: {
                    userId: loggedInUserId
                }
            });
        
            setIncomes(response.data); 
       
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while fetching incomes.');
        }
    }

    // Function to retrieve expenses
    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`, {
                params: {
                    userId: loggedInUserId
                }
            });
            setExpenses(response.data);
           
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while fetching expenses.');
        }
    }

    // Function to delete an income
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`, {
                params: {
                    userId: loggedInUserId
                }
            });
            getIncomes();
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while deleting income.');
        }
    }

    // Function to add a new expense
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, { ...expense, userId: loggedInUserId });
            getExpenses();
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while adding expense.');
        }
    }

    // Function to delete an expense
    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`, {
                params: {
                    userId: loggedInUserId
                }
            });
            getExpenses();
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while deleting expense.');
        }
    }

    // Function to calculate total income
    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    }

    // Function to calculate total expenses
    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    // Function to calculate total balance
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    }

    // Function to get transaction history
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    }

    // Memoize context value to prevent unnecessary rerenders
    const contextValue = useMemo(() => ({
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        addExpense,
        getExpenses,
        expenses,
        deleteExpense,
        totalIncome,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError
    }), [incomes, expenses, error]);

    useEffect(() => {
        getIncomes();
    }, []); // Empty dependency array ensures these effects run only once
    useEffect(() => {
        getExpenses();
    }, []); 
    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}
