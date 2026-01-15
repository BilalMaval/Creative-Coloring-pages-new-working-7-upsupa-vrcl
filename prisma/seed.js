// Seed script for 3 main categories + 36 subcategories (12 each)
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categoriesData = [
  // MAIN CATEGORY 1: COLORING PAGES
  {
    name: 'Coloring Pages',
    slug: 'coloring-pages',
    description: 'Free printable coloring pages for kids and adults',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    order: 1,
    children: [
      { name: 'Animals & Pets', slug: 'animals-pets', description: 'Cute animals, butterflies, and pets', image: '', order: 1 },
      { name: 'Disney Characters', slug: 'disney-characters', description: 'Disney princesses and characters', image: '', order: 2 },
      { name: 'Video Games', slug: 'video-games', description: 'Minecraft, Pokemon, Sonic, Roblox', image: '', order: 3 },
      { name: 'Cartoons & TV', slug: 'cartoons-tv', description: 'Bluey, Paw Patrol, Peppa Pig', image: '', order: 4 },
      { name: 'Fantasy & Magic', slug: 'fantasy-magic', description: 'Unicorns, dragons, fairies', image: '', order: 5 },
      { name: 'Holidays', slug: 'holidays', description: 'Christmas, Halloween, Easter', image: '', order: 6 },
      { name: 'Educational', slug: 'educational', description: 'ABC, Numbers, Shapes', image: '', order: 7 },
      { name: 'Mandalas', slug: 'mandalas', description: 'Beautiful mandala designs', image: '', order: 8 },
      { name: 'Nature & Flowers', slug: 'nature-flowers', description: 'Flowers, trees, gardens', image: '', order: 9 },
      { name: 'Vehicles', slug: 'vehicles', description: 'Cars, trucks, planes, trains', image: '', order: 10 },
      { name: 'Sports', slug: 'sports', description: 'Soccer, basketball, swimming', image: '', order: 11 },
      { name: 'Food & Treats', slug: 'food-treats', description: 'Ice cream, cupcakes, fruits', image: '', order: 12 }
    ]
  },
  
  // MAIN CATEGORY 2: CALENDARS
  {
    name: 'Calendars',
    slug: 'calendars',
    description: 'Free printable calendars and planners',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800',
    order: 2,
    children: [
      { name: '2025 Calendar', slug: '2025-calendar', description: 'Full year 2025 calendar', image: '', order: 1 },
      { name: 'Monthly Calendars', slug: 'monthly-calendars', description: 'Month by month calendars', image: '', order: 2 },
      { name: 'Weekly Planners', slug: 'weekly-planners', description: 'Weekly planning templates', image: '', order: 3 },
      { name: 'Daily Planners', slug: 'daily-planners', description: 'Daily planning pages', image: '', order: 4 },
      { name: 'Academic Calendar', slug: 'academic-calendar', description: 'School year calendars', image: '', order: 5 },
      { name: 'Birthday Calendar', slug: 'birthday-calendar', description: 'Track birthdays and events', image: '', order: 6 },
      { name: 'Meal Planners', slug: 'meal-planners', description: 'Weekly meal planning', image: '', order: 7 },
      { name: 'Habit Trackers', slug: 'habit-trackers', description: 'Track your daily habits', image: '', order: 8 },
      { name: 'Goal Planners', slug: 'goal-planners', description: 'Set and track goals', image: '', order: 9 },
      { name: 'Fitness Trackers', slug: 'fitness-trackers', description: 'Workout and fitness logs', image: '', order: 10 },
      { name: 'Budget Planners', slug: 'budget-planners', description: 'Financial planning sheets', image: '', order: 11 },
      { name: 'Blank Calendars', slug: 'blank-calendars', description: 'Customizable blank templates', image: '', order: 12 }
    ]
  },
  
  // MAIN CATEGORY 3: PRINTABLES
  {
    name: 'Printables',
    slug: 'printables',
    description: 'Free printable templates and worksheets',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
    order: 3,
    children: [
      { name: 'Worksheets', slug: 'worksheets', description: 'Educational worksheets for kids', image: '', order: 1 },
      { name: 'Flashcards', slug: 'flashcards', description: 'Learning flashcards', image: '', order: 2 },
      { name: 'Certificates', slug: 'certificates', description: 'Award certificates', image: '', order: 3 },
      { name: 'Greeting Cards', slug: 'greeting-cards', description: 'Birthday and occasion cards', image: '', order: 4 },
      { name: 'Gift Tags', slug: 'gift-tags', description: 'Printable gift tags', image: '', order: 5 },
      { name: 'Party Decorations', slug: 'party-decorations', description: 'Banners, bunting, decorations', image: '', order: 6 },
      { name: 'Labels & Stickers', slug: 'labels-stickers', description: 'Organizational labels', image: '', order: 7 },
      { name: 'Bookmarks', slug: 'bookmarks', description: 'Printable bookmarks', image: '', order: 8 },
      { name: 'Wall Art', slug: 'wall-art', description: 'Printable posters and art', image: '', order: 9 },
      { name: 'Checklists', slug: 'checklists', description: 'To-do lists and checklists', image: '', order: 10 },
      { name: 'Invitations', slug: 'invitations', description: 'Party invitations', image: '', order: 11 },
      { name: 'Games & Puzzles', slug: 'games-puzzles', description: 'Printable games and activities', image: '', order: 12 }
    ]
  }
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing categories...');
  await prisma.category.deleteMany({});

  // Create main categories and subcategories
  for (const mainCategory of categoriesData) {
    console.log(`\n📁 Creating main category: ${mainCategory.name}`);
    
    const { children, ...mainCategoryData } = mainCategory;
    
    const createdMainCategory = await prisma.category.create({
      data: {
        ...mainCategoryData,
        isActive: true
      }
    });

    console.log(`✅ Created: ${createdMainCategory.name} (${createdMainCategory.slug})`);

    // Create subcategories
    if (children && children.length > 0) {
      console.log(`   📂 Creating ${children.length} subcategories...`);
      
      for (const subCategory of children) {
        const createdSubCategory = await prisma.category.create({
          data: {
            ...subCategory,
            parentId: createdMainCategory.id,
            isActive: true
          }
        });
        
        console.log(`   ✅ ${createdSubCategory.name}`);
      }
    }
  }

  console.log('\n✨ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - 3 main categories created`);
  console.log(`   - 36 subcategories created (12 per main category)`);
  console.log(`   - Total: 39 categories`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
