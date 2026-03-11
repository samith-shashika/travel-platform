# Wandr — Travel Experience Listing Platform

## Project Overview

Wandr is a full-stack web platform where travel experience providers can create an account, log in, and publish their travel experiences. Travelers can browse a public feed to discover unique local experiences around the world. Users can create listings with images, locations, descriptions, and pricing. They can also like, edit, and delete their own listings. It is a simple marketplace-style application built for both experience providers and travelers.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | Frontend UI + Backend API routes built on Node.js. Replaces a separate Express server with a cleaner single-project approach |
| **Node.js** | Runtime that powers Next.js and all API routes |
| **MongoDB** | Database to store users and listings |
| **Mongoose** | MongoDB object modeling and schema validation |
| **NextAuth.js** | Authentication — email/password and Google Sign In |
| **bcryptjs** | Secure password hashing |
| **Cloudinary** | Image uploads and cloud image hosting |
| **Tailwind CSS** | Styling and responsive UI |
| **date-fns** | Formatting post timestamps |
| **Vercel** | Deployment and hosting |

> **Note on stack choice:** The recommended stack was MongoDB, Express, Next.js, and Node.js. In this project, Next.js API routes replace Express — they run on Node.js and do everything Express would do, but in a cleaner single-project setup with no separate server needed.

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/travel-platform.git
cd travel-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env.local` file in the root of the project and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**How to get each value:**
- `MONGODB_URI` — Create a free cluster at [mongodb.com](https://mongodb.com) and copy the connection string
- `NEXTAUTH_SECRET` — Run `openssl rand -base64 32` in your terminal
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — Create a free account at [cloudinary.com](https://cloudinary.com) and set up an unsigned upload preset

### 4. Run the development server
```bash
npm run dev
```

### 5. Open in browser
```
http://localhost:3000
```

---

## Features Implemented

### Core Features
- User registration with name, email, and password
- User login with email and password
- Google Sign In with one click
- Password show and hide toggle on login and register pages
- Log out from any page using the navbar
- Create a travel experience listing with title, location, image, description, and price
- Public feed showing all listings from newest to oldest
- Listing detail page showing full information including creator name and time posted

### Optional Features
- ✅ Edit listing — only the owner can edit their own listing
- ✅ Delete listing — only the owner can delete, with a confirmation popup
- ✅ Search listings — search by title or location from the feed page
- ✅ Like and unlike a listing — requires login, toggle on the detail page
- ✅ Responsive mobile UI — works on all screen sizes including mobile
- ✅ Load more pagination — feed loads 9 listings at a time with a load more button
- ✅ Image upload — users upload real images via Cloudinary instead of entering a URL

---

## Architecture & Key Decisions

### Why I chose this technology stack
I chose Next.js because it handles both the frontend and backend in a single project, which keeps the codebase clean and simple. It also deploys very easily on Vercel with zero configuration. Instead of running a separate Express server, I used Next.js API routes which run on Node.js and do everything Express would do. This means one codebase, one deployment, and less complexity. MongoDB was chosen because travel listing data fits naturally as documents, and Mongoose makes it easy to define schemas and validate data.

### How authentication works
When a user registers, their password is hashed using bcryptjs before saving to the database. When they log in, NextAuth.js checks the email and compares the hashed password using bcrypt. After a successful login, NextAuth creates a JWT session token stored in the browser cookie. This token is verified on every protected API request using `getServerSession()`. Google Sign In is also handled through NextAuth — when a user signs in with Google for the first time, an account is automatically created in MongoDB using their Google name and email.

### How travel listings are stored in the database
Each listing is stored as a document in a MongoDB collection called `listings` using a Mongoose schema. The schema stores the title, location, image URL from Cloudinary, description, price, an array of user IDs who liked it, and a reference to the creator using their MongoDB ObjectId. The creator's name is also stored directly on the listing document so the feed does not need a separate database query to display who posted it. Two indexes are added — one on `createdAt` for fast sorting newest first, and one text index on title, location, and description for fast search queries.

### One improvement I would implement with more time
I would add a user profile page where each user can see all their own listings in one place, edit their display name and profile photo, and track how many total likes they have received. This would make the platform feel more personal and give experience providers a way to manage everything from one place.

---

## Product Thinking — Scaling to 10,000 Listings

If this platform had 10,000 travel listings, I would make several changes to keep it fast and easy to use. First, I would make sure all database fields used for searching and sorting have proper indexes, especially title, location, and createdAt, so queries stay fast as data grows. I would replace the basic text search with MongoDB Atlas Search or a dedicated search tool like Algolia, which gives faster and smarter results including typo tolerance and filters. I would add filter options on the feed page so users can narrow down results by location, price range, and most liked without scrolling through everything. For performance, I would add API response caching using tools like Redis so popular listing requests are served from memory instead of hitting the database every time. I would also move the feed page to server-side rendering so the first page load is fast and search engines can index all listings for better SEO. Images would be automatically optimized through Cloudinary to serve the right size depending on the user's screen. Finally, I would consider adding infinite scroll on the feed instead of the load more button, which feels more natural on mobile and keeps users engaged longer.
