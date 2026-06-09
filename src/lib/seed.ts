import dbConnect from "./mongodb";
import Product from "../models/Product";
import Artisan from "../models/Artisan";
import Category from "../models/Category";
import Review from "../models/Review";
import User from "../models/User";
import Order from "../models/Order";
import bcrypt from "bcryptjs";

const categories = [
  { name: "রান্নাঘরের পণ্য", productCount: 48, icon: "🍲" },
  { name: "ঘর সাজানো", productCount: 62, icon: "🏠" },
  { name: "বাগানের পণ্য", productCount: 35, icon: "🌱" },
  { name: "আলোকসজ্জা", productCount: 24, icon: "🕯" },
  { name: "উপহারের সামগ্রী", productCount: 40, icon: "🎁" },
  { name: "ঐতিহ্যবাহী সংগ্রহ", productCount: 51, icon: "🏺" },
];

const products = [
  // রান্নাঘরের পণ্য
  {
    name: "হস্তশিল্প মাটির হাঁড়ি",
    description: "ঐতিহ্যবাহী পদ্ধতিতে তৈরি এই মাটির হাঁড়ি রান্নাঘরের সৌন্দর্য বৃদ্ধির পাশাপাশি খাবারের পুষ্টিগুণ বজায় রাখে।",
    price: 350,
    originalPrice: 500,
    rating: 5,
    reviewsCount: 128,
    badge: "hot",
    icon: "🏺",
    category: "রান্নাঘরের পণ্য",
    isBestSelling: true,
    images: ["🏺"]
  },
  {
    name: "মাটির চা সেট (৬ পিস)",
    description: "মাটির কাপে চায়ের আড্ডা হবে আরও জমজমাট। এই সেটটিতে রয়েছে ৬টি কাপ এবং একটি আধুনিক ডিজাইনের কেটলি।",
    price: 850,
    originalPrice: 1200,
    rating: 5,
    reviewsCount: 203,
    badge: "sale",
    icon: "🫖",
    category: "রান্নাঘরের পণ্য",
    isBestSelling: true,
    images: ["🫖"]
  },
  {
    name: "মাটির পানির ফিল্টার",
    description: "প্রাকৃতিকভাবে পানি ঠান্ডা ও বিশুদ্ধ রাখতে মাটির ফিল্টারের কোনো বিকল্প নেই।",
    price: 1250,
    originalPrice: 1800,
    rating: 4,
    reviewsCount: 156,
    badge: "hot",
    icon: "🏺",
    category: "রান্নাঘরের পণ্য",
    isBestSelling: true,
    images: ["🏺"]
  },
  {
    name: "মাটির পিঠা বানানোর ছাঁচ",
    description: "শীতের পিঠা উৎসবের জন্য হাতে তৈরি ঐতিহ্যবাহী মাটির ছাঁচ।",
    price: 150,
    rating: 5,
    reviewsCount: 45,
    icon: "🥘",
    category: "রান্নাঘরের পণ্য",
    images: ["🥘"]
  },

  // ঘর সাজানো
  {
    name: "টেরাকোটা ফুলদানি",
    description: "দক্ষ কারিগরের নিপুণ ছোঁয়ায় তৈরি এই টেরাকোটা ফুলদানি আপনার ড্রয়িং রুমকে দেবে এক অভিজাত লুক।",
    price: 480,
    originalPrice: 650,
    rating: 4,
    reviewsCount: 84,
    badge: "new",
    icon: "🏺",
    category: "ঘর সাজানো",
    isBestSelling: true,
    images: ["🏺"]
  },
  {
    name: "সাজানোর মাটির ঘোড়া",
    description: "পোড়ামাটির তৈরি এই ঘোড়াটি লোকশিল্পের এক অনন্য নিদর্শন। ঘরের কোণে বা সেলফে এটি বেশ মানানসই।",
    price: 620,
    originalPrice: 800,
    rating: 5,
    reviewsCount: 67,
    icon: "🐴",
    category: "ঘর সাজানো",
    isBestSelling: true,
    images: ["🐴"]
  },
  {
    name: "নকশা করা মাটির ব্যাংক",
    description: "ছোটদের টাকা জমানোর অভ্যাস করতে নকশা করা রঙিন মাটির ব্যাংক।",
    price: 120,
    rating: 5,
    reviewsCount: 112,
    badge: "new",
    icon: "🐖",
    category: "ঘর সাজানো",
    images: ["🐖"]
  },

  // বাগানের পণ্য
  {
    name: "মাটির টব (মাঝারি)",
    description: "ছাদ বাগান বা বারান্দার জন্য উপযুক্ত পোড়ামাটির টব।",
    price: 250,
    rating: 4,
    reviewsCount: 92,
    icon: "🪴",
    category: "বাগানের পণ্য",
    images: ["🪴"]
  },
  {
    name: "ঝুলন্ত মাটির টব",
    description: "বারান্দায় ঝুলিয়ে রাখার জন্য শিকলসহ নকশা করা মাটির টব।",
    price: 380,
    originalPrice: 450,
    rating: 5,
    reviewsCount: 38,
    badge: "sale",
    icon: "🎋",
    category: "বাগানের পণ্য",
    images: ["🎋"]
  },

  // আলোকসজ্জা
  {
    name: "মাটির প্রদীপ সেট (১০ পিস)",
    description: "দীপাবলি বা যেকোনো উৎসবে আলোকসজ্জার জন্য হাতে তৈরি মাটির প্রদীপ।",
    price: 200,
    rating: 5,
    reviewsCount: 156,
    icon: "🪔",
    category: "আলোকসজ্জা",
    images: ["🪔"]
  },
  {
    name: "টেরাকোটা ল্যাম্প শেড",
    description: "মাটির ছিদ্রযুক্ত নকশার মধ্য দিয়ে আলো বেরিয়ে এসে ঘরে এক মায়াবী পরিবেশ তৈরি করবে।",
    price: 1500,
    originalPrice: 2000,
    rating: 5,
    reviewsCount: 24,
    badge: "hot",
    icon: "🏮",
    category: "আলোকসজ্জা",
    images: ["🏮"]
  }
];

const artisans = [
  {
    name: "রহিম মৃধা",
    village: "ধামরাই, ঢাকা",
    experience: "২৫ বছরের অভিজ্ঞতা",
    story: "ধামরাইয়ের মাটি দিয়ে তৈরি প্রতিটি পাত্রে তিনি ঢেলে দেন নিজের জীবনের অভিজ্ঞতা। ছোটবেলা থেকে বাবার হাত ধরে শেখা এই শিল্পকে তিনি বাঁচিয়ে রেখেছেন প্রজন্মের পর প্রজন্ম ধরে।",
  },
  {
    name: "রাবেয়া বেগম",
    village: "রাজশাহী",
    experience: "১৮ বছরের অভিজ্ঞতা",
    story: "রাজশাহীর ঐতিহ্যবাহী নকশায় টেরাকোটার পণ্য তৈরি করেন তিনি, যা আন্তর্জাতিক মানের। তাঁর হাতের ছোঁয়ায় মাটি যেন জীবন্ত হয়ে ওঠে নতুন রূপে।",
  }
];

export async function seedDatabase() {
  try {
    await dbConnect();

    // Clear existing data
    console.log("Cleaning database...");
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Artisan.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    // Insert categories
    console.log("Seeding categories...");
    await Category.insertMany(categories);

    // Insert products
    console.log("Seeding products...");
    const seededProducts = await Product.insertMany(products);

    // Insert artisans
    console.log("Seeding artisans...");
    await Artisan.insertMany(artisans);

    // Create a default customer user
    console.log("Creating default customer...");
    const hashedPassword = await bcrypt.hash("customer123", 12);
    const user = await User.create({
      name: "টেস্ট ইউজার",
      email: "user@example.com",
      password: hashedPassword,
      phone: "01711223344",
      address: "বাড়ি-১২, রোড-৫, ধানমন্ডি, ঢাকা",
    });

    // Create a sample order for this user
    console.log("Creating sample orders...");
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MP-${datePart}-${randomPart}`;

    await Order.create({
      orderNumber,
      userId: user._id,
      customer: {
        name: user.name,
        phone: user.phone,
        address: user.address,
      },
      items: [
        {
          productId: seededProducts[0]._id,
          name: seededProducts[0].name,
          price: seededProducts[0].price,
          qty: 2,
          icon: seededProducts[0].icon
        },
        {
          productId: seededProducts[1]._id,
          name: seededProducts[1].name,
          price: seededProducts[1].price,
          qty: 1,
          icon: seededProducts[1].icon
        }
      ],
      totalPrice: (seededProducts[0].price * 2) + seededProducts[1].price,
      status: "delivered",
    });

    console.log("Database seeded successfully!");
    console.log("----------------------------");
    console.log("Default Customer Login:");
    console.log("Email: user@example.com");
    console.log("Password: customer123");
    console.log("----------------------------");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
