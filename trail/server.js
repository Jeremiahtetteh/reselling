const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");

// Initialize Firebase Admin
try {
  const serviceAccount = require("./firebase-service-account.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized");
} catch (error) {
  console.log("Firebase not configured, using email only");
}

const db = admin.firestore ? admin.firestore() : null;

// Email configuration
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: "jeremiahtetteh2008@gmail.com",
    pass: "MATHS CENTER", // You may need to use App Password instead
  },
});

// Function to send visitor notification
function sendVisitorNotification(visitorData) {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: "Jeremiahtetteh2008@gmail.com",
    subject: "New Visitor on MathCenter Website",
    html: `
      <h3>New Website Visitor</h3>
      <p><strong>Page:</strong> ${visitorData.page}</p>
      <p><strong>Time:</strong> ${new Date(
        visitorData.timestamp
      ).toLocaleString()}</p>
      <p><strong>User Agent:</strong> ${visitorData.userAgent}</p>
      <p><strong>Referrer:</strong> ${
        visitorData.referrer || "Direct visit"
      }</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Email error:", error);
    } else {
      console.log("Visitor notification sent:", info.response);
    }
  });
}

const app = express();
const PORT = 3000;

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://jeremiahtetteh2008:Jeremiah2008@cluster0.8yezoph.mongodb.net/mathcenter",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define schemas
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  duration: String,
  price: Number,
  filePath: String,
  thumbnailPath: String,
  addToCourse: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  imagePath: String,
  addToCourse: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);
const Product = mongoose.model("Product", productSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

const analyticsSchema = new mongoose.Schema({
  event: String,
  page: String,
  videoId: String,
  videoTitle: String,
  itemId: String,
  itemTitle: String,
  price: Number,
  userAgent: String,
  referrer: String,
  timestamp: { type: Date, default: Date.now },
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.post(
  "/api/videos",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files["video"] || !req.files["thumbnail"]) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Video and thumbnail files are required",
          });
      }

      const videoFile = req.files["video"][0];
      const thumbnailFile = req.files["thumbnail"][0];

      const video = new Video({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        duration: req.body.duration,
        price: parseFloat(req.body.price),
        filePath: "/uploads/" + videoFile.filename,
        thumbnailPath: "/uploads/" + thumbnailFile.filename,
        addToCourse: req.body.addToCourse === "true",
      });

      await video.save();

      res.status(201).json({
        success: true,
        id: video._id,
        title: video.title,
        videoPath: video.filePath,
        thumbnailPath: video.thumbnailPath,
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

app.get("/api/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/videos/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, error: "Video not found" });
    }

    // Delete files
    const filePath = path.join(__dirname, video.filePath);
    const thumbnailPath = path.join(__dirname, video.thumbnailPath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "Product image is required" });
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: parseFloat(req.body.price),
      imagePath: "/uploads/" + req.file.filename,
      addToCourse: req.body.addToCourse === "true",
    });

    await product.save();

    res.status(201).json({
      success: true,
      id: product._id,
      name: product.name,
      imagePath: product.imagePath,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    // Delete image file
    const imagePath = path.join(__dirname, product.imagePath);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const videos = await Video.find({ addToCourse: true }).sort({
      createdAt: -1,
    });
    const products = await Product.find({ addToCourse: true }).sort({
      createdAt: -1,
    });

    // Add type indicator
    const videoItems = videos.map((v) => ({ ...v.toObject(), type: "video" }));
    const productItems = products.map((p) => ({
      ...p.toObject(),
      type: "product",
    }));

    const courses = [...videoItems, ...productItems];
    res.json(courses);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const contact = new Contact({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/analytics/pageview", async (req, res) => {
  try {
    const visitorData = {
      event: "pageview",
      page: req.body.page,
      userAgent: req.body.userAgent,
      referrer: req.body.referrer,
      timestamp: req.body.timestamp,
    };

    const analytics = new Analytics(visitorData);
    await analytics.save();

    // Send email notification
    sendVisitorNotification(visitorData);

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/analytics/event", async (req, res) => {
  try {
    const analytics = new Analytics(req.body);
    await analytics.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/newsletter", async (req, res) => {
  try {
    const newsletter = new Newsletter({
      email: req.body.email,
    });

    await newsletter.save();

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter",
    });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ success: false, error: "Email already subscribed" });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

app.post("/api/firebase/visitor", async (req, res) => {
  try {
    const visitorData = {
      ...req.body,
      timestamp: new Date(),
    };

    // Save to Firebase if available
    if (db) {
      await db.collection("visitors").add(visitorData);
    }

    // Send email notification
    sendVisitorNotification(visitorData);

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/visitor-alert", async (req, res) => {
  try {
    const visitorData = req.body;

    // Send email notification immediately
    const mailOptions = {
      from: "jeremiahtetteh2008@gmail.com",
      to: "Jeremiahtetteh2008@gmail.com",
      subject: "🔔 New Visitor on MathCenter Website",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a80f0;">🎯 New Website Visitor!</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>📄 Page Visited:</strong> ${visitorData.page}</p>
            <p><strong>⏰ Time:</strong> ${new Date(
              visitorData.timestamp
            ).toLocaleString()}</p>
            <p><strong>🌐 Browser:</strong> ${
              visitorData.userAgent.split(" ")[0]
            }</p>
            <p><strong>📍 Came From:</strong> ${visitorData.referrer}</p>
          </div>
          <p style="color: #666; font-size: 14px;">This is an automated notification from your MathCenter website.</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Email notification failed:", error);
      } else {
        console.log(
          "✅ Visitor notification sent to Jeremiahtetteh2008@gmail.com"
        );
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
