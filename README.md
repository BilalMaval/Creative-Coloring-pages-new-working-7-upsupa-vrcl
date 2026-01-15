# Free Printable Coloring Pages & Mandalas Platform

A complete, production-ready website for free printable coloring pages and mandala designs. Built with Next.js, MongoDB, and modern web technologies.

## 🎨 Features

### Public Features
- **Homepage** with featured categories and latest printables
- **Category Pages** with pagination and SEO optimization
- **Printable Detail Pages** with download tracking
- **Search Functionality** with filters and full-text search
- **Static Pages**: About, Contact, Privacy Policy, Terms of Service
- **404 Error Page** with helpful navigation

### Admin Panel
- **Secure Authentication** (email + password)
- **Category Management**: Create, edit, delete categories
- **Printable Management**: Upload images and PDFs, manage metadata
- **Page Editor**: Edit static page content (About, Privacy, Terms)
- **Dashboard**: View statistics and quick actions
- **File Upload**: Local storage for images and PDFs

### SEO Features
- **Server-Side Rendering** for all public pages
- **Dynamic Meta Tags** (title, description, keywords)
- **Open Graph** and Twitter Card tags
- **JSON-LD Schemas**: WebSite, BreadcrumbList, Article
- **Auto-Generated Sitemap** (sitemap.xml)
- **Robots.txt** with proper directives
- **Canonical URLs** on all pages
- **Image Alt Tags** from titles
- **Mobile-First Design**

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **File Storage**: Local filesystem (S3-compatible ready)
- **Deployment**: Emergent.sh compatible

## 📁 Project Structure

```
/app
├── app/
│   ├── page.js                    # Homepage
│   ├── layout.js                  # Root layout with SEO
│   ├── not-found.js               # 404 page
│   ├── category/[slug]/page.js    # Category pages
│   ├── printable/[slug]/page.js   # Printable detail pages
│   ├── search/page.js             # Search page
│   ├── about/page.js              # About page
│   ├── contact/page.js            # Contact page
│   ├── privacy-policy/page.js     # Privacy policy
│   ├── terms-of-service/page.js   # Terms of service
│   ├── admin/
│   │   ├── page.js                # Admin dashboard
│   │   ├── login/page.js          # Admin login
│   │   ├── categories/page.js     # Category management
│   │   ├── printables/page.js     # Printable management
│   │   └── pages/page.js          # Page content editor
│   ├── api/
│   │   ├── categories/route.js    # Categories CRUD
│   │   ├── printables/route.js    # Printables CRUD
│   │   ├── printables/[slug]/route.js
│   │   ├── search/route.js        # Search endpoint
│   │   ├── contact/route.js       # Contact form
│   │   ├── upload/route.js        # File upload
│   │   ├── pages/route.js         # Page content CRUD
│   │   └── auth/
│   │       ├── login/route.js     # Authentication
│   │       └── logout/route.js
│   ├── sitemap.xml/route.js       # Dynamic sitemap
│   └── robots.txt/route.js        # Robots.txt
├── components/
│   ├── Header.js                  # Site header
│   ├── Footer.js                  # Site footer
│   ├── PrintableCard.js           # Printable card component
│   ├── CategoryCard.js            # Category card component
│   ├── Breadcrumbs.js             # Breadcrumb navigation
│   ├── SearchBar.js               # Search component
│   ├── AdminLayout.js             # Admin panel layout
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── db.js                      # MongoDB connection
│   ├── auth.js                    # Authentication helpers
│   ├── seo.js                     # SEO utilities
│   ├── upload.js                  # File upload utilities
│   └── utils-server.js            # Server utilities
└── public/
    └── uploads/                   # Uploaded files storage
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB instance
- Yarn package manager

### Environment Variables

The following environment variables are already configured in `/app/.env`:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=your_database_name
NEXT_PUBLIC_BASE_URL=https://mandala-maker-2.preview.emergentagent.com
CORS_ORIGINS=*
```

### Installation

1. Install dependencies:
```bash
cd /app
yarn install
```

2. Start the development server:
```bash
yarn dev
```

3. For production:
```bash
yarn build
yarn start
```

## 👤 Default Admin Credentials

**Important**: Change these after first login!

- **Email**: admin@printables.com
- **Password**: admin123

Access the admin panel at: `/admin/login`

## 📊 Database Collections

### categories
```javascript
{
  _id: String,
  name: String,
  slug: String (unique, indexed),
  description: String,
  image: String (URL),
  createdAt: Date
}
```

### printables
```javascript
{
  _id: String,
  title: String,
  slug: String (unique, indexed),
  description: String,
  tags: Array<String>,
  image: String (URL),
  pdf_url: String (URL),
  category_id: String (indexed),
  downloads: Number,
  createdAt: Date (indexed)
}
```

### pages
```javascript
{
  _id: String,
  slug: String (unique, indexed),
  title: String,
  body: String (HTML content),
  createdAt: Date
}
```

### users
```javascript
{
  _id: String,
  email: String (unique, indexed),
  password: String (SHA-256 hashed),
  role: String,
  createdAt: Date
}
```

### contacts
```javascript
{
  _id: String,
  name: String,
  email: String,
  message: String,
  createdAt: Date
}
```

## 🎯 API Endpoints

### Public Endpoints

#### Categories
- `GET /api/categories` - List all categories

#### Printables
- `GET /api/printables?category=ID&page=1&limit=12` - List printables
- `GET /api/printables/[slug]` - Get single printable
- `POST /api/printables/[slug]` - Increment download count

#### Search
- `GET /api/search?q=query&category=ID&page=1` - Search printables

#### Contact
- `POST /api/contact` - Submit contact form

#### Pages
- `GET /api/pages?slug=about` - Get page content

### Admin Endpoints

#### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

#### Categories (Admin)
- `POST /api/categories` - Create category
- `PUT /api/categories` - Update category
- `DELETE /api/categories?id=ID` - Delete category

#### Printables (Admin)
- `POST /api/printables` - Create printable
- `PUT /api/printables` - Update printable
- `DELETE /api/printables?id=ID` - Delete printable

#### Upload
- `POST /api/upload` - Upload file (image or PDF)

#### Pages (Admin)
- `POST /api/pages` - Create/update page

## 🎨 Design & UX

- **Mobile-First**: Fully responsive design
- **Dark Mode**: Automatic based on system preference
- **Accessible**: WCAG compliant contrast and navigation
- **Fast Loading**: Optimized images and lazy loading
- **Clean Typography**: Easy-to-read fonts
- **Intuitive Navigation**: Clear hierarchy and breadcrumbs

## 🔍 SEO Best Practices Implemented

1. **Server-Side Rendering**: All pages render on server for better indexing
2. **Semantic HTML**: Proper heading hierarchy (H1, H2, etc.)
3. **Meta Tags**: Dynamic title, description, and keywords
4. **Structured Data**: JSON-LD schemas for rich snippets
5. **Sitemap**: Auto-generated XML sitemap
6. **Robots.txt**: Proper crawling directives
7. **Canonical URLs**: Prevents duplicate content issues
8. **Image Optimization**: Alt tags and lazy loading
9. **Internal Linking**: Strategic cross-linking
10. **Mobile-Friendly**: Responsive design passes Google's test
11. **Page Speed**: Optimized for fast loading
12. **Keyword-Rich Content**: SEO-optimized text on all pages

## 📝 Content Management

### Adding Categories
1. Log in to admin panel
2. Go to "Categories"
3. Click "New Category"
4. Fill in name, description, and upload image
5. Slug is auto-generated from name

### Adding Printables
1. Ensure at least one category exists
2. Go to "Printables"
3. Click "New Printable"
4. Fill in details:
   - Title (auto-generates slug)
   - Category
   - Description
   - Tags (comma-separated)
   - Preview image (JPG, PNG, WEBP)
   - PDF file
5. Click "Create"

### Editing Static Pages
1. Go to "Pages" in admin
2. Select tab (About, Privacy, Terms)
3. Edit content (HTML supported)
4. Preview before saving
5. Click "Save Changes"

## 🚢 Deployment

This application is configured for deployment on **Emergent.sh**:

1. The app uses the correct environment variables
2. MongoDB connection is properly configured
3. File uploads are stored in `/app/public/uploads`
4. All routes use the `/api` prefix for proper routing
5. The app runs on port 3000

### Deployment Checklist

- [x] Environment variables configured
- [x] Database indexes created automatically
- [x] Admin user created on first run
- [x] File upload directory configured
- [x] API routes properly prefixed
- [x] SEO metadata configured
- [x] Sitemap and robots.txt working

## 🔐 Security Features

1. **Password Hashing**: SHA-256 encryption
2. **HTTP-Only Cookies**: For session management
3. **CORS Configuration**: Controlled origins
4. **Input Validation**: On all forms and APIs
5. **File Type Validation**: Only allowed file types
6. **Admin Routes Protected**: Authentication required
7. **SQL Injection Prevention**: MongoDB parameterized queries
8. **XSS Protection**: React's built-in escaping

## 🐛 Troubleshooting

### Database Connection Issues
- Check `MONGO_URL` in `.env`
- Ensure MongoDB is running
- Check network connectivity

### File Upload Issues
- Ensure `/app/public/uploads` directory exists
- Check file size limits (5MB images, 10MB PDFs)
- Verify file type (images: JPG, PNG, WEBP; PDFs only)

### Admin Login Issues
- Use default credentials: admin@printables.com / admin123
- Clear browser cookies
- Check network tab for API errors

## 📈 Performance Optimization

1. **Image Optimization**: Next.js Image component
2. **Code Splitting**: Automatic with Next.js
3. **Lazy Loading**: Images and components
4. **Database Indexing**: On frequently queried fields
5. **Caching**: HTTP cache headers on static resources
6. **CDN Ready**: Static files can be moved to CDN

## 🔄 Future Enhancements (Optional)

- [ ] Newsletter integration (Mailchimp/SendGrid)
- [ ] Advanced search filters
- [ ] User accounts and favorites
- [ ] Comments on printables
- [ ] Social sharing buttons
- [ ] Analytics integration
- [ ] Email notifications for contact form
- [ ] Multi-language support
- [ ] Print preview feature
- [ ] Batch upload functionality

## 📄 License

This project is provided as-is for educational and commercial use.

## 🤝 Support

For issues or questions:
1. Check the documentation above
2. Review the code comments
3. Test API endpoints with curl
4. Check browser console for errors

## 🎉 Getting Started Guide

### Step 1: Access the Site
Visit the homepage to see the empty state with instructions.

### Step 2: Log In to Admin
1. Go to `/admin/login`
2. Use default credentials
3. You'll be redirected to the dashboard

### Step 3: Create Categories
1. Click "Categories" in sidebar
2. Create 3-5 categories (e.g., Animals, Mandalas, Nature, Holiday, Kids)
3. Upload images for each category

### Step 4: Upload Printables
1. Click "Printables" in sidebar
2. Create multiple printables
3. Upload both preview image and PDF for each
4. Add descriptive titles and tags

### Step 5: Customize Pages
1. Click "Pages" in sidebar
2. Edit About, Privacy, and Terms content
3. Add your own information

### Step 6: Test Public Site
1. Open site in new tab
2. Browse categories
3. Test search functionality
4. Download a printable
5. Check all pages load correctly

## ✅ Verification Checklist

- [x] Homepage loads correctly
- [x] All navigation links work
- [x] Admin login functions
- [x] Categories can be created
- [x] Printables can be uploaded
- [x] Search works
- [x] Contact form submits
- [x] SEO tags present
- [x] Sitemap generates
- [x] Robots.txt accessible
- [x] Mobile responsive
- [x] 404 page shows

---

**Built with ❤️ for Emergent.sh**