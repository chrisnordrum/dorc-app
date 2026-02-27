# daily-quest-tracker
Daily Quest Tracker is a MERN stack RPG-style productivity app that turns habit-building into a game. Users create personal quests (habits or goals), earn XP for completing them, level up, unlock badges, and join guilds with friends to share progress and stay motivated.

## Setup Instructions

### Prerequisites
Make sure you have Node.js installed on your device.

### Installation

1. Clone the repository
```
git clone https://github.com/chrisnordrum/daily-quest-tracker.git
```

2. Go to the project directory within the terminal to install the dependencies:
```
cd server
npm install
cd ../client
npm install
```

3. Within the <code>server</code> directory, create a <code>config.env</code> file and copy the environment variables as shown in the <code>config.env.example</code> file
```
cp config.env.example config.env
```

### Development
1. Go to the project directory within the terminal to start the server
```
npm run dev
```

2. Open another terminal window, go to the project directory to start the client
```
cd client
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser during development (changes to React files appear instantly due to Hot Module Replacement (HMR))



### SSL Configuration
Which SSL setup method did you choose and why? Document your decision-making process in a short paragraph, highlighting any past experiences or expectations about each method.

We opted for a self-signed OpenSSL certificate as it was the easiest method at the time, and fit well into the in-class activities we had already done. We had also opted for this one as we were still in early local development phase, and didn't yet have a final build to properly secure. We didn't yet have experience with CertBot and Let's Encrypt just yet, but we will be looking into implementing those in future builds.

### Lessons Learned

Perhaps the hardest part about implementing HTTPS into the site was configuring it to be compatible with it in the first place. The server's VITE system required reconfiguring to properly feed the right files from the server.