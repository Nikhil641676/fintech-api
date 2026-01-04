fintech-api/
│
├── src/
│   ├── app.js                  # Express app config
│   ├── server.js               # Server start
│
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── env.js              # Environment variables
│   │   ├── jwt.js              # JWT config
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── wallet.routes.js
│   │   ├── recharge.routes.js
│   │   ├── aeps.routes.js
│   │   ├── payout.routes.js
│   │   └── index.js            # All routes combine
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── wallet.controller.js
│   │   ├── recharge.controller.js
│   │   ├── aeps.controller.js
│   │   └── payout.controller.js
│
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Wallet.model.js
│   │   ├── Transaction.model.js
│   │   ├── Recharge.model.js
│   │   ├── Aeps.model.js
│   │   └── Payout.model.js
│
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── wallet.service.js
│   │   ├── recharge.service.js
│   │   ├── aeps.service.js
│   │   ├── payout.service.js
│   │   └── api.service.js      # Third-party fintech APIs
│
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.middleware.js
│   │   └── error.middleware.js
│
│   ├── utils/
│   │   ├── response.js         # Common API response
│   │   ├── logger.js           # Logs
│   │   ├── encryption.js       # AES / Hashing
│   │   ├── random.js           # TXN ID generator
│   │   └── apiLogger.js
│
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── recharge.validator.js
│   │   └── payout.validator.js
│
│   └── constants/
│       ├── statusCodes.js
│       ├── messages.js
│       └── roles.js
│
├── logs/
│   ├── api.log
│   └── error.log
│
├── .env
├── .gitignore
├── package.json
└── README.md
