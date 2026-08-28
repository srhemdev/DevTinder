# Dev Tinder APIs


authRouter
POST /signup
POST /login
POST /logout

profileRouter
GET /profile/view
PATCH / profile/edit

connectionRequestRouter
POST /request/send/interested/:userId
POST /request/send/ignore/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

userRouter
GET /user/connections
GET /user/requests/recieved
GET /user/feed - Gets you the profiles of other users


Status: ignore, interested, accepted, rejected

/feed?page=1&limit=10 => 1-20

/feed?page=2&limit=10 => 11-20

/feed?page=3&limit=10 => 21-30
