import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Product from "./models/Product.js";

const demoProducts = [
  {
    title: "Calculus 1 Textbook",
    description: "Well-maintained used textbook for first-year engineering students.",
    price: 450,
    category: "Books",
    imageUrl:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Discrete Math Notes",
    description: "Neatly handwritten notes covering sets, logic, graphs, and proofs.",
    price: 120,
    category: "Notes",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Wireless Earbuds",
    description: "Almost new earbuds with charging case and decent battery life.",
    price: 1800,
    category: "Electronics",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9qfSfExD0gS5iJOP4o-NC16pqS0KTipGe1SSdYaOUCA&s",
  },
  {
    title: "Used Smartphone",
    description: "Well-kept smartphone with a good battery and clean display.",
    price: 14000,
    category: "Electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Smartwatch",
    description: "Reliable smartwatch with heart-rate tracking and fitness features.",
    price: 6500,
    category: "Electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Mini Fridge",
    description: "Compact mini fridge ideal for hostel rooms and study spaces.",
    price: 2600,
    category: "Hostel Items",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nnsXm0l6aIHovHsgEN9peKu_E0gCWrE_XXgoYu8eWA&s=10",
  },
  {
    title: "Mountain Bike",
    description: "Reliable bike for campus commuting and weekend rides.",
    price: 3200,
    category: "Cycles",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYzrTP7CQ_FZZcSZqyqaIFrDUf6lXDHIhelHxZXZWudg&s=10",
  },
  {
    title: "Protein Powder",
    description: "High-quality whey protein powder with a delicious vanilla flavor.",
    price: 2200,
    category: "Gym",
    imageUrl:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQCHJJ3FFUGh0swCfCHHcu930rJBXaIO3sRZOOQb_08uLC0FMmSaiIXUcNKPEpnTf--ZD4SmIKlfcbzN1Tc4yKtsxXHRG2m",
  },
  {
    title: "Study Lamp",
    description: "Adjustable desk lamp with warm LED light for late-night studying.",
    price: 650,
    category: "Other",
    imageUrl:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
  },
];

export async function seedDemoData() {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return;
    }

    const passwordHash = await bcrypt.hash("campus123", 10);
    const seller = await User.findOneAndUpdate(
      { email: "demo.seller@campusmarketplace.com" },
      {
        $setOnInsert: {
          name: "Demo Seller",
          email: "demo.seller@campusmarketplace.com",
          passwordHash,
          hostelBlock: "A-Block",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const products = await Product.insertMany(
      demoProducts.map((product) => ({ ...product, seller: seller._id }))
    );

    console.log(`Seeded ${products.length} demo products`);
  } catch (error) {
    console.error("Demo data seeding failed:", error.message);
  }
}
