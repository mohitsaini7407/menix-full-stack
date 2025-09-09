const mongoose = require('mongoose');

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

// Vercel serverless function style handler
module.exports = async (req, res) => {
	// Enhanced CORS headers for Android and web requests
	const allowedOrigins = [
		process.env.FRONTEND_URL || 'https://menix.vercel.app',
		'https://menix.vercel.app',
		'capacitor://localhost',
		'http://localhost',
		'http://localhost:3000',
		'http://localhost:5173',
		'http://localhost:5174'
	];
	
	const origin = req.headers.origin;
	const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
	
	res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
	res.setHeader('Vary', 'Origin');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
	res.setHeader('Access-Control-Max-Age', '86400');

	// Preflight
	if (req.method === 'OPTIONS') {
		return res.status(204).end();
	}

	const path = (req.url || '').split('?')[0] || '/';

	// Lightweight health/status endpoints without DB
	if (req.method === 'GET' && (path === '/' || path === '/api/index' || path === '/api/health')) {
		return res.status(200).json({ 
			status: 'OK', 
			timestamp: new Date().toISOString(), 
			environment: process.env.NODE_ENV || 'development',
			userAgent: req.headers['user-agent'],
			origin: origin
		});
	}

	try {
		await connectDB();

		// Handle GET requests
		if (req.method === 'GET') {
			// Get tournaments
			if (path === '/api/tournaments' || path === '/tournaments') {
				try {
					const tournaments = await Tournament.find({}).sort({ createdAt: -1 });
					return res.status(200).json(tournaments);
				} catch (error) {
					console.error('Error fetching tournaments:', error);
					return res.status(500).json({ success: false, error: 'Failed to fetch tournaments' });
				}
			}
			
			// Get users (existing endpoint)
			if (path === '/api/users' || path === '/users') {
				const users = await User.find({}, 'email password');
				return res.status(200).json({ success: true, users });
			}
		}

		// Handle POST requests
		if (req.method === 'POST') {
			// Create tournament
			if (path === '/api/tournaments' || path === '/tournaments') {
				try {
					const tournamentData = req.body;
					const newTournament = new Tournament(tournamentData);
					await newTournament.save();
					console.log('Tournament created:', newTournament.name);
					return res.status(201).json(newTournament);
				} catch (error) {
					console.error('Error creating tournament:', error);
					return res.status(400).json({ success: false, error: error.message });
				}
			}
			
			// User authentication (existing endpoint)
			const { username, email, identifier, password } = req.body || {};
			const finalEmail = email || identifier;
			console.log('Login attempt:', { 
				finalEmail, 
				hasPassword: !!password,
				userAgent: req.headers['user-agent'],
				origin: origin,
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
		}

		return res.status(405).json({ success: false, error: 'Method Not Allowed' });
	} catch (err) {
		console.error('Backend error:', err);
		return res.status(500).json({ success: false, error: err.message });
	}
};
