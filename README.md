The application is a real-time chat application.

It is hosted [here](https://svelte-of1p.onrender.com).

This is my fifth programming project and my first time using a frontend JavaScript framework. It is built with Express.js, MongoDB, Bootstrap, and SvelteKit.

## Installation Instructions

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v14.x or later)
- [npm](https://www.npmjs.com/get-npm) 
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register)

### Clone the Repository

Clone the repository to your local machine

**Install Dependencies**

```
cd server
npm install
```

To start the SvelteKit application, navigate to the 'client' directory and run:
```
npm install
npm run dev
npm install
```

**Set Up Environment Variables**
Create a .env file in the 'server directory with the following content:
```
PORT=3000
MONGODB_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SECRET=
NODE_ENV=production
```

**Running the Application**

To start the Express.js server, navigate to the 'server' directory and run:

```
npm start
```

To start the SvelteKit application, navigate to the 'client' directory and run:

```
npm run dev
```
## Client-Side Functionalities

The client-side -
1. Handles formatting and categorizing messages based on the sender.
   
   ![WhatsApp Image 2024-07-22 at 17 54 42_977218ce](https://github.com/user-attachments/assets/430d4e14-0dfe-4d8c-85cb-0561e0e5fee6)

2. Uses WebSockets to establish a connection for real-time communication and fetches messages and user information from the backend using JWT-based authentication. The component also dynamically updates the chat content based on the currently selected user, ensuring that messages are saved and displayed correctly.
3. Uses a modal for user selection by fetching and displaying users based on input, while dynamically updating the UI and handling events for focusing and blurring the input field.

   ![WhatsApp Image 2024-07-22 at 13 55 38_7afdf8b7](https://github.com/user-attachments/assets/e7b8a9ad-d750-4ec2-ac02-f7086df97380)

4. Toggles the display of settings and a message modal, manages the background color based on modal visibility, updates the current chat user, and fetches selected users and user details from an API when the component mounts.

   ![WhatsApp Image 2024-07-22 at 13 25 30_526f6dbe](https://github.com/user-attachments/assets/23b5b9db-840a-45ee-92b9-dc0563dea218)

5. Manages a username selection form, including validation and availability checks. On mount, it verifies if the user already exists and redirects them to the messages page if they do; otherwise, it enables the form for new users. It also handles username validation, checks availability through an API, and submits the form, storing a new JWT token if successful.

   ![WhatsApp Image 2024-07-19 at 18 43 41_9d4c1276](https://github.com/user-attachments/assets/3faa21a4-0353-4bf7-b7ea-cb99e00628d1)


## Server-Side Functionalities

The server-side -

1. Handles Google authentication with Passport, redirecting users to either a messages or selection page based on their existence in the system, and includes a token in the redirect URL.
2. Provides endpoints for checking username availability and selecting a username for a temporary user, with validation and error handling. It ensures that usernames are unique, meet certain criteria, and assigns a new JWT token upon successful username selection and user creation.
3. Provides endpoints for sending and retrieving messages. The endpoints save a new message, broadcast it to connected WebSocket clients associated with the sender or recipient, and retrieves and returns all messages between the authenticated user and a specified recipient.
4. Retrieves and returns the authenticated user's selected contacts along with the most recent message for each contact, sorting the results by the timestamp of the last message.
5. Retrieves users that match a given username query, excluding the current user and already selected users, and returns a list of these users, handling errors appropriately.
6. Employs middleware that verifies a JWT from either headers or cookies, differentiates between fully registered and temporary users, and either attaches the user to the request or returns an unauthorized response based on token validity.
