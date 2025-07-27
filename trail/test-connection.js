const mongoose = require('mongoose');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://jeremiahtetteh2008:Jeremiah2008@cluster0.8yezoph.mongodb.net/mathcenter', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
  console.log('Database name: mathcenter');
  
  // List collections
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    if (err) {
      console.error('Error listing collections:', err);
      return;
    }
    
    console.log('\nCollections in database:');
    if (collections.length === 0) {
      console.log('No collections found (this is normal for a new database)');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Close connection
    mongoose.connection.close(() => {
      console.log('\nConnection closed.');
      process.exit(0);
    });
  });
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});