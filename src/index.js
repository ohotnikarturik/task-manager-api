const app = require('./app')

// for deployment to heroku and development mode
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is up on server: ${port}`);
});

