const tournaments = [
  {
    id: 1,
    name: "Solo Tournament",
    type: "solo"
  },
  {
    id: 2,
    name: "Squad Tournament",
    type: "squad"
  }
];

export const tournamentDetails = [
  {
    id: 1,
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
    startTime: '2024-06-10T18:00:00Z',
    duration: '30 minutes',
    rounds: 4
  },
  {
    id: 2,
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
    startTime: '2024-06-08T15:30:00Z',
    duration: '35 minutes',
    rounds: 3
  },
  {
    id: 3,
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
    startTime: '2024-06-12T20:00:00Z',
    duration: '25 minutes',
    rounds: 5
  }
];

export default tournaments; 