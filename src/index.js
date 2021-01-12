const express = require("express");
require('./db/mongoose')

const User = require('./models/user')

const app = express();
//for deployment on heroku
const port = process.env.PORT || 3000;
//parsing incoming json objects
app.use(express.json())

app.post("/users", (req, res) => {
  const user = new User(req.body)
  
  user.save().then(() => {
    res.send(user)
  }).catch((error) => {
    res.status(400).send(error)
  })
  
});

app.listen(port, () => {
  console.log(`Server is up on server: ${port}`);
});
