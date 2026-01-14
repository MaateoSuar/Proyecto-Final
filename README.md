🐾 PetCare Hub
PetCare Hub is a full-stack platform designed to bridge the gap between pet owners and professional service providers. Whether you need a dog walker, a pet sitter, a groomer, or a veterinarian, this app provides a seamless way to find and book trusted experts for your furry friends.

This project was built to demonstrate proficiency in the MERN Stack, 3-Tier Architecture implementation, and Agile project management.

📸 Screenshots & Demo
Take a look at PetCare Hub in action. The interface is designed to be intuitive for both pet owners and service providers.

1. The Marketplace & Search
The core of the application, allowing users to browse and filter professionals based on their specific needs.

<div align="center"> <img src="Proyecto-Final/Screenshots/92shots_so.png" alt="Landing Page and Search" width="800px"> <p><em>Figure 1: Main Landing Page showing service categories.</em></p> </div>

2. Professional Profiles & Booking
Detailed profiles give owners confidence in who they are hiring.

<div align="center" style="display: flex; justify-content: space-around;"> <img src="Proyecto-Final/Screenshots/203shots_so.png" alt="Service Provider Profile" width="45%"> <img src="path/to/your/booking-modal-image.png" alt="Booking Flow" width="45%"> </div> <p align="center"><em>Figure 2: Left: A Walker's profile with reviews. Right: The appointment booking interface.</em></p>

3. Pet Profiles & Management
Owners can create and manage detailed profiles for their pets, including medical notes, habits, and photos, which are shared with service providers upon booking.

<div align="center"> <img src="Proyecto-Final/Screenshots/564shots_so.png" alt="Pet Profile View" width="800px"> <p><em>Figure 3: Detailed Pet Profile view with breed info, age, and special care instructions.</em></p> </div>

🚀 Key Features
Service Marketplace: Browse through categories including Walkers, Sitters, Groomers, and Vets.

Smart Filtering: Find professionals based on location, ratings, and specific services.

Dual Dashboard: * Pet Owners: Manage pet profiles, track bookings, and leave reviews.

Service Providers: Manage availability, services offered, and client requests.

Booking System: Real-time scheduling and appointment management.

Secure Authentication: User data protection using JWT (JSON Web Tokens).

🛠️ Tech Stack
This application is built using the MERN Stack:

Frontend: React.js (Hooks, Context API/Redux).

Backend: Node.js & Express.js.

Database: MongoDB (using Mongoose for data modeling).

State Management: (Optional: Insert Redux or Context API here).

Styling: (Optional: CSS Modules, Tailwind CSS, or Styled Components).

🏗️ Software Architecture: 3-Tier Pattern
The project follows a 3-Tier Architecture to ensure separation of concerns, scalability, and easy maintenance:

Presentation Tier (Frontend): Built with React. This layer handles the UI/UX and communicates with the backend via RESTful APIs.

Logic Tier (Backend): A Node.js/Express server that processes business rules, handles authentication, and manages the flow of data.

Data Tier (Database): MongoDB serves as the persistence layer, storing user information, pet records, and transaction history.

🏃 Agile Methodology: Scrum
This project was developed following Scrum principles to simulate a professional production environment:

Product Backlog: All features were broken down into detailed User Stories.

Sprints: Development was divided into iterative cycles to ensure continuous delivery of functional features.

Agile Board: Used (Trello/GitHub Projects) to manage the workflow: To Do, In Progress, Review, and Done.

🔧 Installation & Setup
Follow these steps to run the project locally:

Clone the repository:

Bash

git clone https://github.com/MaateoSuar/Proyecto-Final.git
Setup the Backend:

Navigate to the server folder.

Install dependencies: npm install.

Create a .env file and add your MONGODB_URI and JWT_SECRET.

Start the server: npm run dev.

Setup the Frontend:

Navigate to the client folder.

Install dependencies: npm install.

Start the development server: npm start.
