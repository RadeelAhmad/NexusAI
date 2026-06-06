# NexusAI

NexusAI is a lightweight AI chat application powered by the Gemini API. It provides a simple and user-friendly interface for interacting with Google's Gemini models while allowing users to manage API settings, model selection, and custom AI instructions.

## Features
🔐 Authentication
Secure login page
Default credentials:
Username: admin
Password: 1234
Optional Gemini API key configuration during setup
💬 AI Chat
Real-time conversations with Gemini AI
Clean and responsive chat interface
Maintains chat history during the session
⚙️ Configuration Panel

Customize the behavior of NexusAI through the configuration menu:

Change Gemini API Key
Select Gemini Model
Configure Custom System Prompt (AI Instructions)
Save configuration settings
🛠 Utilities
Clear chat history
Update API credentials
Switch between supported Gemini models
Modify AI behavior using custom instructions
Screenshots

Add screenshots here:

Login Page
Chat Interface
Configuration Panel
Default Login Credentials
Username: admin
Password: 1234

⚠️ It is recommended to change these credentials before deploying the application in a production environment.

Configuration Options
API Key

NexusAI requires a valid Gemini API key to communicate with Gemini models.

Example:

AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Model Selection

Supported models may include:

gemini-2.5-pro
gemini-2.5-flash
gemini-2.5-flash-lite

The available models depend on your Gemini API access.

System Prompt

The System Prompt allows you to define how the AI should behave.

Example:

You are a professional cybersecurity assistant specializing in penetration testing and network security.
Installation
Clone the Repository
git clone https://github.com/yourusername/NexusAI.git
cd NexusAI
Install Dependencies
npm install

or

pip install -r requirements.txt

(depending on your project stack)

Run the Application
npm start

or

python app.py
Usage
Step 1: Login

Enter the default credentials:

Username: admin
Password: 1234
Step 2: Configure API

Navigate to the Configuration section and enter your Gemini API key.

Step 3: Select Model

Choose your preferred Gemini model from the available options.

Step 4: Set AI Instructions

Define a custom system prompt to control AI behavior.

Step 5: Start Chatting

Open the chat interface and begin interacting with the AI assistant.

Project Structure
NexusAI/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── config/
├── public/
├── README.md
└── package.json
Security Notice
Never expose your Gemini API key publicly.
Store API keys securely using environment variables whenever possible.
Change default credentials before deploying to production.
Future Improvements
User registration system
Multiple user accounts
Chat history export
Theme customization
Voice interaction
File upload support
Local AI model integration
Conversation memory
Technologies Used
Gemini API
JavaScript / TypeScript
React / Next.js (if applicable)
HTML5
CSS3
Node.js
License

This project is licensed under the MIT License.
