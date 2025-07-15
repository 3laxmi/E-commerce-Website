#  E-Commerce Website

This is a full-stack e-commerce website developed using **React.js**, **Node.js**, **Express**, **MongoDB**, and **Firebase/Cloudinary**. It allows users to browse products and enables admins to manage inventory and orders via an admin panel.

---

##  Live Demo

Coming soon...

 ##  localhost url
      http://localhost:5174/

---

## Project Structure

e-commerce/
├── frontend/ # React UI for users
├── backend/ # Node.js server with Express & MongoDB
├── admin/ # Admin panel for managing products and orders




---

##  Features

###  User Side
- Browse and search products
- Filter by category and subcategory
- Add to cart functionality
- User login and registration
- Responsive design

###  Admin Panel
- Add / Edit / Remove products
- Upload multiple product images
- Track and manage orders
- Bestseller toggle and size selection

---

##  Tech Stack

- **Frontend:** React.js, CSS, Material-UI (MUI)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Firebase or JWT (admin)
- **Cloud Storage:** Cloudinary for image upload
- **Version Control:** Git and GitHub

---

##  Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/3laxmi/E-commerce-Website.git
cd E-commerce-Website

cd backend
npm install
# Create a .env file with the following:
# MONGODB_URL=your_mongodb_uri
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
npm run dev

3. Frontend setup

cd ../frontend
npm install
npm start

4. Admin panel setup
cd ../admin
npm install
npm start


