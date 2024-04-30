const exp = require('express')
const app = exp()
const path = require('path')
const mclient = require('mongodb').MongoClient
const usersAPI = require('./APIs/usersAPI')
const authorsAPI = require('./APIs/authorsAPI')
const articlesAPI = require('./APIs/articlesAPI')
const cors = require('cors')

require('dotenv').config()

app.use(exp.json())
app.use(cors())

// let dburl = process.env.DBURL;

mclient.connect(`${process.env.DATA_BASE_CONNECTION_URL}`).then(client=>{
    let DB = client.db('courseProject')
    let usersCollection = DB.collection('users')
    let authorsCollection = DB.collection('authors')
    let articlesCollection = DB.collection('articles')
    let articleCount = DB.collection('articleCount')

    app.set("usersCollection",usersCollection)
    app.set("authorsCollection",authorsCollection)
    app.set("articlesCollection",articlesCollection)
    app.set("articleCount",articleCount)
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})

app.use('/user',usersAPI)
app.use('/author',authorsAPI)
app.use('/articles',articlesAPI) 




app.listen(4000,()=>{console.log(`server running on port ${process.env.PORT}...`)})