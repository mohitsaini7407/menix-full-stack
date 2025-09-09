const mongoose = require('mongoose');
require('dotenv').config();

// Tournament Schema
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

const Tournament = mongoose.model('Tournament', tournamentSchema);

// Sample tournament data
const sampleTournaments = [
	{
		name: 'BGMI Solo Showdown',
		type: 'Solo',
		matchType: 'Solo',
		map: 'Erangel',
		gameMode: 'Classic',
		perspective: 'TPP',
		status: 'Active',
		entryFee: 50,
		prize: 1000,
		joined: 25,
		totalSlots: 25,
		startTime: new Date('2024-06-10T18:00:00Z'),
		duration: '30 minutes',
		rounds: 4,
		roomId: 'SOLO001',
		roomPassword: 'solo123'
	},
	{
		name: 'BGMI Squad Battle',
		type: 'Squad',
		matchType: 'Squad (4 Players)',
		map: 'Miramar',
		gameMode: 'Classic',
		perspective: 'TPP',
		status: 'Completed',
		entryFee: 200,
		prize: 5000,
		joined: 25,
		totalSlots: 25,
		startTime: new Date('2024-06-08T15:30:00Z'),
		duration: '35 minutes',
		rounds: 3,
		roomId: 'SQUAD001',
		roomPassword: 'squad123'
	},
	{
		name: 'BGMI Pro League',
		type: 'Squad',
		matchType: 'Squad (4 Players)',
		map: 'Sanhok',
		gameMode: 'Classic',
		perspective: 'FPP',
		status: 'Active',
		entryFee: 100,
		prize: 2000,
		joined: 20,
		totalSlots: 25,
		startTime: new Date('2024-06-12T20:00:00Z'),
		duration: '25 minutes',
		rounds: 5,
		roomId: 'PRO001',
		roomPassword: 'pro123'
	}
];

async function seedTournaments() {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Connected to MongoDB');

		// Clear existing tournaments
		await Tournament.deleteMany({});
		console.log('Cleared existing tournaments');

		// Insert sample tournaments
		const insertedTournaments = await Tournament.insertMany(sampleTournaments);
		console.log(`Inserted ${insertedTournaments.length} tournaments`);

		// Display inserted tournaments
		insertedTournaments.forEach(tournament => {
			console.log(`- ${tournament.name} (${tournament.type})`);
		});

		console.log('Tournament seeding completed successfully!');
	} catch (error) {
		console.error('Error seeding tournaments:', error);
	} finally {
		await mongoose.disconnect();
		console.log('Disconnected from MongoDB');
	}
}

// Run the seeding function
seedTournaments();
