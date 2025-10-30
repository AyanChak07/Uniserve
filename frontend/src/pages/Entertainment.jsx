import { useState, useRef, useEffect } from 'react';
import { Film, Clock, Star, Trophy, Laugh, Music, Theater, CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

const API_BASE_URL = import.meta.env.VITE_API_URL + "/entertainment";

const screenSeatCategories = {
  economy: { price: 150, color: 'bg-green-500', rows: [0, 1] },
  silver: { price: 200, color: 'bg-blue-500', rows: [2, 3, 4] },
  platinum: { price: 300, color: 'bg-purple-500', rows: [5, 6, 7] }
};

const stadiumSeatCategories = {
  vip: { price: 500, color: 'bg-purple-600' },
  premium: { price: 350, color: 'bg-blue-500' },
  standard: { price: 200, color: 'bg-green-500' }
};

const getSeatCategory = (row) => {
  if (screenSeatCategories.economy.rows.includes(row)) return 'economy';
  if (screenSeatCategories.silver.rows.includes(row)) return 'silver';
  if (screenSeatCategories.platinum.rows.includes(row)) return 'platinum';
  return 'economy';
};

const categories = [
  { name: 'All', icon: <Film className="w-5 h-5" /> },
  { name: 'Movies', icon: <Film className="w-5 h-5" /> },
  { name: 'Sports', icon: <Trophy className="w-5 h-5" /> },
  { name: 'Comedy', icon: <Laugh className="w-5 h-5" /> },
  { name: 'Concerts', icon: <Music className="w-5 h-5" /> },
  { name: 'Theater', icon: <Theater className="w-5 h-5" /> }
];

const dates = ['Oct 29', 'Oct 30', 'Oct 31', 'Nov 1', 'Nov 2'];

const events = [
  // MOVIES
  {
    id: 1,
    title: 'Inception',
    category: 'Movies',
    genre: 'Sci-Fi, Thriller',
    rating: 8.8,
    duration: '2h 28min',
    language: 'English',
    image: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
    showTimes: ['1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 2,
    title: 'The Dark Knight',
    category: 'Movies',
    genre: 'Action, Crime',
    rating: 9.0,
    duration: '2h 32min',
    language: 'English',
    image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
    showTimes: ['2:00 PM', '5:00 PM', '8:00 PM', '11:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 3,
    title: 'Interstellar',
    category: 'Movies',
    genre: 'Sci-Fi, Drama',
    rating: 8.6,
    duration: '2h 49min',
    language: 'English',
    image: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg',
    showTimes: ['12:30 PM', '4:30 PM', '7:30 PM', '10:30 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 24,
    title: 'Avengers: Endgame',
    category: 'Movies',
    genre: 'Action, Superhero',
    rating: 8.4,
    duration: '3h 01min',
    language: 'English',
    image: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg',
    showTimes: ['11:00 AM', '3:00 PM', '6:30 PM', '10:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 25,
    title: 'Jawan',
    category: 'Movies',
    genre: 'Action, Thriller',
    rating: 7.9,
    duration: '2h 49min',
    language: 'Hindi',
    image: 'https://i.pinimg.com/736x/c4/d9/cc/c4d9cc183a95adc597947342c2bc6b31.jpg',
    showTimes: ['12:00 PM', '3:30 PM', '7:00 PM', '10:30 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 26,
    title: 'The Shawshank Redemption',
    category: 'Movies',
    genre: 'Drama',
    rating: 9.3,
    duration: '2h 22min',
    language: 'English',
    image: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg',
    showTimes: ['1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 27,
    title: 'Pathaan',
    category: 'Movies',
    genre: 'Action, Spy',
    rating: 8.1,
    duration: '2h 26min',
    language: 'Hindi',
    image: 'https://i.pinimg.com/736x/4d/47/3d/4d473d1edded9306190ec66c0c1c4628.jpg',
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 28,
    title: 'The Godfather',
    category: 'Movies',
    genre: 'Crime, Drama',
    rating: 9.2,
    duration: '2h 55min',
    language: 'English',
    image: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
    showTimes: ['2:00 PM', '6:00 PM', '9:30 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 29,
    title: 'Pulp Fiction',
    category: 'Movies',
    genre: 'Crime, Drama',
    rating: 8.9,
    duration: '2h 34min',
    language: 'English',
    image: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
    showTimes: ['1:30 PM', '5:00 PM', '8:30 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 30,
    title: '3 Idiots',
    category: 'Movies',
    genre: 'Comedy, Drama',
    rating: 8.4,
    duration: '2h 50min',
    language: 'Hindi',
    image: 'https://m.media-amazon.com/images/M/MV5BNTkyOGVjMGEtNmQzZi00NzFlLTlhOWQtODYyMDc2ZGJmYzFhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg',
    showTimes: ['12:00 PM', '3:30 PM', '7:00 PM', '10:30 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 31,
    title: 'Oppenheimer',
    category: 'Movies',
    genre: 'Biography, Drama',
    rating: 8.7,
    duration: '3h 00min',
    language: 'English',
    image: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_FMjpg_UX1000_.jpg',
    showTimes: ['11:00 AM', '3:00 PM', '7:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },

  // SPORTS
  {
    id: 4,
    title: 'IPL 2025 Final',
    category: 'Sports',
    genre: 'Cricket',
    rating: 9.2,
    duration: '4h 00min',
    language: 'Hindi/English',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    showTimes: ['3:00 PM', '7:30 PM'],
    ticketTypes: [
      { type: "vip", price: 500, available: 50 },
      { type: "premium", price: 350, available: 100 },
      { type: "standard", price: 200, available: 200 }
    ]
  },
  {
    id: 5,
    title: 'India vs Australia ODI',
    category: 'Sports',
    genre: 'Cricket',
    rating: 8.9,
    duration: '5h 00min',
    language: 'Hindi/English',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    showTimes: ['2:00 PM'],
    ticketTypes: [
      { type: "vip", price: 500, available: 50 },
      { type: "premium", price: 350, available: 100 },
      { type: "standard", price: 200, available: 200 }
    ]
  },
  {
    id: 6,
    title: 'Premier League: Arsenal vs Chelsea',
    category: 'Sports',
    genre: 'Football',
    rating: 8.7,
    duration: '2h 00min',
    language: 'English',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    showTimes: ['10:00 PM'],
    ticketTypes: [
      { type: "vip", price: 500, available: 50 },
      { type: "premium", price: 350, available: 100 },
      { type: "standard", price: 200, available: 200 }
    ]
  },
  {
    id: 7,
    title: 'NBA Finals Live Screening',
    category: 'Sports',
    genre: 'Basketball',
    rating: 8.5,
    duration: '3h 00min',
    language: 'English',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    showTimes: ['6:30 AM', '9:00 AM'],
    ticketTypes: [
      { type: "vip", price: 500, available: 50 },
      { type: "premium", price: 350, available: 100 },
      { type: "standard", price: 200, available: 200 }
    ]
  },
  {
    id: 8,
    title: 'UFC Fight Night',
    category: 'Sports',
    genre: 'Mixed Martial Arts',
    rating: 8.8,
    duration: '4h 00min',
    language: 'English',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80',
    showTimes: ['8:00 PM'],
    ticketTypes: [
      { type: "vip", price: 500, available: 50 },
      { type: "premium", price: 350, available: 100 },
      { type: "standard", price: 200, available: 200 }
    ]
  },

  // COMEDY
  {
    id: 9,
    title: 'Stand-Up Comedy Night',
    category: 'Comedy',
    genre: 'Live Comedy',
    rating: 8.5,
    duration: '2h 00min',
    language: 'Hindi',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    showTimes: ['6:00 PM', '9:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 10,
    title: 'Kapil Sharma Live',
    category: 'Comedy',
    genre: 'Stand-Up Comedy',
    rating: 8.9,
    duration: '2h 30min',
    language: 'Hindi',
    image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&q=80',
    showTimes: ['7:00 PM', '10:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 11,
    title: 'Comedy Circus Reunion',
    category: 'Comedy',
    genre: 'Comedy Show',
    rating: 8.4,
    duration: '2h 15min',
    language: 'Hindi',
    image: 'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=800&q=80',
    showTimes: ['6:30 PM', '9:30 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 12,
    title: 'Open Mic Comedy Night',
    category: 'Comedy',
    genre: 'Stand-Up',
    rating: 8.2,
    duration: '1h 30min',
    language: 'English/Hindi',
    image: 'https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=800&q=80',
    showTimes: ['8:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 13,
    title: 'Improv Comedy Show',
    category: 'Comedy',
    genre: 'Improv',
    rating: 8.6,
    duration: '2h 00min',
    language: 'English',
    image: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=800&q=80',
    showTimes: ['7:00 PM', '9:30 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },

  // CONCERTS
  {
    id: 14,
    title: 'Rock Band Live Concert',
    category: 'Concerts',
    genre: 'Rock Music',
    rating: 8.9,
    duration: '3h 00min',
    language: 'English',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    showTimes: ['7:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 15,
    title: 'AR Rahman Live in Concert',
    category: 'Concerts',
    genre: 'Bollywood Music',
    rating: 9.3,
    duration: '3h 30min',
    language: 'Hindi',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    showTimes: ['6:30 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 16,
    title: 'EDM Night Festival',
    category: 'Concerts',
    genre: 'Electronic Dance',
    rating: 8.7,
    duration: '4h 00min',
    language: 'Instrumental',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    showTimes: ['8:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 17,
    title: 'Classical Music Evening',
    category: 'Concerts',
    genre: 'Classical',
    rating: 8.8,
    duration: '2h 30min',
    language: 'Instrumental',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80',
    showTimes: ['6:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 18,
    title: 'Jazz Night Live',
    category: 'Concerts',
    genre: 'Jazz',
    rating: 8.5,
    duration: '2h 00min',
    language: 'Instrumental',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80',
    showTimes: ['7:30 PM', '10:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },

  // THEATER
  {
    id: 19,
    title: 'Shakespeare Festival',
    category: 'Theater',
    genre: 'Drama',
    rating: 8.4,
    duration: '2h 30min',
    language: 'English',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    showTimes: ['5:00 PM', '8:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 20,
    title: 'The Phantom of the Opera',
    category: 'Theater',
    genre: 'Musical',
    rating: 9.1,
    duration: '2h 45min',
    language: 'English',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    showTimes: ['3:00 PM', '7:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 21,
    title: 'Mughal-e-Azam Musical',
    category: 'Theater',
    genre: 'Musical Drama',
    rating: 8.9,
    duration: '3h 00min',
    language: 'Hindi',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5xeLCLjacys110u-PjR9ghsrKRTwfyhGq9w&s',
    showTimes: ['6:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 22,
    title: 'Modern Dance Theatre',
    category: 'Theater',
    genre: 'Contemporary Dance',
    rating: 8.6,
    duration: '1h 45min',
    language: 'Non-verbal',
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&q=80',
    showTimes: ['5:30 PM', '8:30 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  },
  {
    id: 23,
    title: 'Comedy Play: The Proposal',
    category: 'Theater',
    genre: 'Comedy Drama',
    rating: 8.3,
    duration: '2h 00min',
    language: 'English',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80',
    showTimes: ['6:00 PM', '9:00 PM'],
    ticketTypes: [
      { type: "economy", price: 150, available: 100 },
      { type: "silver", price: 200, available: 60 },
      { type: "platinum", price: 300, available: 40 }
    ]
  }
];


function generateStadiumSeats() {
  const seats = [];
  for (let row = 0; row < 4; row++) {
    const category = row < 2 ? 'vip' : 'premium';
    for (let col = 0; col < 15; col++) {
      seats.push({
        id: `north-${row}-${col}`,
        section: 'north',
        row,
        col,
        category,
        isBooked: Math.random() > 0.75,
      });
    }
  }
  for (let row = 0; row < 4; row++) {
    const category = row < 2 ? 'vip' : 'premium';
    for (let col = 0; col < 15; col++) {
      seats.push({
        id: `south-${row}-${col}`,
        section: 'south',
        row,
        col,
        category,
        isBooked: Math.random() > 0.75,
      });
    }
  }
  for (let row = 0; row < 4; row++) {
    const category = row < 2 ? 'premium' : 'standard';
    for (let col = 0; col < 10; col++) {
      seats.push({
        id: `east-${row}-${col}`,
        section: 'east',
        row,
        col,
        category,
        isBooked: Math.random() > 0.75,
      });
    }
  }
  for (let row = 0; row < 4; row++) {
    const category = row < 2 ? 'premium' : 'standard';
    for (let col = 0; col < 10; col++) {
      seats.push({
        id: `west-${row}-${col}`,
        section: 'west',
        row,
        col,
        category,
        isBooked: Math.random() > 0.75,
      });
    }
  }
  return seats;
}

function generateScreenSeats() {
  const seats = [];
  const rows = 8;
  const seatsPerRow = 10;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < seatsPerRow; col++) {
      const seatId = `${row}-${col}`;
      const category = getSeatCategory(row);
      seats.push({
        id: seatId,
        row,
        col,
        category,
        isBooked: Math.random() > 0.7,
      });
    }
  }
  return seats;
}

const Entertainment = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState('Oct 30');
  const [selectedTime, setSelectedTime] = useState('7:00 PM');
  const [bookingStep, setBookingStep] = useState('main');
  const [payMethod, setPayMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [toast, setToast] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef(null);
  const { width, height } = useWindowSize();

  const [screenSeats] = useState(generateScreenSeats());
  const [stadiumSeats] = useState(generateStadiumSeats());

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(event => event.category === selectedCategory);

  const isStadiumView = selectedMovie && selectedMovie.category === 'Sports';
  const seats = isStadiumView ? stadiumSeats : screenSeats;
  const seatCategories = isStadiumView ? stadiumSeatCategories : screenSeatCategories;

  const toggleSeat = (seatId, isBooked) => {
    if (isBooked) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const calculateTotal = () => selectedSeats.reduce((total, seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return total + seatCategories[seat.category].price;
  }, 0);

  const getSeatColor = (seat) => {
    if (seat.isBooked) return 'bg-gray-400 cursor-not-allowed';
    if (selectedSeats.includes(seat.id)) return 'bg-yellow-400';
    return seatCategories[seat.category].color;
  };

  const selectedSeatLabels = selectedSeats.map(seatId => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return '';
    if (isStadiumView) return `${seat.section[0].toUpperCase()}${seat.row + 1}-${seat.col + 1}`;
    return `${String.fromCharCode(65 + seat.row)}${seat.col + 1}`;
  }).sort().join(', ');

  const handleBooking = () => {
    if (!selectedSeats.length) return;
    setBookingStep("payment");
  };

async function finishPayment() {
  setLoading(true);
  try {
    const eventInfo = {
      title: selectedMovie.title,
      category: selectedMovie.category,
      date: selectedDate,
      time: selectedTime,
      ticketTypes: selectedMovie.ticketTypes || [],
      image: selectedMovie.image,
    };

    if (isStadiumView) {
      const seatsByCategory = selectedSeats.reduce((acc, seatId) => {
        const seat = seats.find(s => s.id === seatId);
        if (!seat) return acc;
        if (!acc[seat.category]) acc[seat.category] = [];
        acc[seat.category].push(seatId);
        return acc;
      }, {});

      for (const [ticketType, seatIds] of Object.entries(seatsByCategory)) {
        const quantity = seatIds.length;

        const res = await fetch(`${API_BASE_URL}/tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            eventInfo,
            ticketType,
            quantity,
          }),
        });

        const resJson = await res.json();
        if (!res.ok) throw new Error(resJson.message || "Failed to book ticket.");

        const newBooking = resJson.data;

        await fetch(`${API_BASE_URL}/tickets/${newBooking._id}/payment`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({ paymentId: `pay_${Date.now()}`, paymentStatus: "completed" }),
        });
      }
    } else {
      const ticketType = [...new Set(selectedSeats.map(seatId => seats.find(s => s.id === seatId).category))][0];

      const res = await fetch(`${API_BASE_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          eventInfo,
          ticketType,
          quantity: selectedSeats.length,
        }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message || "Failed to book ticket.");

      const newBooking = resJson.data;

      await fetch(`${API_BASE_URL}/tickets/${newBooking._id}/payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ paymentId: `pay_${Date.now()}`, paymentStatus: "completed" }),
      });
    }

    // Payment successful - update all states at once
    setLoading(false);
    
    const bookingData = {
      event: selectedMovie,
      selectedSeats: selectedSeatLabels,
      selectedDate,
      selectedTime,
      total: calculateTotal(),
    };
    
    // Set all states together to prevent multiple re-renders
    setLastBooking(bookingData);
    setBookingStep("success");
    setShowConfetti(true);
    setToast({
      msg: `🎫 Booking confirmed for ${selectedMovie.title}.`,
    });
    
    // Play sound
    if (audioRef.current) audioRef.current.play();
    
    // Hide toast and confetti after 3.5 seconds (popup stays)
    setTimeout(() => {
      setToast(null);
      setShowConfetti(false);
    }, 3500);
    
  } catch (error) {
    setLoading(false);
    setToast({ msg: "Booking failed: " + error.message, error: true });
    setTimeout(() => setToast(null), 3000);
  }
}




  useEffect(() => {
    if (toast && toast.bookingId && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [toast]);

  const PaymentDrawer = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto rounded-l-3xl shadow-xl p-8 flex flex-col relative">
        <button onClick={() => setBookingStep("main")}
          className="absolute top-5 right-5 text-gray-500 text-2xl hover:text-gray-900 font-bold">×</button>
        <h2 className="text-2xl font-bold mb-6">Payment for {selectedMovie.title}</h2>
        <div className="mb-3">
          <div className="flex items-center mb-3">
            <img src={selectedMovie.image} alt={selectedMovie.title} className="w-16 h-20 rounded-xl object-cover shadow" />
            <div className="ml-4">
              <div className="font-bold">{selectedMovie.title}</div>
              <div className="text-sm text-gray-500">{selectedDate} • {selectedTime}</div>
            </div>
          </div>
          <div className="text-xs text-gray-600 mb-2">Seats: {selectedSeats.length} ({selectedSeatLabels})</div>
          <div className="font-bold text-lg mb-4">Total: ₹{calculateTotal()}</div>
        </div>
        <h4 className="font-bold mb-3">Choose Payment Method</h4>
        <div className="flex flex-col gap-2 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="payMethod" checked={payMethod==="upi"} onChange={()=>setPayMethod("upi")} className="accent-blue-500" />
            <span>UPI / Online</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="payMethod" checked={payMethod==="cod"} onChange={()=>setPayMethod("cod")} className="accent-blue-500" />
            <span>Pay at Venue</span>
          </label>
        </div>
        <button
          disabled={loading}
          onClick={finishPayment}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow mb-3"
        >
          {loading ? "Processing..." : `Pay ₹${calculateTotal()}`}
        </button>
        <button onClick={()=>setBookingStep("main")}
          className="w-full py-3 bg-gray-100 text-gray-700 mt-1 rounded-xl">Back</button>
      </div>
    </div>
  );

// TOAST - Shows briefly at top before popup
const Toast = () => toast ? (
  <div className="fixed top-4 left-0 right-0 flex justify-center z-[8000] animate-fade-in-down pointer-events-none px-4">
    <div className={`rounded-xl px-6 py-3 font-semibold max-w-md w-full shadow-2xl text-sm backdrop-blur-sm
      ${toast.error ? 'bg-red-600 text-white' : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'}`}>
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1">{toast.msg}</span>
      </div>
    </div>
  </div>
) : null;

// BOOKING SUMMARY - Shows after toast, perfectly positioned
const BookingSummary = () => lastBooking ? (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto animate-scale-in">
      {/* Header - Won't get cut */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-5 text-center relative">
        <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle className="text-white w-9 h-9" strokeWidth={3} />
        </div>
        <h2 className="text-xl font-bold text-white leading-tight">Booking Confirmed!</h2>
        <p className="text-blue-100 text-xs mt-1">Your tickets are ready 🎉</p>
      </div>

      {/* Compact Content */}
      <div className="p-5">
        {/* Event Info */}
        <div className="flex gap-3 mb-4">
          <img 
            src={lastBooking.event.image} 
            alt={lastBooking.event.title} 
            className="w-20 h-28 object-cover rounded-lg shadow-md flex-shrink-0" 
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{lastBooking.event.title}</h3>
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{lastBooking.selectedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="font-medium">{lastBooking.selectedTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border-2 border-blue-100">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Seats</p>
              <p className="font-bold text-gray-900 text-sm">{lastBooking.selectedSeats}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Total Amount</p>
              <p className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ₹{lastBooking.total}
              </p>
            </div>
          </div>
          
          {/* Mini Barcode */}
          <div className="border-t border-dashed border-gray-300 pt-3">
            <div className="bg-white h-10 rounded flex items-center justify-center shadow-sm">
              <div className="flex gap-0.5">
                {[...Array(22)].map((_, i) => (
                  <div key={i} className="w-1 bg-gray-800 rounded" style={{ height: `${Math.random() * 25 + 10}px` }}></div>
                ))}
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">Scan at venue entrance</p>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-3 mb-4 text-center">
          <p className="text-green-800 font-semibold text-sm flex items-center justify-center gap-2">
            <span className="text-lg">🍿</span>
            Enjoy your show!
            <span className="text-lg">🎬</span>
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setLastBooking(null);
            setBookingStep("main");
            setSelectedSeats([]);
            setSelectedMovie(null);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  </div>
) : null;



  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {showConfetti && <Confetti width={width} height={height} recycle={false}/>}
        <audio ref={audioRef} src="https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg" preload="auto" style={{display:'none'}} />
        <Toast />
        {bookingStep === "success" && <BookingSummary />}
        {bookingStep === "payment" && <PaymentDrawer />}
        {!selectedMovie ? (
          <div>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Entertainment Hub</h1>
              <p className="text-lg text-gray-600">Book tickets for movies, sports, concerts, and more</p>
            </div>
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-400">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 border-2 border-transparent hover:border-blue-400"
                  onClick={() => setSelectedMovie(event)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        {event.category}
                      </span>
                      <span className="flex gap-1 items-center">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{event.rating}</span>
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.genre}</p>
                    <div className="flex justify-between text-gray-600 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Film className="w-4 h-4" />
                        <span>{event.language}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMovie(event)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all group-hover:shadow-lg"
                    >
                      Book Tickets
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No events found in this category</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setSelectedMovie(null);
                setSelectedSeats([]);
              }}
              className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Events
            </button>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedMovie.title}</h2>
                      <p className="text-gray-600">{selectedMovie.genre}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedMovie.category}
                    </span>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Date</label>
                    <div className="flex gap-3 overflow-x-auto">
                      {dates.map((date) => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                            selectedDate === date
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Show Time</label>
                    <div className="flex gap-3 flex-wrap">
                      {selectedMovie.showTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                            selectedTime === time
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Seat Categories</h3>
                    {isStadiumView ? (
                      <div className="flex gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-600 rounded"></div>
                          <span className="text-sm">VIP - ₹500</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 rounded"></div>
                          <span className="text-sm">Premium - ₹350</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 rounded"></div>
                          <span className="text-sm">Standard - ₹200</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                          <span className="text-sm">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-400 rounded"></div>
                          <span className="text-sm">Booked</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 rounded"></div>
                          <span className="text-sm">Economy - ₹150</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 rounded"></div>
                          <span className="text-sm">Silver - ₹200</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-500 rounded"></div>
                          <span className="text-sm">Platinum - ₹300</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                          <span className="text-sm">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-400 rounded"></div>
                          <span className="text-sm">Booked</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {isStadiumView ? (
                    <div className="py-8">
                      <div className="max-w-4xl mx-auto">
                        <div className="mb-4">
                          <p className="text-center font-bold text-gray-900 mb-2">NORTH STAND</p>
                            <div className="space-y-1">
                              {[0, 1, 2, 3].map(rowIdx => (
                                <div key={rowIdx} className="flex justify-center gap-1">
                                  {stadiumSeats.filter(s => s.section === 'north' && s.row === rowIdx).map(seat => (
                                    <button
                                      key={seat.id}
                                      onClick={() => toggleSeat(seat.id, seat.isBooked)}
                                      disabled={seat.isBooked}
                                      className={`w-7 h-7 rounded ${getSeatColor(seat)} transition-all hover:opacity-80 hover:scale-110`}
                                      title={`${seat.category.toUpperCase()} - ₹${seatCategories[seat.category].price}`}
                                    />
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-4 my-6">
                            <div className="flex flex-col items-center">
                              <p className="font-bold text-gray-900 mb-2 text-sm" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}>WEST</p>
                              <div className="space-y-1">
                                {[0, 1, 2, 3].map(rowIdx => (
                                  <div key={rowIdx} className="flex gap-1">
                                    {stadiumSeats.filter(s => s.section === 'west' && s.row === rowIdx).map(seat => (
                                      <button
                                        key={seat.id}
                                        onClick={() => toggleSeat(seat.id, seat.isBooked)}
                                        disabled={seat.isBooked}
                                        className={`w-7 h-7 rounded ${getSeatColor(seat)} transition-all hover:opacity-80 hover:scale-110`}
                                        title={`${seat.category.toUpperCase()} - ₹${seatCategories[seat.category].price}`}
                                      />
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="w-80 h-80 bg-gradient-to-br from-green-500 to-green-700 rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl">
                              <div className="text-center text-white">
                                <p className="text-6xl mb-3">🏟️</p>
                                <p className="font-bold text-2xl">PLAYING</p>
                                <p className="font-bold text-2xl">FIELD</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <p className="font-bold text-gray-900 mb-2 text-sm" style={{writingMode: 'vertical-rl'}}>EAST</p>
                              <div className="space-y-1">
                                {[0, 1, 2, 3].map(rowIdx => (
                                  <div key={rowIdx} className="flex gap-1">
                                    {stadiumSeats.filter(s => s.section === 'east' && s.row === rowIdx).map(seat => (
                                      <button
                                        key={seat.id}
                                        onClick={() => toggleSeat(seat.id, seat.isBooked)}
                                        disabled={seat.isBooked}
                                        className={`w-7 h-7 rounded ${getSeatColor(seat)} transition-all hover:opacity-80 hover:scale-110`}
                                        title={`${seat.category.toUpperCase()} - ₹${seatCategories[seat.category].price}`}
                                      />
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="space-y-1 mb-2">
                              {[0, 1, 2, 3].map(rowIdx => (
                                <div key={rowIdx} className="flex justify-center gap-1">
                                  {stadiumSeats.filter(s => s.section === 'south' && s.row === rowIdx).map(seat => (
                                    <button
                                      key={seat.id}
                                      onClick={() => toggleSeat(seat.id, seat.isBooked)}
                                      disabled={seat.isBooked}
                                      className={`w-7 h-7 rounded ${getSeatColor(seat)} transition-all hover:opacity-80 hover:scale-110`}
                                      title={`${seat.category.toUpperCase()} - ₹${seatCategories[seat.category].price}`}
                                    />
                                  ))}
                                </div>
                              ))}
                            </div>
                            <p className="text-center font-bold text-gray-900">SOUTH STAND</p>
                          </div>
                          <p className="text-center text-gray-600 text-sm mt-6">🏟️ Stadium View - Seats arranged around the playing field</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-8">
                        <div className="bg-gradient-to-r from-gray-400 to-gray-500 h-3 rounded-full mb-2 shadow"></div>
                        <p className="text-center text-sm text-gray-600 font-semibold">Screen</p>
                      </div>
                      <div className="overflow-x-auto">
                        <div className="inline-block min-w-full">
                          {Array.from({ length: 8 }).map((_, rowIndex) => (
                            <div key={rowIndex} className="flex gap-2 mb-2 justify-center">
                              <span className="w-8 text-center text-sm font-medium text-gray-600">
                                {String.fromCharCode(65 + rowIndex)}
                              </span>
                              {screenSeats
                                .filter(seat => seat.row === rowIndex)
                                .map((seat) => (
                                  <button
                                    key={seat.id}
                                    onClick={() => toggleSeat(seat.id, seat.isBooked)}
                                    disabled={seat.isBooked}
                                    className={`w-8 h-8 rounded-t-lg ${getSeatColor(seat)} transition-all hover:opacity-80 hover:scale-110`}
                                    title={`${seat.category.toUpperCase()} - ₹${seatCategories[seat.category].price}`}
                                  />
                                ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Event</span>
                      <span className="font-medium">{selectedMovie.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">{selectedMovie.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Seats</span>
                      <span className="font-medium">{selectedSeats.length}</span>
                    </div>
                  </div>
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">₹{calculateTotal()}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0}
                    className={`w-full font-semibold py-4 rounded-xl transition-all ${
                      selectedSeats.length > 0
                        ? 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {selectedSeats.length > 0 ? 'Confirm Booking' : 'Select Seats'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Entertainment;