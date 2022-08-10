import express from 'express'
import cors from 'cors'
const app = express()
const port = 3000
app.use(express.json())
app.use(cors())
let user = [];

app.post('/user', (req, res) => {
  
     console.log(req.body);

     user.push(req.body);
  
    res.send('User Created Account')
})

app.get('/user', (req, res) => {
    res.send(user)
  })

  app.put('/', (req, res) => {
    res.send('Hello World!')
  })

  app.delete('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})