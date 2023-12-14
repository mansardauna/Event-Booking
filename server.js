const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const Grid = require('gridfs-stream');
const crypto = require('crypto');






const app = express();
const PORT = 3003;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true, // Enable TLS for the connection
});
const conn = mongoose.connection;

// Create a GridFS stream
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads'); // Set the collection name
});


// Create a MongoDB schema and model

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
favourites: [{
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name: String,
  price: mongoose.Schema.Types.Mixed,
  images: [String],
},
],
  
  
});

const signupSchema = new mongoose.Schema({
  username: String,
  password: String,
  id: Number,
});

const categorySchema = new mongoose.Schema({
  id: Number,
  title: String,
});

const productSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  name: String,
  price: mongoose.Schema.Types.Mixed,
  rate: String,
  images: { type: [String], default: [] }, 
  videos: { type: [String], default: [] }, 
  location: String,
  category: String,
  des: String,
  facilities: [{
    icon: String,
    title: String,
  }],
  reviews: [mongoose.Schema.Types.Mixed],
  booking: [mongoose.Schema.Types.Mixed],
  passcode: String,
});

const bookingSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  username: String,
  event: String,
  name: String,
  price: Number,
  TotalPrice: Number,
  phoneNumber: String,
  productId: String,
  status: String,
});

const YourModel = {
  User: mongoose.model('User', userSchema),
  Signup: mongoose.model('Signup', signupSchema),
  Category: mongoose.model('Category', categorySchema),
  Product: mongoose.model('Product', productSchema),
  BookingModel: mongoose.model('Booking', bookingSchema),

};


const db = mongoose.connection;

// Listen for the connection event
db.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Listen for the error event
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(bodyParser.json());
app.use(cors());




// Product
app.get('/api/products', async (req, res) => {
  try {
    const products = await YourModel.Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    newProduct.images.forEach(image => {
      image._id = new mongoose.Types.ObjectId(); // Generate a new ObjectId for each image
    });
    const createdProduct = await YourModel.Product.create(newProduct);
    res.json(createdProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.put('/api/products/:productId', async (req, res) => {
  const productId = req.params.productId;
  const updatedProductData = req.body;

  try {
    const updatedProduct = await YourModel.Product.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//signUp
app.post('/api/signups', async (req, res) => {
  const { username, password } = req.body.auth;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new YourModel.User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//Users
const jwtKey = crypto.randomBytes(32).toString('hex');

app.post('/api/users', async (req, res) => {
  const { username, password } = req.body.auth;

  try {
    const user = await YourModel.User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, jwtKey, { expiresIn: '1h' });

    // Send user data in the response
    res.status(200).json({ token, userData: user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// verify token

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  jwt.verify(token.split(' ')[1], jwtKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Set the userId in the request object
    req.decodedToken = decodedToken;

    next();
  });
};


// ...

// Fetch user data using the decoded token
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    // Destructure the userId from the decoded token
    const { userId } = req.decodedToken;

    // Fetch the user data using the userId
    const user = await YourModel.User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ username: user.username });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message || 'Unknown error' });

  }
  
});

//booking
app.post('/api/products/:productId/bookings', verifyToken, async (req, res) => {
  try {
    const productId = req.params.productId;
    const { startDate, endDate, username, event, phoneNumber, calculatedPrice, } = req.body;

    const product = await YourModel.Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create a new booking
    const newBooking = await YourModel.BookingModel.create({
      startDate,
      endDate,
      username,
      event,
      name: product.name,
      price: product.price,
      TotalPrice: calculatedPrice,
      phoneNumber,
      productId: productId,
      status: 'Active',
    });

    // Update the product's booking array
    product.booking.push(newBooking);
    await product.save();

    // Update the user's orderHistory
    const user = await YourModel.User.findOne({ username });

    if (user) {
      user.orderHistory.push(newBooking);
      await user.save();
    }

    res.json(newBooking);
  } catch (error) {
    console.error('Error adding booking:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
  
});

//fetch userBookings
// ...

// Fetch bookings by username and arrange by time booked
app.get('/api/bookings/:username', verifyToken, async (req, res) => {
  try {
    const username = req.params.username;

    // Find the user by username
    const user = await YourModel.User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch bookings from BookingModel for the given username
    const orderHistory = await YourModel.BookingModel.find({ username });

    // Sort bookings by start date in ascending order
    const sortedBookings = orderHistory.sort((a, b) => a.startDate - b.startDate);

    res.json(sortedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});



// Delete Booking
app.delete('/api/products/:productId/bookings/:bookingId', verifyToken, async (req, res) => {
  try {
    const productId = req.params.productId;
    const bookingId = req.params.bookingId;
    const username = req.body.username; // Assuming you include the username in the request body

    // Find the product by productId
    const product = await YourModel.Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the booking by bookingId
    const booking = await YourModel.BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if the user is authorized to delete the booking
    if (booking.username !== username) {
      return res.status(403).json({ error: 'Unauthorized: User does not own this booking' });
    }

    // Remove the booking from the product's booking array
    product.booking = product.booking.filter((b) => b.toString() !== bookingId);
    await product.save();

    // Remove the booking from the user's orderHistory
    const user = await YourModel.User.findOne({ username });

    if (user) {
      user.orderHistory = user.orderHistory.filter((b) => b.toString() !== bookingId);
      await user.save();
    }

    // Delete the booking from the BookingModel
    await YourModel.BookingModel.findByIdAndDelete(bookingId);

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


app.post('/api/products/:productId/addToFavorites', verifyToken, async (req, res) => {
  try {
    const userId = req.decodedToken.userId;
    const productId = req.params.productId;

    // Assuming you have a User model with a favourites array
    const user = await YourModel.User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the product is already in favourites
    const product = await YourModel.Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!user.favourites.some((fav) => fav.productId && fav.productId.equals(productId))) {
      const newFavorite = {
        productId: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
      };

      user.favourites.push(newFavorite);
      await user.save();

      return res.status(200).json({ message: 'Product added to favourites', user });
    } else {
      return res.status(400).json({ error: 'Product already in favourites' });
    }
  } catch (error) {
    console.error('Error adding to favourites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Remove from favorites route
app.delete('/api/products/:productId/removeFromFavorites', verifyToken, async (req, res) => {
  try {
    const userId = req.decodedToken.userId;
    const productId = req.params.productId;

    // Assuming you have a User model with a favorites array
    const user = await YourModel.User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the product is in favorites
    if (user.favorites.includes(productId)) {
      user.favorites = user.favorites.filter(favId => favId.toString() !== productId);
      await user.save();

      return res.status(200).json({ message: 'Product removed from favorites', user });
    } else {
      return res.status(400).json({ error: 'Product not found in favorites' });
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch user favorites
app.get('/api/users/:username/favorites', verifyToken, async (req, res) => {
  try {
    const username = req.params.username;

    // Find the user by username
    const user = await YourModel.User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user's favorites
    res.json(user.favourites);
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


//Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalExtension = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + originalExtension); // Save with original extension
  },
});

const upload = multer({
  limits: {
    fileSize: 100000,
  },

  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'images' || file.fieldname === 'videos') {
      cb(null, true);
    } else {
      cb(new Error('Unexpected field'));
    }
  },
});

// Endpoint for file upload
app.post('/api/upload', upload.single('images'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path; // Use the file path on the server
  console.log('File path:', filePath);

  // Adjust the file path to remove the "public" part
  const relativePath = filePath.replace('public/', '');

  res.json({ filePath: relativePath });
});

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// ... (Add other routes for updating, deleting, etc.)


app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  console.log('Request body:', req.body);
  console.log('Request query parameters:', req.query);

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  next(); 
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
