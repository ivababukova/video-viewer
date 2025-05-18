# Video Library Application
A responsive full-stack application for browsing and managing a personal video library. 

The application features a Node.js/Express backend with SQLite storage and a React/TypeScript frontend built with Ant Design components.

## Setup and Running Instructions
### Prerequisites

Node.js (v14 or later)
npm (v6 or later)

### Database Setup

1. Place your video data JSON file in backend/data/videos.json with the following format:

```json
{
  "videos": [
    {
      "id": "1",
      "title": "Video 1",
      "thumbnail_url": "https://example.com/thumbnail1.jpg",
      "created_at": "2022-01-01T00:00:00.000Z",
      "duration": 120,
      "views": 100,
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

2. Populate the database with the initial data.

Run the following commands in your terminal:

```
# Navigate to backend directory
cd backend

# Initialize the database schema
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed the database with data
npm run seed   # or npm run seed if you've set up this script
```


3. Verify the data was imported correctly:

To view the contents of the now populated database, you can use PrismaStudio. Run the following commands in your terminal:

```
npm run view-db
```

Then go to http://localhost:5555/

### Starting the application

#### Backend
Run this in your terminal:
```
# In the backend directory
cd backend

# Install dependencies (if not done already)
npm install

# Start the development server
npm run dev
```
The backend API will be available at http://localhost:3001

#### Frontend
In a separate terminal tab, run this:
```
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies (if not done already)
npm install

# Start the development server
npm run dev
```
The frontend application will be available at http://localhost:3000

