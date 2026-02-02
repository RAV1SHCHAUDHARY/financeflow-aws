import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, Trash2, 
  Calculator, LogOut, User, Mail, Lock, Eye, EyeOff, 
  Target, CreditCard, Calendar, DollarSign, Download, Percent
} from 'lucide-react';
import { authAPI, expensesAPI, userAPI } from './services/api';

// Inline Styles
const styles = {
  authContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #312e81, #7e22ce, #be185d)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  authCard: {
    width: '100%',
    maxWidth: '28rem',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(40px)',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '2rem',
  },
  input: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    width: '100%',
    background: 'linear-gradient(to right, #06b6d4, #8b5cf6)',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.75rem',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
  },
  dashboard: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0f172a, #312e81, #0f172a)',
  },
  header: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(40px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1rem',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(40px)',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
  },
  statCard: {
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
    transform: 'scale(1)',
    transition: 'transform 0.3s',
  },
  label: {
    color: '#e9d5ff',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    display: 'block'
  }
};

// Authentication Component
function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await authAPI.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }

      const { token, user } = response.data.data;
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onLogin(user);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '1rem',
            background: 'linear-gradient(to bottom right, #22d3ee, #a855f7)',
            borderRadius: '1rem',
            marginBottom: '1rem'
          }}>
            <Wallet size={48} color="white" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: '0.5rem 0' }}>
            FinanceFlow Pro
          </h1>
          <p style={{ color: '#e9d5ff' }}>AWS-Powered Finance Management</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.2)', 
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#fca5a5'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              ...styles.button,
              background: isLogin ? 'linear-gradient(to right, #06b6d4, #8b5cf6)' : 'rgba(255,255,255,0.05)',
              boxShadow: isLogin ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : 'none'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              ...styles.button,
              background: !isLogin ? 'linear-gradient(to right, #06b6d4, #8b5cf6)' : 'rgba(255,255,255,0.05)',
              boxShadow: !isLogin ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#d8b4fe' }} size={20} />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{ ...styles.input, paddingLeft: '3rem' }}
                placeholder="Full Name"
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#d8b4fe' }} size={20} />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ ...styles.input, paddingLeft: '3rem' }}
              placeholder="Email Address"
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#d8b4fe' }} size={20} />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ ...styles.input, paddingLeft: '3rem', paddingRight: '3rem' }}
              placeholder="Password"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#d8b4fe' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button 
            type="submit" 
            style={{ ...styles.button, marginTop: '0.5rem', opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login to Dashboard' : 'Create Account')}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#e9d5ff', fontSize: '0.875rem', marginTop: '1.5rem' }}>
          Serverless Backend • Lambda + DynamoDB
        </p>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({ 
    description: '', 
    amount: '', 
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [investmentType, setInvestmentType] = useState('sip');
  const [principal, setPrincipal] = useState('');
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [years, setYears] = useState('');
  const [returnRate, setReturnRate] = useState('12');
  const [inflation, setInflation] = useState('6');
  const [investmentResult, setInvestmentResult] = useState(null);

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];
  const categoryColors = {
    Food: '#FF6B6B',
    Transport: '#4ECDC4',
    Entertainment: '#FFE66D',
    Shopping: '#95E1D3',
    Bills: '#F38181',
    Healthcare: '#AA96DA',
    Education: '#FCBAD3',
    Other: '#A8DADC'
  };

  // Load data from AWS on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('🔄 Loading data from AWS...');
      const [profileRes, expensesRes] = await Promise.all([
        userAPI.getProfile(),
        expensesAPI.list()
      ]);

      console.log('✅ Data loaded from DynamoDB');
      setUser(profileRes.data.data);
      setExpenses(expensesRes.data.data.expenses);
    } catch (error) {
      console.error('❌ Error loading data:', error);
      
      // Fallback to localStorage
      const savedExpenses = localStorage.getItem('expenses');
      const savedUser = localStorage.getItem('user');
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      if (savedUser) setUser(JSON.parse(savedUser));
    } finally {
      setLoading(false);
    }
  };

  const handleIncomeGoalUpdate = async (field, value) => {
    const updateData = { [field]: parseFloat(value) || 0 };
    
    // Update local state immediately for responsive UI
    const updatedUser = {...user, ...updateData};
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Save to AWS DynamoDB
    try {
      const response = await userAPI.updateProfile(updateData);
      console.log('✅ Profile saved to DynamoDB');
      setUser(response.data.data);
    } catch (error) {
      console.error('❌ Failed to save to DynamoDB:', error);
      // Keep local changes anyway
    }
  };

  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount) {
      alert('Please fill all fields');
      return;
    }

    try {
      // Save to AWS DynamoDB
      const response = await expensesAPI.create(newExpense);
      console.log('✅ Expense saved to DynamoDB');
      
      setExpenses([response.data.data, ...expenses]);
      setNewExpense({ 
        description: '', 
        amount: '', 
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('❌ Failed to save expense:', error);
      
      // Add locally as fallback
      const tempExpense = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        expenseId: `exp_${Date.now()}`,
        userId: user.userId,
        createdAt: new Date().toISOString()
      };
      setExpenses([tempExpense, ...expenses]);
      localStorage.setItem('expenses', JSON.stringify([tempExpense, ...expenses]));
      
      setNewExpense({ 
        description: '', 
        amount: '', 
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const deleteExpense = async (expenseId) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      // Delete from AWS DynamoDB
      await expensesAPI.delete(expenseId);
      console.log('✅ Expense deleted from DynamoDB');
      
      const updatedExpenses = expenses.filter(e => e.expenseId !== expenseId);
      setExpenses(updatedExpenses);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    } catch (error) {
      console.error('❌ Failed to delete from DynamoDB:', error);
      
      // Delete locally anyway
      const updatedExpenses = expenses.filter(e => e.expenseId !== expenseId);
      setExpenses(updatedExpenses);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = (user.income || 0) - totalExpenses;
  const savingsProgress = user.savingsGoal > 0 ? (balance / user.savingsGoal) * 100 : 0;

  const categoryData = categories.map(cat => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(item => item.value > 0);

  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({ month, amount: expense.amount });
    }
    return acc;
  }, []);

  const calculateInvestment = () => {
    const r = parseFloat(returnRate) / 100;
    const inf = parseFloat(inflation) / 100;
    const n = parseFloat(years);

    if (!n || n <= 0) {
      alert('Please enter valid investment period');
      return;
    }

    let futureValue, invested, returns;

    if (investmentType === 'lumpsum') {
      const p = parseFloat(principal);
      if (!p || p <= 0) {
        alert('Please enter valid investment amount');
        return;
      }
      futureValue = p * Math.pow(1 + r, n);
      invested = p;
      returns = futureValue - p;
    } else {
      const monthly = parseFloat(monthlyInvestment);
      if (!monthly || monthly <= 0) {
        alert('Please enter valid monthly investment');
        return;
      }
      const monthlyRate = r / 12;
      const months = n * 12;
      futureValue = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      invested = monthly * months;
      returns = futureValue - invested;
    }

    const realValue = futureValue / Math.pow(1 + inf, n);

    setInvestmentResult({
      futureValue: futureValue.toFixed(2),
      invested: invested.toFixed(2),
      returns: returns.toFixed(2),
      realValue: realValue.toFixed(2),
      returnsPercent: ((returns / invested) * 100).toFixed(2)
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expenses');
    onLogout();
  };

  const exportData = () => {
    const data = { 
      user: user.name, 
      income: user.income, 
      savingsGoal: user.savingsGoal,
      totalExpenses, 
      balance, 
      expenses, 
      exportDate: new Date().toISOString() 
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div style={{ ...styles.dashboard, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading from AWS...</div>
        <div style={{ color: '#d8b4fe', fontSize: '1rem' }}>DynamoDB • Lambda • API Gateway</div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'linear-gradient(to bottom right, #22d3ee, #a855f7)', borderRadius: '0.5rem' }}>
              <Wallet size={28} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>FinanceFlow Pro</h1>
              <p style={{ fontSize: '0.875rem', color: '#d8b4fe', margin: 0 }}>Welcome, {user.name}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={exportData} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
              <Download size={18} />
              <span>Export</span>
            </button>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ ...styles.statCard, background: 'linear-gradient(to bottom right, #10b981, #14b8a6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem' }}>
                <TrendingUp color="white" size={24} />
              </div>
              <span style={{ color: '#d1fae5', fontSize: '0.875rem', fontWeight: '500' }}>Income</span>
            </div>
            <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>₹{(user.income || 0).toLocaleString()}</p>
            <p style={{ color: '#d1fae5', fontSize: '0.875rem', margin: 0 }}>Monthly earnings</p>
          </div>

          <div style={{ ...styles.statCard, background: 'linear-gradient(to bottom right, #f43f5e, #ec4899)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem' }}>
                <TrendingDown color="white" size={24} />
              </div>
              <span style={{ color: '#fecdd3', fontSize: '0.875rem', fontWeight: '500' }}>Expenses</span>
            </div>
            <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>₹{totalExpenses.toLocaleString()}</p>
            <p style={{ color: '#fecdd3', fontSize: '0.875rem', margin: 0 }}>{expenses.length} transactions</p>
          </div>

          <div style={{ ...styles.statCard, background: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem' }}>
                <Wallet color="white" size={24} />
              </div>
              <span style={{ color: '#dbeafe', fontSize: '0.875rem', fontWeight: '500' }}>Balance</span>
            </div>
            <p style={{ color: balance < 0 ? '#fca5a5' : 'white', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>₹{balance.toLocaleString()}</p>
            <p style={{ color: '#dbeafe', fontSize: '0.875rem', margin: 0 }}>Available funds</p>
          </div>

          <div style={{ ...styles.statCard, background: 'linear-gradient(to bottom right, #8b5cf6, #a855f7)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem' }}>
                <Target color="white" size={24} />
              </div>
              <span style={{ color: '#ede9fe', fontSize: '0.875rem', fontWeight: '500' }}>Goal Progress</span>
            </div>
            <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{Math.min(savingsProgress, 100).toFixed(0)}%</p>
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', height: '0.5rem' }}>
              <div style={{ background: 'white', height: '0.5rem', borderRadius: '9999px', width: `${Math.min(savingsProgress, 100)}%`, transition: 'width 0.5s' }}></div>
            </div>
          </div>
        </div>

        {/* Income & Expense Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Income & Goals */}
          <div style={styles.card}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign color="#34d399" size={24} />
              Income & Savings Goal
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={styles.label}>Monthly Income (₹)</label>
                <input
                  type="number"
                  value={user.income || ''}
                  onChange={(e) => setUser({...user, income: parseFloat(e.target.value) || 0})}
                  onBlur={(e) => handleIncomeGoalUpdate('income', e.target.value)}
                  style={styles.input}
                  placeholder="Enter monthly income"
                />
              </div>

              <div>
                <label style={styles.label}>Savings Goal (₹)</label>
                <input
                  type="number"
                  value={user.savingsGoal || ''}
                  onChange={(e) => setUser({...user, savingsGoal: parseFloat(e.target.value) || 0})}
                  onBlur={(e) => handleIncomeGoalUpdate('savingsGoal', e.target.value)}
                  style={styles.input}
                  placeholder="Target savings amount"
                />
              </div>

              {user.savingsGoal > 0 && (
                <div style={{ background: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
                  <p style={{ color: '#e9d5ff', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Goal Status</p>
                  <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                    ₹{balance.toLocaleString()} / ₹{user.savingsGoal.toLocaleString()}
                  </p>
                  <p style={{ color: '#e9d5ff', fontSize: '0.875rem', margin: 0 }}>
                    {balance >= user.savingsGoal ? '🎉 Goal achieved!' : `₹${(user.savingsGoal - balance).toLocaleString()} to go`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Add Expense */}
          <div style={{ ...styles.card, gridColumn: 'span 2 / span 2' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard color="#22d3ee" size={24} />
              Add Expense
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={styles.label}>Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  style={styles.input}
                  placeholder="e.g., Groceries"
                />
              </div>
              <div>
                <label style={styles.label}>Amount (₹)</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  style={styles.input}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label style={styles.label}>Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  style={{...styles.input, background: '#1e293b'}}
                >
                  {categories.map(cat => (
                    <option 
                      key={cat} 
                      value={cat}
                      style={{background: '#1e293b', color: 'white'}}
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  style={styles.input}
                />
              </div>
            </div>

            <button onClick={addExpense} style={styles.button}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Plus size={20} /> Add Expense
              </div>
            </button>

            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '0.75rem' }}>Recent Transactions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '16rem', overflowY: 'auto' }}>
                {expenses.length === 0 ? (
                  <p style={{ color: '#d8b4fe', textAlign: 'center', padding: '2rem 0' }}>No expenses yet. Add your first transaction!</p>
                ) : (
                  expenses.slice(0, 5).map(exp => (
                    <div key={exp.expenseId} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: 'white', fontWeight: '600', margin: 0 }}>{exp.description}</p>
                        <p style={{ color: '#d8b4fe', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>{exp.category} • {new Date(exp.date).toLocaleDateString()}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ color: '#22d3ee', fontWeight: 'bold', fontSize: '1.125rem' }}>₹{exp.amount.toLocaleString()}</span>
                        <button onClick={() => deleteExpense(exp.expenseId)} style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={styles.card}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Spending by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '16rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#d8b4fe' }}>No expenses to display yet</p>
              </div>
            )}
          </div>

          <div style={styles.card}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Monthly Spending Trend</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" stroke="#e9d5ff" />
                  <YAxis stroke="#e9d5ff" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Bar dataKey="amount" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '16rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#d8b4fe' }}>No data to display yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Investment Calculator */}
        <div style={styles.card}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator color="#a855f7" size={24} />
            Investment Calculator
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={{ gridColumn: 'span 2 / span 2' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => setInvestmentType('sip')}
                  style={{
                    ...styles.button,
                    background: investmentType === 'sip' ? 'linear-gradient(to right, #06b6d4, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                    boxShadow: investmentType === 'sip' ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : 'none'
                  }}
                >
                  SIP Investment
                </button>
                <button
                  onClick={() => setInvestmentType('lumpsum')}
                  style={{
                    ...styles.button,
                    background: investmentType === 'lumpsum' ? 'linear-gradient(to right, #06b6d4, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                    boxShadow: investmentType === 'lumpsum' ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : 'none'
                  }}
                >
                  Lumpsum Investment
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {investmentType === 'lumpsum' ? (
                  <div>
                    <label style={styles.label}>Investment Amount (₹)</label>
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      style={styles.input}
                      placeholder="100000"
                    />
                  </div>
                ) : (
                  <div>
                    <label style={styles.label}>Monthly Investment (₹)</label>
                    <input
                      type="number"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(e.target.value)}
                      style={styles.input}
                      placeholder="5000"
                    />
                  </div>
                )}
                <div>
                  <label style={styles.label}>Investment Period (Years)</label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    style={styles.input}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label style={styles.label}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Percent size={14} />
                      Expected Return Rate (%)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={returnRate}
                    onChange={(e) => setReturnRate(e.target.value)}
                    style={styles.input}
                    placeholder="12"
                    step="0.1"
                  />
                </div>
                <div>
                  <label style={styles.label}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Percent size={14} />
                      Inflation Rate (%)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={inflation}
                    onChange={(e) => setInflation(e.target.value)}
                    style={styles.input}
                    placeholder="6"
                    step="0.1"
                  />
                </div>
              </div>

              <button onClick={calculateInvestment} style={{ ...styles.button, background: 'linear-gradient(to right, #a855f7, #06b6d4)' }}>
                Calculate Returns
              </button>
            </div>

            {investmentResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                  <p style={{ color: '#6ee7b7', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Future Value</p>
                  <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>₹{parseFloat(investmentResult.futureValue).toLocaleString()}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ color: '#d8b4fe', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Invested</p>
                  <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>₹{parseFloat(investmentResult.invested).toLocaleString()}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ color: '#67e8f9', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Returns</p>
                  <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>₹{parseFloat(investmentResult.returns).toLocaleString()}</p>
                  <p style={{ color: '#67e8f9', fontSize: '0.875rem', marginTop: '0.25rem' }}>+{investmentResult.returnsPercent}%</p>
                </div>
                <div style={{ background: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                  <p style={{ color: '#93c5fd', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Inflation-Adjusted Value</p>
                  <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>₹{parseFloat(investmentResult.realValue).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(40px)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '3rem', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <p style={{ color: '#d8b4fe', fontSize: '0.875rem', margin: 0 }}>
            FinanceFlow Pro - AWS Serverless Architecture
          </p>
          <p style={{ color: '#c084fc', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Lambda + DynamoDB + API Gateway + S3
          </p>
        </div>
      </footer>
    </div>
  );
}

// Main App
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <AuthScreen onLogin={handleLogin} />
  );
}