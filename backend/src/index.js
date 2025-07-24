require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT
const mongoose = require('mongoose');
const cors = require('cors');
const userItemsRoutes = require('./routes/userItems');
const itemsRoutes = require('./routes/items');

app.use(express.json())
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB')
}).catch((err) => {
  console.log(err)
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/progress', require('./routes/progress'))
app.use('/api/v1/level-up', require('./routes/levelUp'))
app.use('/api/v1/energy', require('./routes/energy'))
app.use('/api/v1/items', itemsRoutes);
app.use('/api/v1/user-items', userItemsRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})