// Seed script to populate kid-friendly categories based on MondayMandala
const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'printables_db';

const categories = [
  {
    name: 'Animals & Pets',
    slug: 'animals-pets',
    description: 'Cute animals, pets, butterflies, unicorns and more! Perfect for animal lovers.',
    image: ''
  },
  {
    name: 'Disney Characters',
    slug: 'disney-characters',
    description: 'Disney princesses, Mickey Mouse, and all your favorite Disney friends!',
    image: ''
  },
  {
    name: 'Video Games',
    slug: 'video-games',
    description: 'Minecraft, Pokemon, Sonic, Roblox and popular video game characters!',
    image: ''
  },
  {
    name: 'Cartoons & TV Shows',
    slug: 'cartoons-tv',
    description: 'Bluey, Paw Patrol, Peppa Pig and your favorite cartoon characters!',
    image: ''
  },
  {
    name: 'Fantasy & Magic',
    slug: 'fantasy-magic',
    description: 'Unicorns, dragons, fairies, mermaids and magical creatures!',
    image: ''
  },
  {
    name: 'Holidays & Seasons',
    slug: 'holidays-seasons',
    description: 'Christmas, Halloween, Easter, Valentine\'s Day and seasonal fun!',
    image: ''
  },
  {
    name: 'Educational & Learning',
    slug: 'educational-learning',
    description: 'ABC letters, numbers, shapes and learning activities for kids!',
    image: ''
  },
  {
    name: 'Mandalas',
    slug: 'mandalas',
    description: 'Beautiful mandala designs - simple for kids, complex for adults!',
    image: ''
  },
  {
    name: 'Nature & Flowers',
    slug: 'nature-flowers',
    description: 'Flowers, trees, gardens, ocean scenes and beautiful nature!',
    image: ''
  },
  {
    name: 'Vehicles & Transportation',
    slug: 'vehicles-transportation',
    description: 'Cars, trucks, planes, trains, boats and all kinds of vehicles!',
    image: ''
  },
  {
    name: 'Sports & Activities',
    slug: 'sports-activities',
    description: 'Soccer, basketball, swimming and fun sports activities!',
    image: ''
  },
  {
    name: 'Food & Treats',
    slug: 'food-treats',
    description: 'Ice cream, cupcakes, fruits and yummy food coloring pages!',
    image: ''
  }
];

async function seedCategories() {
  let client;
  
  try {
    client = await MongoClient.connect(MONGO_URL);
    const db = client.db(DB_NAME);
    const collection = db.collection('categories');
    
    // Check if categories already exist
    const count = await collection.countDocuments();
    
    if (count > 0) {
      console.log(`✅ Database already has ${count} categories. Skipping seed.`);
      return;
    }
    
    // Insert categories
    for (const category of categories) {
      category.createdAt = new Date();
      await collection.insertOne(category);
      console.log(`✅ Created category: ${category.name}`);
    }
    
    console.log(`\n🎉 Successfully seeded ${categories.length} categories!`);
    console.log('📝 Categories created:');
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (/${cat.slug})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

seedCategories();
