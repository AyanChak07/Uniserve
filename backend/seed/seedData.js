const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('../models/Vehicle');
const Restaurant = require('../models/Restaurant');
const Event = require('../models/Event');

dotenv.config();

// Add this VEHICLES ARRAY to seedData.js
const vehicles = [
  // Bikes (3)
  {
    type: 'bike',
    model: 'Honda Activa 6G',
    licensePlate: 'MH01AB1234',
    driver: { name: 'Rajesh Kumar', phone: '9876543210', rating: 4.7 },
    location: { type: 'Point', coordinates: [72.8777, 19.0760] },
    available: true,
    pricePerKm: 8,
    capacity: 1,
    image: 'https://images.unsplash.com/photo-1558981033-6f4d0d0b0c3f?w=400'
  },
  {
    type: 'bike',
    model: 'TVS Jupiter',
    licensePlate: 'MH02XY5678',
    driver: { name: 'Vikram Singh', phone: '9876543211', rating: 4.5 },
    location: { type: 'Point', coordinates: [72.8850, 19.0820] },
    available: true,
    pricePerKm: 7,
    capacity: 1,
    image: 'https://images.unsplash.com/photo-1558981033-6f4d0d0b0c3f?w=400'
  },
  {
    type: 'bike',
    model: 'Suzuki Access 125',
    licensePlate: 'MH12CD9012',
    driver: { name: 'Amit Sharma', phone: '9876543212', rating: 4.8 },
    location: { type: 'Point', coordinates: [72.8700, 19.0700] },
    available: true,
    pricePerKm: 8,
    capacity: 1,
    image: 'https://images.unsplash.com/photo-1558981033-6f4d0d0b0c3f?w=400'
  },

  // Cars (5)
  {
    type: 'car',
    model: 'Maruti Swift',
    licensePlate: 'MH03EF3456',
    driver: { name: 'Priya Patel', phone: '9876543213', rating: 4.6 },
    location: { type: 'Point', coordinates: [72.8800, 19.0800] },
    available: true,
    pricePerKm: 12,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'
  },
  {
    type: 'car',
    model: 'Hyundai i20',
    licensePlate: 'MH14GH7890',
    driver: { name: 'Sneha Desai', phone: '9876543214', rating: 4.7 },
    location: { type: 'Point', coordinates: [72.8750, 19.0750] },
    available: true,
    pricePerKm: 13,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'
  },
  {
    type: 'car',
    model: 'Honda City',
    licensePlate: 'MH05IJ1234',
    driver: { name: 'Rahul Verma', phone: '9876543215', rating: 4.8 },
    location: { type: 'Point', coordinates: [72.8900, 19.0900] },
    available: true,
    pricePerKm: 14,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'
  },
  {
    type: 'car',
    model: 'Tata Nexon',
    licensePlate: 'MH06KL5678',
    driver: { name: 'Pooja Mehta', phone: '9876543216', rating: 4.5 },
    location: { type: 'Point', coordinates: [72.8650, 19.0650] },
    available: true,
    pricePerKm: 13,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'
  },
  {
    type: 'car',
    model: 'Volkswagen Polo',
    licensePlate: 'MH07MN9012',
    driver: { name: 'Arjun Reddy', phone: '9876543217', rating: 4.9 },
    location: { type: 'Point', coordinates: [72.8600, 19.0600] },
    available: true,
    pricePerKm: 15,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'
  },

  // SUVs (7)
  {
    type: 'suv',
    model: 'Toyota Innova Crysta',
    licensePlate: 'MH08OP3456',
    driver: { name: 'Karan Singh', phone: '9876543218', rating: 4.8 },
    location: { type: 'Point', coordinates: [72.8950, 19.0950] },
    available: true,
    pricePerKm: 18,
    capacity: 7,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'
  },
  {
    type: 'suv',
    model: 'Mahindra XUV700',
    licensePlate: 'MH09QR7890',
    driver: { name: 'Neha Kapoor', phone: '9876543219', rating: 4.7 },
    location: { type: 'Point', coordinates: [72.8550, 19.0550] },
    available: true,
    pricePerKm: 17,
    capacity: 7,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'
  },
  {
    type: 'suv',
    model: 'Hyundai Creta',
    licensePlate: 'MH10ST1234',
    driver: { name: 'Sanjay Gupta', phone: '9876543220', rating: 4.6 },
    location: { type: 'Point', coordinates: [72.8500, 19.0500] },
    available: true,
    pricePerKm: 16,
    capacity: 5,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'
  },
  {
    type: 'suv',
    model: 'Kia Seltos',
    licensePlate: 'MH11UV5678',
    driver: { name: 'Anjali Rao', phone: '9876543221', rating: 4.9 },
    location: { type: 'Point', coordinates: [72.8450, 19.0450] },
    available: true,
    pricePerKm: 16,
    capacity: 5,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'
  },
  {
    type: 'suv',
    model: 'MG Hector',
    licensePlate: 'MH13WX9012',
    driver: { name: 'Rohit Sharma', phone: '9876543222', rating: 4.8 },
    location: { type: 'Point', coordinates: [72.8400, 19.0400] },
    available: true,
    pricePerKm: 17,
    capacity: 5,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'
  },
  {
    type: 'suv',
    model: 'Ford Endeavour',
    licensePlate: 'MH15YZ3456',
    driver: { name: 'Deepak Kumar', phone: '9876543223', rating: 4.7 },
    location: { type: 'Point', coordinates: [72.8350, 19.0350] },
    available: true,
    pricePerKm: 20,
    capacity: 7,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'
  },
  {
    type: 'suv',
    model: 'Tata Safari',
    licensePlate: 'MH16AB7890',
    driver: { name: 'Kavita Nair', phone: '9876543224', rating: 4.6 },
    location: { type: 'Point', coordinates: [72.8300, 19.0300] },
    available: true,
    pricePerKm: 18,
    capacity: 7,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'
  }
];


// 25 Restaurants with diverse cuisines
const restaurants = [
  {
    name: 'Spice Paradise',
    description: 'Authentic North Indian cuisine with a modern twist',
    cuisine: ['Indian', 'North Indian', 'Mughlai'],
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760],
      address: '123 MG Road, Fort, Mumbai'
    },
    rating: 4.5,
    deliveryTime: '30-40 mins',
    minOrder: 200,
    deliveryFee: 40,
    menu: [
      { name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken', price: 250, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
      { name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese in rich gravy', price: 180, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400' },
      { name: 'Dal Makhani', description: 'Creamy black lentils cooked overnight', price: 140, category: 'main', vegetarian: true, image: 'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { name: 'Garlic Naan', description: 'Fresh baked bread with garlic', price: 50, category: 'appetizer', vegetarian: true, image: 'https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg' },
      { name: 'Chicken Biryani', description: 'Aromatic basmati rice with spiced chicken', price: 240, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
      { name: 'Gulab Jamun', description: 'Sweet milk dumplings in sugar syrup', price: 20, category: 'dessert', vegetarian: true, image: 'https://images.pexels.com/photos/15014919/pexels-photo-15014919.jpeg'},
    ],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    openingHours: '11:00 AM - 11:00 PM',
    isOpen: true
  },
  {
    name: 'Pizza Hub',
    description: 'Wood-fired pizzas and Italian delights',
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    location: {
      type: 'Point',
      coordinates: [72.8850, 19.0820],
      address: '456 Park Street, Bandra, Mumbai'
    },
    rating: 4.3,
    deliveryTime: '25-35 mins',
    minOrder: 300,
    deliveryFee: 50,
    menu: [
      { name: 'Margherita Pizza', description: 'Classic pizza with mozzarella and basil', price: 400, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
      { name: 'Pepperoni Pizza', description: 'Loaded with pepperoni and cheese', price: 500, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
      { name: 'Veggie Supreme Pizza',description: 'Loaded with fresh vegetables and mozzarella',price: 450,category: 'main',vegetarian: true,image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400'},
      { name: 'BBQ Chicken Pizza',description: 'Smoky BBQ sauce with grilled chicken',price: 520,category: 'main',vegetarian: false, image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=400',},
      { name: 'Pasta Alfredo', description: 'Creamy white sauce pasta', price: 350, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400' },
      { name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 150, category: 'dessert', vegetarian: true, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    openingHours: '12:00 PM - 11:30 PM',
    isOpen: true
  },
  {
    name: 'Sushi Express',
    description: 'Fresh Japanese cuisine and authentic sushi',
    cuisine: ['Japanese', 'Sushi', 'Asian'],
    location: {
      type: 'Point',
      coordinates: [72.8700, 19.0700],
      address: '789 Marine Drive, Mumbai'
    },
    rating: 4.7,
    deliveryTime: '35-45 mins',
    minOrder: 500,
    deliveryFee: 60,
    menu: [
      { name: 'California Roll', description: 'Crab, avocado, and cucumber roll', price: 350, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
      { name: 'Vegetable Tempura', description: 'Crispy fried vegetables', price: 280, category: 'appetizer', vegetarian: true, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400' },
      { name: 'Spicy Tuna Roll',description: 'Fresh tuna with spicy mayo',price: 380,category: 'main',vegetarian: false,image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400'},
      { name: 'Vegetable Gyoza',description: 'Pan-fried Japanese dumplings',price: 220,category: 'appetizer',vegetarian: true,image: 'https://images.pexels.com/photos/34287152/pexels-photo-34287152.jpeg'},
      { name: 'Salmon Nigiri', description: 'Fresh salmon on rice', price: 450, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
      { name: 'Miso Soup', description: 'Traditional Japanese soup', price: 110, category: 'appetizer', vegetarian: true, image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    openingHours: '12:00 PM - 10:00 PM',
    isOpen: true
  },
  {
    name: 'Burger Bliss',
    description: 'Gourmet burgers and loaded fries',
    cuisine: ['American', 'Burgers', 'Fast Food'],
    location: {
      type: 'Point',
      coordinates: [72.8600, 19.0600],
      address: '321 Linking Road, Bandra, Mumbai'
    },
    rating: 4.4,
    deliveryTime: '20-30 mins',
    minOrder: 250,
    deliveryFee: 40,
    menu: [
      { name: 'Veggie Burger', description: 'Plant-based patty with fresh veggies', price: 220, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400' },
      {name: 'Chicken Burger',description: 'Crispy fried chicken with special sauce',price: 300,category: 'main',vegetarian: false,image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400'},
      { name: 'Mushroom Swiss Burger',description: 'Sautéed mushrooms with Swiss cheese',price: 280,category: 'main',vegetarian: true,image: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { name: 'Paneer Tikka Burger',description: 'Grilled spiced paneer with mint chutney',price: 250,category: 'main',vegetarian: true,image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400'},
      { name: 'Loaded Cheese Fries', description: 'Crispy fries with cheese sauce', price: 180, category: 'appetizer', vegetarian: true, image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { name: 'Chocolate Shake', description: 'Rich and creamy chocolate milkshake', price: 150, category: 'beverage', vegetarian: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
    openingHours: '11:00 AM - 12:00 AM',
    isOpen: true
  },
  {
    name: 'Tandoor Nights',
    description: 'Authentic tandoori specialties and kebabs',
    cuisine: ['Indian', 'Tandoori', 'BBQ'],
    location: {
      type: 'Point',
      coordinates: [72.8900, 19.0900],
      address: '567 SV Road, Andheri, Mumbai'
    },
    rating: 4.6,
    deliveryTime: '35-45 mins',
    minOrder: 300,
    deliveryFee: 50,
    menu: [
      { name: 'Tandoori Chicken', description: 'Half chicken marinated in spices', price: 370, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' },
      { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 270, category: 'appetizer', vegetarian: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400' },
      { name: 'Seekh Kebab', description: 'Minced meat skewers', price: 320, category: 'appetizer', vegetarian: false, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400' },
      { name: 'Chicken Malai Tikka',description: 'Creamy marinated chicken tikka',price: 350,category: 'main',vegetarian: false,image: 'https://images.pexels.com/photos/6210876/pexels-photo-6210876.jpeg?auto=compress&cs=tinysrgb&w=400'},
      { name: 'Tandoori Fish',description: 'Pomfret marinated in tandoori spices',price: 450,category: 'main',vegetarian: false,image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=400'},
      { name: 'Mushroom Tikka',description: 'Tandoor-grilled mushrooms',price: 280,category: 'appetizer',vegetarian: true,image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',}
    ],
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    openingHours: '6:00 PM - 12:00 AM',
    isOpen: true
  },
  {
    name: 'Dragon Wok',
    description: 'Authentic Chinese cuisine with a spicy twist',
    cuisine: ['Chinese', 'Asian', 'Indo-Chinese'],
    location: {
      type: 'Point',
      coordinates: [72.8750, 19.0750],
      address: '234 Hill Road, Bandra, Mumbai'
    },
    rating: 4.5,
    deliveryTime: '30-40 mins',
    minOrder: 280,
    deliveryFee: 45,
    menu: [
      { name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables', price: 180, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
      { name: 'Chilli Chicken', description: 'Spicy chicken in Indo-Chinese sauce', price: 280, category: 'main', vegetarian: false, image: 'https://images.pexels.com/photos/28674534/pexels-photo-28674534.jpeg' },
      { name: 'Veg Manchurian', description: 'Fried vegetable balls in tangy sauce', price: 220, category: 'appetizer', vegetarian: true, image: 'https://images.pexels.com/photos/29631489/pexels-photo-29631489.jpeg' },
      { name: 'Mixed Fried Rice', description: 'Egg fried rice with vegetables', price: 220, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
      { name: 'Schezwan Noodles',description: 'Spicy stir-fried noodles with vegetables',price: 210,category: 'main',vegetarian: true,image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=400'},
      { name: 'Spring Rolls',description: 'Crispy vegetable spring rolls',price: 180,category: 'appetizer',vegetarian: true,image: 'https://images.pexels.com/photos/4985525/pexels-photo-4985525.jpeg', }
    ],
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800',
    openingHours: '12:00 PM - 11:00 PM',
    isOpen: true
  },
  {
    name: 'Pasta Palace',
    description: 'Italian pasta and risotto specialists',
    cuisine: ['Italian', 'Pasta', 'Mediterranean'],
    location: {
      type: 'Point',
      coordinates: [72.8650, 19.0650],
      address: '890 Carter Road, Bandra, Mumbai'
    },
    rating: 4.6,
    deliveryTime: '30-40 mins',
    minOrder: 350,
    deliveryFee: 50,
    menu: [
      { name: 'Penne Arrabbiata', description: 'Spicy tomato sauce pasta', price: 270, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400' },
      { name: 'Carbonara', description: 'Creamy pasta with bacon', price: 320, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400' },
      { name: 'Chicken Quesadilla',description: 'Grilled tortilla with chicken and cheese',price: 300,category: 'main',vegetarian: false,image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=400',},
      { name: 'Guacamole & Chips',description: 'Fresh avocado dip with tortilla chips',price: 180,category: 'appetizer',vegetarian: true,image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',},
      { name: 'Mexican Rice Bowl',description: 'Spiced rice with beans and salsa',price: 250,category: 'main',vegetarian: true,image: 'https://images.pexels.com/photos/14302291/pexels-photo-14302291.jpeg'},
      { name: 'Bruschetta', description: 'Toasted bread with tomato topping', price: 140, category: 'appetizer', vegetarian: true, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400' },
      
    ],
    image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=800',
    openingHours: '12:00 PM - 10:30 PM',
    isOpen: true
  },
  {
    name: 'Taco Fiesta',
    description: 'Authentic Mexican street food',
    cuisine: ['Mexican', 'Latin American', 'Tex-Mex'],
    location: {
      type: 'Point',
      coordinates: [72.8800, 19.0800],
      address: '456 Juhu Beach Road, Mumbai'
    },
    rating: 4.4,
    deliveryTime: '25-35 mins',
    minOrder: 300,
    deliveryFee: 45,
    menu: [
      { name: 'Chicken Tacos', description: 'Soft tacos with grilled chicken', price: 280, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' },
      { name: 'Veggie Burrito', description: 'Large wrap with beans and vegetables', price: 250, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
      { name: 'Veggie Tacos',description: 'Grilled vegetables with lime and cilantro',price: 230,category: 'main',vegetarian: true,image: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { name: 'Mexican Salsa Platter',description: 'Three types of salsa with tortilla chips',price: 160,category: 'appetizer',vegetarian: true,image: 'https://images.pexels.com/photos/2741448/pexels-photo-2741448.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { name: 'Chicken Enchiladas',description: 'Rolled tortillas with chicken and cheese sauce',price: 300,category: 'main',vegetarian: false,image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400', },
      { name: 'Nachos Supreme', description: 'Tortilla chips with cheese and salsa', price: 240, category: 'appetizer', vegetarian: true, image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    openingHours: '11:00 AM - 11:00 PM',
    isOpen: true
  },
  {
    name: 'Biryani House',
    description: 'Hyderabadi biryani and Mughlai delicacies',
    cuisine: ['Indian', 'Hyderabadi', 'Biryani'],
    location: {
      type: 'Point',
      coordinates: [72.8550, 19.0550],
      address: '123 Mohammed Ali Road, Mumbai'
    },
    rating: 4.8,
    deliveryTime: '40-50 mins',
    minOrder: 350,
    deliveryFee: 50,
    menu: [
      { name: 'Hyderabadi Dum Chicken Biryani', description: 'Aromatic basmati with tender chicken', price: 240, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
      { name: 'Veg Dum Biryani', description: 'Layered rice with vegetables', price: 150, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400' },
      { name: 'Mutton Biryani', description: 'Slow-cooked mutton with fragrant rice', price: 320, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
    openingHours: '12:00 PM - 11:30 PM',
    isOpen: true
  },
  {
    name: 'Thai Spice',
    description: 'Authentic Thai flavors and curries',
    cuisine: ['Thai', 'Asian', 'Seafood'],
    location: {
      type: 'Point',
      coordinates: [72.8950, 19.0950],
      address: '678 Colaba Causeway, Mumbai'
    },
    rating: 4.5,
    deliveryTime: '35-45 mins',
    minOrder: 400,
    deliveryFee: 55,
    menu: [
      { name: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp', price: 350, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400' },
      { name: 'Green Curry', description: 'Coconut curry with vegetables', price: 300, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400' },
      { name: 'Thai Basil Chicken',description: 'Stir-fried chicken with Thai basil and chilies',price: 340,category: 'main',vegetarian: false,image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=400'},
      { name: 'Vegetable Red Curry',description: 'Mixed vegetables in spicy red curry sauce',price: 260,category: 'main',vegetarian: true,image: 'https://images.pexels.com/photos/33430561/pexels-photo-33430561.jpeg' },
      { name: 'Thai Spring Rolls',description: 'Fresh vegetable rolls with peanut sauce',price: 220,category: 'appetizer',vegetarian: true,image: 'https://images.pexels.com/photos/6646369/pexels-photo-6646369.jpeg'},
      { name: 'Mango Sticky Rice', description: 'Sweet rice with fresh mango', price: 150, category: 'dessert', vegetarian: true, image: 'https://images.pexels.com/photos/19856579/pexels-photo-19856579.jpeg' }
    ],
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
    openingHours: '12:00 PM - 10:30 PM',
    isOpen: true
  },
  {
    name: 'Cafe Mocha',
    description: 'Coffee, shakes, and continental breakfast',
    cuisine: ['Cafe', 'Continental', 'Desserts'],
    location: {
      type: 'Point',
      coordinates: [72.8500, 19.0500],
      address: '234 Breach Candy, Mumbai'
    },
    rating: 4.3,
    deliveryTime: '20-30 mins',
    minOrder: 200,
    deliveryFee: 40,
    menu: [
      { name: 'Cappuccino', description: 'Classic Italian coffee', price: 150, category: 'beverage', vegetarian: true, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
      { name: 'Club Sandwich', description: 'Triple-decker sandwich with fries', price: 220, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' },
      { name: 'Waffles', description: 'Belgian waffles with maple syrup', price: 280, category: 'dessert', vegetarian: true, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400' },
      { name: 'Croissant',description: 'Buttery French pastry',price: 150,category: 'appetizer',vegetarian: true,image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400'},
      { name: 'Pasta Pesto',description: 'Penne pasta with basil pesto sauce',price: 340,category: 'main',vegetarian: true,image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400'},
      { name: 'Chocolate Cake', description: 'Rich chocolate layered cake', price: 220, category: 'dessert', vegetarian: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    openingHours: '8:00 AM - 11:00 PM',
    isOpen: true
  },
  {
    name: 'South Indian Express',
    description: 'Authentic dosas, idlis, and filter coffee',
    cuisine: ['South Indian', 'Indian', 'Vegetarian'],
    location: {
      type: 'Point',
      coordinates: [72.8450, 19.0450],
      address: '890 Matunga Road, Mumbai'
    },
    rating: 4.7,
    deliveryTime: '25-35 mins',
    minOrder: 180,
    deliveryFee: 35,
    menu: [
      { name: 'Masala Dosa', description: 'Crispy crepe with potato filling', price: 150, category: 'main', vegetarian: true, image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { name: 'Idli Sambhar', description: 'Steamed rice cakes with lentil soup', price: 100, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400' },
      { name: 'Medu Vada(4 pcs)', description: 'Fried lentil donuts', price: 80, category: 'appetizer', vegetarian: true, image: 'https://images.pexels.com/photos/20422135/pexels-photo-20422135.jpeg' },
      { name: 'Uttapam',description: 'Thick rice pancake with vegetables',price: 150,category: 'main',vegetarian: true,image: 'https://images.pexels.com/photos/20422130/pexels-photo-20422130.jpeg', },
      { name: 'Rava Dosa',description: 'Crispy semolina crepe',price: 160,category: 'main',vegetarian: true,image: 'https://images.pexels.com/photos/20422121/pexels-photo-20422121.jpeg' },
      { name: 'Pongal',description: 'Rice and lentil comfort food',price: 140,category: 'main',vegetarian: true,image: 'https://images.pexels.com/photos/30519624/pexels-photo-30519624.jpeg' }
    ],
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
    openingHours: '7:00 AM - 10:00 PM',
    isOpen: true
  },
  {
    name: 'BBQ Nation',
    description: 'Unlimited grills and live barbecue',
    cuisine: ['BBQ', 'Indian', 'Continental'],
    location: {
      type: 'Point',
      coordinates: [72.8400, 19.0400],
      address: '456 Phoenix Mall, Lower Parel, Mumbai'
    },
    rating: 4.6,
    deliveryTime: '40-50 mins',
    minOrder: 500,
    deliveryFee: 60,
    menu: [
      { name: 'BBQ Platter (Veg)', description: 'Assorted grilled vegetables', price: 550, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' },
      { name: 'BBQ Platter (Non-Veg)', description: 'Mixed grilled meats', price: 750, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400' },
      { name: 'Grilled Fish', description: 'Fresh fish with herbs', price: 650, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    openingHours: '12:00 PM - 11:00 PM',
    isOpen: true
  },
  {
    name: 'Desert Rose',
    description: 'Middle Eastern cuisine and kebabs',
    cuisine: ['Middle Eastern', 'Lebanese', 'Mediterranean'],
    location: {
      type: 'Point',
      coordinates: [72.8350, 19.0350],
      address: '789 Bandra Kurla Complex, Mumbai'
    },
    rating: 4.5,
    deliveryTime: '35-45 mins',
    minOrder: 400,
    deliveryFee: 55,
    menu: [
      { name: 'Shawarma Plate', description: 'Chicken shawarma with hummus', price: 320, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400' },
      { name: 'Falafel Wrap', description: 'Crispy chickpea balls in pita', price: 260, category: 'main', vegetarian: true, image: 'https://images.pexels.com/photos/6546022/pexels-photo-6546022.jpeg' },
      { name: 'Hummus Platter', description: 'Creamy chickpea dip with pita', price: 210, category: 'appetizer', vegetarian: true, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400' },
      { name: 'Chicken Kebab Platter',description: 'Grilled chicken kebabs with rice and salad',price: 380,category: 'main',vegetarian: false,image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { name: 'Baba Ganoush',description: 'Smoky eggplant dip with pita bread',price: 220,category: 'appetizer',vegetarian: true,image: 'https://images.pexels.com/photos/6419720/pexels-photo-6419720.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { name: 'Baklava', description: 'Sweet pastry with nuts and honey', price: 150, category: 'dessert', vegetarian: true, image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',
    openingHours: '12:00 PM - 11:00 PM',
    isOpen: true
  },
  {
    name: 'Healthy Bowl',
    description: 'Nutritious salads and smoothie bowls',
    cuisine: ['Healthy', 'Salads', 'Vegan'],
    location: {
      type: 'Point',
      coordinates: [72.8300, 19.0300],
      address: '321 Worli Sea Face, Mumbai'
    },
    rating: 4.4,
    deliveryTime: '20-30 mins',
    minOrder: 250,
    deliveryFee: 40,
    menu: [
      { name: 'Greek Salad', description: 'Fresh vegetables with feta cheese', price: 260, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400' },
      { name: 'Acai Bowl', description: 'Acai with fruits and granola', price: 240, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400' },
      { name: 'Quinoa Salad', description: 'Protein-rich quinoa with veggies', price: 250, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
      { name: 'Quinoa Power Bowl',description: 'Quinoa with grilled chicken, avocado and greens',price: 240,category: 'main',vegetarian: false,image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { name: 'Green Smoothie', description: 'Spinach, banana, and protein', price: 180, category: 'beverage', vegetarian: true, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    openingHours: '8:00 AM - 9:00 PM',
    isOpen: true
  },
  {
    name: 'Dessert Studio',
    description: 'Artisanal desserts and ice creams',
    cuisine: ['Desserts', 'Ice Cream', 'Bakery'],
    location: {
      type: 'Point',
      coordinates: [72.8250, 19.0250],
      address: '567 Pedder Road, Mumbai'
    },
    rating: 4.7,
    deliveryTime: '25-35 mins',
    minOrder: 200,
    deliveryFee: 45,
    menu: [
      { name: 'Belgian Chocolate Cake', description: 'Rich dark chocolate layered cake', price: 280, category: 'dessert', vegetarian: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
      { name: 'Red Velvet Pastry', description: 'Cream cheese frosting on red velvet', price: 200, category: 'dessert', vegetarian: true, image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400' },
      { name: 'Gelato Trio', description: 'Three flavors of Italian ice cream', price: 230, category: 'dessert', vegetarian: true, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
      { name: 'Chocolate Lava Cake',description: 'Warm molten chocolate cake with vanilla ice cream',price: 280,category: 'dessert',vegetarian: true,image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'},
      { name: 'Cheesecake', description: 'New York style cheesecake', price: 270, category: 'dessert', vegetarian: true, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
    openingHours: '10:00 AM - 11:00 PM',
    isOpen: true
  },
  {
    name: 'Coastal Kitchen',
    description: 'Fresh seafood and coastal delicacies',
    cuisine: ['Seafood', 'Coastal', 'Indian'],
    location: {
      type: 'Point',
      coordinates: [72.8200, 19.0200],
      address: '890 Versova Beach, Mumbai'
    },
    rating: 4.6,
    deliveryTime: '40-50 mins',
    minOrder: 450,
    deliveryFee: 60,
    menu: [
      { name: 'Fish Curry Rice', description: 'Spicy fish curry with steamed rice', price: 480, category: 'main', vegetarian: false, image: 'https://images.pexels.com/photos/8983398/pexels-photo-8983398.jpeg' },
      { name: 'Prawn Masala', description: 'Jumbo prawns in rich gravy', price: 650, category: 'main', vegetarian: false, image: 'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg' },
      { name: 'Crab Soup', description: 'Creamy crab bisque', price: 380, category: 'appetizer', vegetarian: false, image: 'https://images.pexels.com/photos/16068592/pexels-photo-16068592.jpeg' },
      { name: 'Grilled Fish Tikka',description: 'Tandoori spiced fish with mint chutney',price: 520,category: 'main',vegetarian: false,image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { name: 'Fish Fry', description: 'Crispy fried fish fillets', price: 420, category: 'appetizer', vegetarian: false, image: 'https://images.pexels.com/photos/1123250/pexels-photo-1123250.jpeg' }
    ],
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800',
    openingHours: '12:00 PM - 10:30 PM',
    isOpen: true
  },
  {
    name: 'Punjabi Rasoi',
    description: 'Home-style Punjabi cooking',
    cuisine: ['Punjabi', 'North Indian', 'Indian'],
    location: {
      type: 'Point',
      coordinates: [72.8150, 19.0150],
      address: '123 Goregaon West, Mumbai'
    },
    rating: 4.5,
    deliveryTime: '30-40 mins',
    minOrder: 250,
    deliveryFee: 40,
    menu: [
      { name: 'Chole Bhature', description: 'Spicy chickpeas with fried bread', price: 150, category: 'main', vegetarian: true, image: 'https://images.pexels.com/photos/11818239/pexels-photo-11818239.jpeg' },
      { name: 'Sarson ka Saag', description: 'Mustard greens curry', price: 180, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
      { name: 'Makki ki Roti', description: 'Corn flour flatbread', price: 50, category: 'appetizer', vegetarian: true, image: 'https://images.pexels.com/photos/6419703/pexels-photo-6419703.jpeg' },
      { name: 'Lassi', description: 'Sweet yogurt drink', price: 80, category: 'beverage', vegetarian: true, image: 'https://images.pexels.com/photos/8917283/pexels-photo-8917283.jpeg' }
    ],
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    openingHours: '11:00 AM - 10:00 PM',
    isOpen: true
  },
  {
    name: 'Vegan Delight',
    description: 'Plant-based and cruelty-free cuisine',
    cuisine: ['Vegan', 'Healthy', 'Organic'],
    location: {
      type: 'Point',
      coordinates: [72.8100, 19.0100],
      address: '456 Andheri East, Mumbai'
    },
    rating: 4.4,
    deliveryTime: '30-40 mins',
    minOrder: 300,
    deliveryFee: 45,
    menu: [
      { name: 'Vegan Buddha Bowl', description: 'Quinoa, tofu, and vegetables', price: 380, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
      { name: 'Jackfruit Curry', description: 'Plant-based meat alternative curry', price: 320, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
      { name: 'Almond Milk Smoothie', description: 'Fresh fruits with almond milk', price: 220, category: 'beverage', vegetarian: true, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400' },
      { name: 'Energy Balls', description: 'Dates and nuts power snack', price: 150, category: 'dessert', vegetarian: true, image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    openingHours: '9:00 AM - 9:00 PM',
    isOpen: true
  },
  {
    name: 'Korean Kitchen',
    description: 'Authentic Korean BBQ and kimchi',
    cuisine: ['Korean', 'Asian', 'BBQ'],
    location: {
      type: 'Point',
      coordinates: [72.8050, 19.0050],
      address: '789 Powai, Mumbai'
    },
    rating: 4.7,
    deliveryTime: '35-45 mins',
    minOrder: 450,
    deliveryFee: 55,
    menu: [
      { name: 'Bibimbap', description: 'Rice bowl with vegetables and egg', price: 420, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400' },
      { name: 'Korean Fried Chicken', description: 'Crispy chicken with gochujang sauce', price: 480, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400' },
      { name: 'Kimchi', description: 'Fermented cabbage side dish', price: 150, category: 'appetizer', vegetarian: true, image: 'https://images.unsplash.com/photo-1580217593608-61931cefc821?w=400' },
      { name: 'Bulgogi', description: 'Marinated beef with vegetables', price: 550, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800',
    openingHours: '12:00 PM - 10:30 PM',
    isOpen: true
  },
  {
    name: 'The Breakfast Club',
    description: 'All-day breakfast and brunch specials',
    cuisine: ['Breakfast', 'American', 'Continental'],
    location: {
      type: 'Point',
      coordinates: [72.8000, 19.0000],
      address: '234 Khar West, Mumbai'
    },
    rating: 4.6,
    deliveryTime: '25-35 mins',
    minOrder: 280,
    deliveryFee: 40,
    menu: [
      { name: 'English Breakfast', description: 'Eggs, sausage, beans, and toast', price: 450, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400' },
      { name: 'Pancakes Stack', description: 'Fluffy pancakes with maple syrup', price: 320, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400' },
      { name: 'Avocado Toast', description: 'Smashed avocado on sourdough', price: 350, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400' },
      { name: 'Fresh Orange Juice', description: 'Freshly squeezed juice', price: 150, category: 'beverage', vegetarian: true, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800',
    openingHours: '7:00 AM - 4:00 PM',
    isOpen: true
  },
  {
    name: 'Street Food Junction',
    description: 'Indian street food favorites',
    cuisine: ['Street Food', 'Indian', 'Snacks'],
    location: {
      type: 'Point',
      coordinates: [72.7950, 18.9950],
      address: '567 Chowpatty Beach, Mumbai'
    },
    rating: 4.5,
    deliveryTime: '20-30 mins',
    minOrder: 150,
    deliveryFee: 30,
    menu: [
      { name: 'Pav Bhaji', description: 'Spicy vegetable curry with bread', price: 150, category: 'main', vegetarian: true, image: 'https://images.pexels.com/photos/17433337/pexels-photo-17433337.jpeg' },
      { name: 'Pani Puri', description: 'Crispy shells with tangy water', price: 80, category: 'appetizer', vegetarian: true, image: 'https://images.pexels.com/photos/34270741/pexels-photo-34270741.jpeg' },
      { name: 'Vada Pav', description: 'Potato fritter in bread', price: 40, category: 'appetizer', vegetarian: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
      { name: 'Bhel Puri', description: 'Puffed rice with chutneys', price: 100, category: 'appetizer', vegetarian: true, image: 'https://images.pexels.com/photos/27496505/pexels-photo-27496505.jpeg' }
    ],
    image: 'https://images.unsplash.com/photo-1626132647523-66f2bf380027?w=800',
    openingHours: '11:00 AM - 11:00 PM',
    isOpen: true
  },
  {
    name: 'Mediterranean Grill',
    description: 'Fresh Mediterranean flavors',
    cuisine: ['Mediterranean', 'Greek', 'Healthy'],
    location: {
      type: 'Point',
      coordinates: [72.7900, 18.9900],
      address: '890 Nariman Point, Mumbai'
    },
    rating: 4.6,
    deliveryTime: '30-40 mins',
    minOrder: 380,
    deliveryFee: 50,
    menu: [
      { name: 'Souvlaki', description: 'Grilled meat skewers with pita', price: 450, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400' },
      { name: 'Mediterranean Salad', description: 'Fresh greens with olives and feta', price: 350, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400' },
      { name: 'Tzatziki Dip', description: 'Yogurt and cucumber dip', price: 180, category: 'appetizer', vegetarian: true, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400' },
      { name: 'Grilled Halloumi', description: 'Grilled cheese with herbs', price: 380, category: 'appetizer', vegetarian: true, image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400' }
    ],
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    openingHours: '12:00 PM - 10:00 PM',
    isOpen: true
  },
  {
    name: 'Ramen House',
    description: 'Authentic Japanese ramen and noodles',
    cuisine: ['Japanese', 'Ramen', 'Noodles'],
    location: {
      type: 'Point',
      coordinates: [72.7850, 18.9850],
      address: '123 BKC, Mumbai'
    },
    rating: 4.7,
    deliveryTime: '35-45 mins',
    minOrder: 400,
    deliveryFee: 55,
    menu: [
      { name: 'Tonkotsu Ramen', description: 'Pork bone broth with noodles', price: 480, category: 'main', vegetarian: false, image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400' },
      { name: 'Vegetable Ramen', description: 'Miso broth with vegetables', price: 420, category: 'main', vegetarian: true, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
      { name: 'Gyoza', description: 'Pan-fried dumplings', price: 280, category: 'appetizer', vegetarian: false, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400' },
      { name: 'Edamame', description: 'Steamed soybeans with salt', price: 180, category: 'appetizer', vegetarian: true, image: 'https://images.pexels.com/photos/1860193/pexels-photo-1860193.jpeg' }
    ],
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800',
    openingHours: '12:00 PM - 10:30 PM',
    isOpen: true
  }
];

// 35+ Entertainment Events across all categories
const events = [
  // MOVIES (10)
  {
    title: 'Avengers: Secret Wars',
    description: 'The biggest Marvel movie of the decade with breathtaking action and stunning visuals',
    category: 'movie',
    venue: {
      name: 'INOX Megaplex',
      location: {
        type: 'Point',
        coordinates: [72.8777, 19.0760],
        address: 'Phoenix Mall, Lower Parel, Mumbai'
      }
    },
    date: new Date('2025-11-15'),
    time: '7:00 PM',
    duration: '2h 45m',
    ticketTypes: [
      { type: 'Regular', price: 250, available: 100 },
      { type: 'Premium', price: 400, available: 50 },
      { type: 'VIP Recliner', price: 600, available: 20 }
    ],
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    rating: 4.8,
    language: 'English',
    ageRating: 'PG-13'
  },
  {
    title: 'Pushpa 2: The Rule',
    description: 'The most anticipated sequel of Indian cinema - action-packed blockbuster',
    category: 'movie',
    venue: {
      name: 'PVR IMAX',
      location: {
        type: 'Point',
        coordinates: [72.8850, 19.0820],
        address: 'Phoenix Marketcity, Kurla, Mumbai'
      }
    },
    date: new Date('2025-12-05'),
    time: '9:00 PM',
    duration: '3h 10m',
    ticketTypes: [
      { type: 'Normal', price: 300, available: 150 },
      { type: 'IMAX', price: 550, available: 80 },
      { type: 'Gold Class', price: 800, available: 40 }
    ],
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    rating: 4.6,
    language: 'Hindi, Telugu',
    ageRating: 'UA'
  },
  {
    title: 'Interstellar Re-Release',
    description: 'Christopher Nolan\'s masterpiece returns to IMAX screens',
    category: 'movie',
    venue: {
      name: 'PVR IMAX',
      location: {
        type: 'Point',
        coordinates: [72.8850, 19.0820],
        address: 'Phoenix Marketcity, Kurla, Mumbai'
      }
    },
    date: new Date('2025-11-20'),
    time: '6:30 PM',
    duration: '2h 49m',
    ticketTypes: [
      { type: 'IMAX', price: 600, available: 120 },
      { type: 'IMAX Premium', price: 850, available: 50 }
    ],
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    rating: 4.9,
    language: 'English',
    ageRating: 'PG-13'
  },
  {
    title: 'Pathaan Returns',
    description: 'Shah Rukh Khan is back with high-octane action thriller',
    category: 'movie',
    venue: {
      name: 'Cinepolis',
      location: {
        type: 'Point',
        coordinates: [72.8700, 19.0700],
        address: 'Viviana Mall, Thane'
      }
    },
    date: new Date('2025-12-15'),
    time: '8:00 PM',
    duration: '2h 35m',
    ticketTypes: [
      { type: 'Standard', price: 280, available: 200 },
      { type: 'Executive', price: 450, available: 80 },
      { type: 'Premium', price: 650, available: 30 }
    ],
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
    rating: 4.7,
    language: 'Hindi',
    ageRating: 'UA'
  },
  {
    title: 'Dune: Messiah',
    description: 'The epic saga continues - breathtaking sci-fi adventure',
    category: 'movie',
    venue: {
      name: 'INOX Megaplex',
      location: {
        type: 'Point',
        coordinates: [72.8777, 19.0760],
        address: 'Phoenix Mall, Lower Parel, Mumbai'
      }
    },
    date: new Date('2025-12-01'),
    time: '7:30 PM',
    duration: '2h 55m',
    ticketTypes: [
      { type: 'Regular', price: 320, available: 120 },
      { type: 'Dolby Atmos', price: 520, available: 60 },
      { type: 'VIP', price: 750, available: 25 }
    ],
    image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&q=80',
    rating: 4.8,
    language: 'English',
    ageRating: 'PG-13'
  },
  {
    title: 'Salaar Part 2',
    description: 'Pan-Indian action drama with stunning visuals',
    category: 'movie',
    venue: {
      name: 'Carnival Cinemas',
      location: {
        type: 'Point',
        coordinates: [72.8600, 19.0600],
        address: 'R City Mall, Ghatkopar'
      }
    },
    date: new Date('2025-11-25'),
    time: '9:30 PM',
    duration: '2h 50m',
    ticketTypes: [
      { type: 'Silver', price: 250, available: 180 },
      { type: 'Gold', price: 420, available: 70 },
      { type: 'Platinum', price: 600, available: 35 }
    ],
    image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800&q=80',
    rating: 4.5,
    language: 'Hindi, Telugu, Tamil',
    ageRating: 'UA'
  },
  {
    title: 'The Batman Returns',
    description: 'The Dark Knight rises again in Gotham City',
    category: 'movie',
    venue: {
      name: 'PVR Director\'s Cut',
      location: {
        type: 'Point',
        coordinates: [72.8900, 19.0900],
        address: 'Ambience Mall, Vasai'
      }
    },
    date: new Date('2025-12-10'),
    time: '10:00 PM',
    duration: '2h 40m',
    ticketTypes: [
      { type: 'Luxury Recliner', price: 900, available: 40 },
      { type: 'Premium', price: 650, available: 50 }
    ],
    image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&q=80',
    rating: 4.7,
    language: 'English',
    ageRating: 'PG-13'
  },
  {
    title: 'Jawan 2',
    description: 'Shah Rukh Khan\'s blockbuster sequel with massive action',
    category: 'movie',
    venue: {
      name: 'Cinepolis',
      location: {
        type: 'Point',
        coordinates: [72.8550, 19.0550],
        address: 'Seawoods Grand Central, Navi Mumbai'
      }
    },
    date: new Date('2025-11-28'),
    time: '8:30 PM',
    duration: '2h 45m',
    ticketTypes: [
      { type: 'Normal', price: 300, available: 150 },
      { type: 'Premium', price: 480, available: 70 },
      { type: 'VIP', price: 700, available: 30 }
    ],
    image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800&q=80',
    rating: 4.6,
    language: 'Hindi',
    ageRating: 'UA'
  },
  {
    title: 'Spider-Man: New Era',
    description: 'New web-slinging adventures across the multiverse',
    category: 'movie',
    venue: {
      name: 'INOX Insignia',
      location: {
        type: 'Point',
        coordinates: [72.8450, 19.0450],
        address: 'Atria Mall, Worli'
      }
    },
    date: new Date('2025-12-08'),
    time: '6:00 PM',
    duration: '2h 30m',
    ticketTypes: [
      { type: '4DX', price: 850, available: 50 },
      { type: 'IMAX', price: 650, available: 80 },
      { type: 'Regular', price: 350, available: 120 }
    ],
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&q=80',
    rating: 4.8,
    language: 'English',
    ageRating: 'PG-13'
  },
  {
    title: 'Gadar 3',
    description: 'The legendary saga continues with patriotic fervor',
    category: 'movie',
    venue: {
      name: 'Moviemax',
      location: {
        type: 'Point',
        coordinates: [72.8350, 19.0350],
        address: 'Hub Mall, Goregaon'
      }
    },
    date: new Date('2025-12-20'),
    time: '7:00 PM',
    duration: '2h 55m',
    ticketTypes: [
      { type: 'Standard', price: 270, available: 200 },
      { type: 'Royal', price: 450, available: 80 }
    ],
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    rating: 4.5,
    language: 'Hindi',
    ageRating: 'UA'
  },

  // CONCERTS (10)
  {
    title: 'Arijit Singh Live in Concert',
    description: 'An unforgettable evening with the voice of Bollywood - experience magic live',
    category: 'concert',
    venue: {
      name: 'DY Patil Stadium',
      location: {
        type: 'Point',
        coordinates: [73.0169, 19.0330],
        address: 'D.Y. Patil Sports Stadium, Navi Mumbai'
      }
    },
    date: new Date('2025-12-20'),
    time: '6:00 PM',
    duration: '3 hours',
    ticketTypes: [
      { type: 'Silver', price: 1500, available: 500 },
      { type: 'Gold', price: 3000, available: 200 },
      { type: 'Platinum', price: 5000, available: 100 },
      { type: 'VIP Meet & Greet', price: 10000, available: 50 }
    ],
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
    rating: 4.9
  },
  {
    title: 'Coldplay: Music of the Spheres',
    description: 'Experience the spectacular world tour with stunning visuals and greatest hits',
    category: 'concert',
    venue: {
      name: 'DY Patil Stadium',
      location: {
        type: 'Point',
        coordinates: [73.0169, 19.0330],
        address: 'D.Y. Patil Sports Stadium, Navi Mumbai'
      }
    },
    date: new Date('2026-01-15'),
    time: '7:00 PM',
    duration: '2.5 hours',
    ticketTypes: [
      { type: 'General', price: 3000, available: 800 },
      { type: 'Fan Pit', price: 8000, available: 300 },
      { type: 'VIP Lounge', price: 15000, available: 100 }
    ],
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    rating: 4.9
  },
  {
    title: 'Diljit Dosanjh Live',
    description: 'Punjabi music sensation performs his biggest hits',
    category: 'concert',
    venue: {
      name: 'MMRDA Grounds',
      location: {
        type: 'Point',
        coordinates: [72.8700, 19.0650],
        address: 'BKC, Mumbai'
      }
    },
    date: new Date('2025-12-28'),
    time: '7:30 PM',
    duration: '3 hours',
    ticketTypes: [
      { type: 'General', price: 1200, available: 600 },
      { type: 'Premium', price: 2500, available: 250 },
      { type: 'VIP', price: 5000, available: 100 }
    ],
    image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80',
    rating: 4.7
  },
  {
    title: 'AR Rahman Symphony',
    description: 'The maestro performs with full orchestra',
    category: 'concert',
    venue: {
      name: 'Jio World Garden',
      location: {
        type: 'Point',
        coordinates: [72.8680, 19.0620],
        address: 'BKC, Mumbai'
      }
    },
    date: new Date('2026-01-10'),
    time: '8:00 PM',
    duration: '2.5 hours',
    ticketTypes: [
      { type: 'Bronze', price: 2000, available: 400 },
      { type: 'Silver', price: 4000, available: 200 },
      { type: 'Gold', price: 7000, available: 100 },
      { type: 'Platinum', price: 12000, available: 50 }
    ],
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80',
    rating: 5.0
  },
  {
    title: 'Badshah Live',
    description: 'Hip-hop star brings energetic performance',
    category: 'concert',
    venue: {
      name: 'MMRDA Grounds',
      location: {
        type: 'Point',
        coordinates: [72.8700, 19.0650],
        address: 'BKC, Mumbai'
      }
    },
    date: new Date('2025-12-18'),
    time: '7:00 PM',
    duration: '2 hours',
    ticketTypes: [
      { type: 'Standing', price: 1000, available: 800 },
      { type: 'Seated', price: 2000, available: 300 },
      { type: 'VIP', price: 4500, available: 80 }
    ],
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
    rating: 4.6
  },
  {
    title: 'Shreya Ghoshal Concert',
    description: 'Melodious evening with playback singing queen',
    category: 'concert',
    venue: {
      name: 'Wankhede Stadium',
      location: {
        type: 'Point',
        coordinates: [72.8258, 18.9388],
        address: 'D Road, Churchgate, Mumbai'
      }
    },
    date: new Date('2026-01-25'),
    time: '7:00 PM',
    duration: '3 hours',
    ticketTypes: [
      { type: 'Bronze', price: 1800, available: 500 },
      { type: 'Silver', price: 3500, available: 250 },
      { type: 'Gold', price: 6000, available: 120 }
    ],
    image: 'https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=800&q=80',
    rating: 4.8
  },
  {
    title: 'Sunburn Festival 2026',
    description: 'Asia\'s biggest EDM festival with international DJs',
    category: 'concert',
    venue: {
      name: 'Mahalaxmi Racecourse',
      location: {
        type: 'Point',
        coordinates: [72.8200, 18.9850],
        address: 'Mahalaxmi, Mumbai'
      }
    },
    date: new Date('2026-02-14'),
    time: '4:00 PM',
    duration: '8 hours',
    ticketTypes: [
      { type: '1-Day Pass', price: 3500, available: 1000 },
      { type: 'VIP 1-Day', price: 7000, available: 300 },
      { type: 'Luxury Box', price: 25000, available: 50 }
    ],
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    rating: 4.7
  },
  {
    title: 'Sonu Nigam Live',
    description: 'Live performance by versatile singer',
    category: 'concert',
    venue: {
      name: 'NSCI Dome',
      location: {
        type: 'Point',
        coordinates: [72.8320, 18.9890],
        address: 'Worli, Mumbai'
      }
    },
    date: new Date('2025-12-22'),
    time: '7:30 PM',
    duration: '2.5 hours',
    ticketTypes: [
      { type: 'Standard', price: 1500, available: 400 },
      { type: 'Premium', price: 3000, available: 150 },
      { type: 'Royal', price: 5500, available: 70 }
    ],
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    rating: 4.7
  },
  {
    title: 'Nucleya Live',
    description: 'Bass music and electronic beats',
    category: 'concert',
    venue: {
      name: 'Bayview Lawns',
      location: {
        type: 'Point',
        coordinates: [72.8150, 18.9750],
        address: 'Mazgaon, Mumbai'
      }
    },
    date: new Date('2026-01-05'),
    time: '8:00 PM',
    duration: '3 hours',
    ticketTypes: [
      { type: 'Early Bird', price: 1200, available: 500 },
      { type: 'Regular', price: 1800, available: 300 },
      { type: 'VIP', price: 3500, available: 100 }
    ],
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    rating: 4.6
  },
  {
    title: 'Neha Kakkar Live Show',
    description: 'Energetic performance by pop sensation',
    category: 'concert',
    venue: {
      name: 'MMRDA Grounds',
      location: {
        type: 'Point',
        coordinates: [72.8700, 19.0650],
        address: 'BKC, Mumbai'
      }
    },
    date: new Date('2026-02-01'),
    time: '7:00 PM',
    duration: '2 hours',
    ticketTypes: [
      { type: 'General', price: 1000, available: 600 },
      { type: 'Premium', price: 2200, available: 250 },
      { type: 'VIP', price: 4000, available: 90 }
    ],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    rating: 4.5
  },

  // SPORTS (8)
  {
    title: 'IPL 2026: MI vs CSK',
    description: 'The ultimate cricket rivalry - Mumbai Indians vs Chennai Super Kings',
    category: 'sports',
    venue: {
      name: 'Wankhede Stadium',
      location: {
        type: 'Point',
        coordinates: [72.8258, 18.9388],
        address: 'D Road, Churchgate, Mumbai'
      }
    },
    date: new Date('2026-04-10'),
    time: '7:30 PM',
    duration: '3.5 hours',
    ticketTypes: [
      { type: 'General Stand', price: 800, available: 1000 },
      { type: 'Premium Stand', price: 2000, available: 500 },
      { type: 'Hospitality Box', price: 10000, available: 50 }
    ],
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    rating: 5.0
  },
  {
    title: 'ISL: Mumbai City FC vs ATK Mohun Bagan',
    description: 'Exciting Indian Super League football match',
    category: 'sports',
    venue: {
      name: 'Mumbai Football Arena',
      location: {
        type: 'Point',
        coordinates: [72.8350, 19.0250],
        address: 'Andheri Sports Complex, Mumbai'
      }
    },
    date: new Date('2025-12-15'),
    time: '7:00 PM',
    duration: '2 hours',
    ticketTypes: [
      { type: 'North Stand', price: 400, available: 800 },
      { type: 'East Stand', price: 700, available: 400 },
      { type: 'West Stand Premium', price: 1200, available: 200 }
    ],
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    rating: 4.5
  },
  {
    title: 'Pro Kabaddi: Mumbai vs Bengal',
    description: 'High-octane kabaddi action',
    category: 'sports',
    venue: {
      name: 'NSCI Dome',
      location: {
        type: 'Point',
        coordinates: [72.8320, 18.9890],
        address: 'Worli, Mumbai'
      }
    },
    date: new Date('2025-12-08'),
    time: '8:00 PM',
    duration: '2 hours',
    ticketTypes: [
      { type: 'Standard', price: 500, available: 500 },
      { type: 'Premium', price: 1000, available: 250 },
      { type: 'VIP', price: 2000, available: 100 }
    ],
    image: 'https://images.unsplash.com/photo-1530915365347-e35b749a0381?w=800&q=80',
    rating: 4.6
  },
  {
    title: 'T20 World Cup: India vs Australia',
    description: 'Epic clash between cricket giants',
    category: 'sports',
    venue: {
      name: 'Wankhede Stadium',
      location: {
        type: 'Point',
        coordinates: [72.8258, 18.9388],
        address: 'D Road, Churchgate, Mumbai'
      }
    },
    date: new Date('2026-03-15'),
    time: '7:30 PM',
    duration: '4 hours',
    ticketTypes: [
      { type: 'Popular Stand', price: 1500, available: 800 },
      { type: 'Premium Stand', price: 3500, available: 400 },
      { type: 'Corporate Box', price: 15000, available: 40 }
    ],
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    rating: 5.0
  },
  {
    title: 'WWE Live India Tour',
    description: 'World wrestling entertainment comes to Mumbai',
    category: 'sports',
    venue: {
      name: 'DY Patil Stadium',
      location: {
        type: 'Point',
        coordinates: [73.0169, 19.0330],
        address: 'D.Y. Patil Sports Stadium, Navi Mumbai'
      }
    },
    date: new Date('2026-02-20'),
    time: '6:00 PM',
    duration: '3 hours',
    ticketTypes: [
      { type: 'General', price: 2000, available: 1000 },
      { type: 'Ringside', price: 5000, available: 300 },
      { type: 'VIP', price: 10000, available: 100 }
    ],
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    rating: 4.8
  },
  {
    title: 'Mumbai Marathon 2026',
    description: 'Annual marathon through the streets of Mumbai',
    category: 'sports',
    venue: {
      name: 'Gateway of India Start Point',
      location: {
        type: 'Point',
        coordinates: [72.8347, 18.9217],
        address: 'Colaba, Mumbai'
      }
    },
    date: new Date('2026-01-19'),
    time: '5:30 AM',
    duration: '6 hours',
    ticketTypes: [
      { type: 'Full Marathon (42km)', price: 1500, available: 3000 },
      { type: 'Half Marathon (21km)', price: 1000, available: 5000 },
      { type: '10K Run', price: 500, available: 8000 }
    ],
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    rating: 4.7
  },
  {
    title: 'Boxing Night Championship',
    description: 'Professional boxing matches featuring Indian boxers',
    category: 'sports',
    venue: {
      name: 'NSCI Dome',
      location: {
        type: 'Point',
        coordinates: [72.8320, 18.9890],
        address: 'Worli, Mumbai'
      }
    },
    date: new Date('2025-12-30'),
    time: '7:00 PM',
    duration: '3 hours',
    ticketTypes: [
      { type: 'General', price: 800, available: 600 },
      { type: 'Ringside', price: 2500, available: 200 },
      { type: 'VIP', price: 5000, available: 80 }
    ],
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80',
    rating: 4.5
  },
  {
    title: 'Premier Badminton League',
    description: 'Star badminton players in action',
    category: 'sports',
    venue: {
      name: 'CCI Badminton Courts',
      location: {
        type: 'Point',
        coordinates: [72.8280, 18.9310],
        address: 'Churchgate, Mumbai'
      }
    },
    date: new Date('2026-01-12'),
    time: '6:00 PM',
    duration: '2.5 hours',
    ticketTypes: [
      { type: 'Standard', price: 600, available: 400 },
      { type: 'Premium', price: 1200, available: 200 },
      { type: 'Courtside', price: 2500, available: 80 }
    ],
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
    rating: 4.6
  },

  // COMEDY (7)
  {
    title: 'Zakir Khan - Chaos Comedy',
    description: 'Get ready to laugh until your stomach hurts with India\'s favorite comedian',
    category: 'comedy',
    venue: {
      name: 'NCPA Theatre',
      location: {
        type: 'Point',
        coordinates: [72.8235, 18.9260],
        address: 'Nariman Point, Mumbai'
      }
    },
    date: new Date('2025-11-25'),
    time: '8:00 PM',
    duration: '2 hours',
    ticketTypes: [
      { type: 'Standard', price: 500, available: 200 },
      { type: 'Premium', price: 800, available: 100 },
      { type: 'VIP Front Row', price: 1500, available: 30 }
    ],
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80',
    rating: 4.7
  },
  {
    title: 'Kapil Sharma Live',
    description: 'The king of comedy performs live',
    category: 'comedy',
    venue: {
      name: 'Jio World Garden',
      location: {
        type: 'Point',
        coordinates: [72.8680, 19.0620],
        address: 'BKC, Mumbai'
      }
    },
    date: new Date('2025-12-12'),
    time: '7:30 PM',
    duration: '2.5 hours',
    ticketTypes: [
      { type: 'Silver', price: 1000, available: 500 },
      { type: 'Gold', price: 2000, available: 250 },
      { type: 'Platinum', price: 3500, available: 100 }
    ],
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    rating: 4.8
  },
  {
    title: 'Vir Das World Tour',
    description: 'International comedian returns to India',
    category: 'comedy',
    venue: {
      name: 'NSCI Dome',
      location: {
        type: 'Point',
        coordinates: [72.8320, 18.9890],
        address: 'Worli, Mumbai'
      }
    },
    date: new Date('2026-01-20'),
    time: '8:00 PM',
    duration: '2 hours',
    ticketTypes: [
      { type: 'Regular', price: 1200, available: 400 },
      { type: 'Premium', price: 2500, available: 200 },
      { type: 'VIP', price: 4000, available: 80 }
    ],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    rating: 4.9
  },
  {
    title: 'Biswa Kalyan Rath Stand-up',
    description: 'Smart comedy with witty observations',
    category: 'comedy',
    venue: {
      name: 'Canvas Laugh Club',
      location: {
        type: 'Point',
        coordinates: [72.8420, 19.0480],
        address: 'Palladium Mall, Lower Parel'
      }
    },
    date: new Date('2025-12-05'),
    time: '9:00 PM',
    duration: '1.5 hours',
    ticketTypes: [
      { type: 'General', price: 700, available: 150 },
      { type: 'Premium', price: 1200, available: 80 }
    ],
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80',
    rating: 4.6
  },
  {
    title: 'Kenny Sebastian - The Most Interesting Person',
    description: 'Musical comedy special',
    category: 'comedy',
    venue: {
      name: 'Prithvi Theatre',
      location: {
        type: 'Point',
        coordinates: [72.8270, 19.0510],
        address: 'Juhu, Mumbai'
      }
    },
    date: new Date('2025-12-18'),
    time: '7:00 PM',
    duration: '2 hours',
    ticketTypes: [
      { type: 'Standard', price: 700, available: 180 },
      { type: 'Premium', price: 1300, available: 90 },
      { type: 'Front Row', price: 2000, available: 30 }
    ],
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80',
    rating: 4.6
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/uniserve';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Vehicle.deleteMany({});
    console.log('🗑️ Cleared existing vehicles');

    // Insert vehicles
    const seededVehicles = await Vehicle.insertMany(vehicles);
    console.log(`✅ Seeded ${seededVehicles.length} vehicles!`);
    console.log(`   📍 ${seededVehicles.filter(v => v.type === 'bike').length} Bikes`);
    console.log(`   🚗 ${seededVehicles.filter(v => v.type === 'car').length} Cars`);
    console.log(`   🚙 ${seededVehicles.filter(v => v.type === 'suv').length} SUVs`);

    // Seed restaurants if data exists
    if (restaurants.length > 0) {
      await Restaurant.deleteMany({});
      const savedRestaurants = await Restaurant.insertMany(restaurants);
      console.log(`✅ Seeded ${savedRestaurants.length} restaurants`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();