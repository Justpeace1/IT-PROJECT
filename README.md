Feedback Collection System

A simple Node.js + Express + Redis feedback system with an admin dashboard for viewing, marking, and managing feedback messages.

🚀 Features

Users can:

Submit feedback with name, email, message, subscription option

Get a success message after submission

Admin can:

View all feedbacks in a neat table (newest first)

Click to open messages in a modal popup

See which messages are Unread (highlighted) vs Read (normal)

Auto-mark messages as read when opened

Delete feedbacks permanently

🛠️ Tech Stack

Backend: Node.js, Express.js

Database: Redis (for feedback storage)

Frontend: HTML, CSS, Vanilla JS

Styling: Custom CSS (with light/dark support for admin)

📊 API Endpoints
Method	Endpoint	Description
POST	/feedback	Submit feedback
GET	/api/feedbacks	Get all feedbacks
POST	/api/feedbacks/read	Mark a feedback as read
POST	/api/feedbacks/delete	Delete a feedback by ID
🖼️ Screenshots

User Form

Collects name, email, message, and subscription option

Admin Dashboard

Feedback table with unread highlighting

Modal popup with full message view

Delete button per message

📌 To-Do / Improvements

 Add Mark as Unread option

 Add authentication for admin page

 Add export to CSV/Excel feature

 Deploy to Vercel / Render with Redis Cloud

👨‍💻 Author

Built by EZINNE PEACE SILAS.