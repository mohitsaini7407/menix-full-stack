const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://menix.vercel.app'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
let conn = null;
async function connectDB() {
  if (!conn) {
    try {
      console.log('Connecting to MongoDB...');
      conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB Connected Successfully');
    } catch (error) {
      console.error('MongoDB Connection Error:', error);
      throw error;
    }
  }
  return conn;
}

// Schemas
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  wallet: Number,
});

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Solo', 'Squad'] },
  matchType: { type: String, required: true },
  map: { type: String, required: true },
  gameMode: { type: String, required: true },
  perspective: { type: String, required: true },
  status: { type: String, required: true, enum: ['Active', 'Completed', 'upcoming', 'ongoing'] },
  entryFee: { type: Number, required: true },
  prize: { type: Number, required: true },
  joined: { type: Number, default: 0 },
  totalSlots: { type: Number, required: true },
  startTime: { type: Date, required: true },
  duration: { type: String, required: true },
  rounds: { type: Number, required: true },
  roomId: { type: String },
  roomPassword: { type: String },
  registeredTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Tournament = mongoose.models.Tournament || mongoose.model('Tournament', tournamentSchema);

// Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(), 
    environment: process.env.NODE_ENV || 'development',
    message: 'Menix Backend API is running!'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(), 
    environment: process.env.NODE_ENV || 'development'
  });
});

// Razorpay routes
app.get('/api/razorpay/key', (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    return res.status(500).json({ success: false, error: 'Razorpay not configured' });
  }
  res.json({ success: true, key: process.env.RAZORPAY_KEY_ID });
});

app.post('/api/razorpay/order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body || {};
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Razorpay order error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

app.post('/api/razorpay/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Missing payment params' });
    }
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    const isValid = generatedSignature === razorpay_signature;
    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    // If valid, optionally credit wallet
    if (userId && typeof amount === 'number') {
      try {
        await connectDB();
        await User.updateOne({ _id: userId }, { $inc: { wallet: Math.round(Number(amount)) } });
      } catch (e) {
        console.error('Wallet credit error:', e);
      }
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

// Tournaments endpoints
app.get('/api/tournaments', async (req, res) => {
  try {
    await connectDB();
    const tournaments = await Tournament.find({}).sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tournaments' });
  }
});

app.post('/api/tournaments', async (req, res) => {
  try {
    await connectDB();
    const tournamentData = req.body;
    const newTournament = new Tournament(tournamentData);
    await newTournament.save();
    console.log('Tournament created:', newTournament.name);
    res.status(201).json(newTournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Users endpoints
app.get('/api/users', async (req, res) => {
  try {
    await connectDB();
    const users = await User.find({}, 'email password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    await connectDB();
    const { username, email, identifier, password } = req.body || {};
    const finalEmail = email || identifier;
    
    console.log('Login attempt:', { 
      finalEmail, 
      hasPassword: !!password,
      userAgent: req.headers['user-agent'],
      origin: req.headers.origin,
      contentType: req.headers['content-type']
    });
    
    if (!finalEmail || !password) {
      return res.status(400).json({ success: false, error: 'email/identifier and password are required' });
    }
    
    // First try to authenticate existing user
    console.log('Looking for existing user with email:', finalEmail);
    const existingUser = await User.findOne({ email: finalEmail });
    console.log('Existing user found:', !!existingUser);
    
    if (existingUser) {
      // User exists, check password
      console.log('Checking password for user:', existingUser.email);
      if (existingUser.password === password) {
        // Password matches, return user data
        console.log('Password match successful for user:', existingUser.email);
        return res.status(200).json({ 
          success: true, 
          user: {
            id: existingUser._id,
            username: existingUser.username || finalEmail.split('@')[0],
            email: existingUser.email,
            wallet: existingUser.wallet || 0
          }
        });
      } else {
        // Wrong password
        console.log('Password mismatch for user:', existingUser.email);
        return res.status(401).json({ success: false, error: 'Invalid password' });
      }
    }
    
    // User doesn't exist, create new user
    console.log('Creating new user with email:', finalEmail);
    const newUser = new User({ 
      username: username || (finalEmail.includes('@') ? finalEmail.split('@')[0] : String(finalEmail)), 
      email: finalEmail, 
      password, 
      wallet: 0 
    });
    await newUser.save();
    console.log('New user created:', newUser.email);
    
    return res.status(201).json({ 
      success: true, 
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        wallet: newUser.wallet
      }
    });
  } catch (error) {
    console.error('User creation/authentication error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Tournaments API: http://localhost:${PORT}/api/tournaments`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

