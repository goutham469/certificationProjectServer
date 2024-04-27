const exp = require('express')
const cors = require('cors')

const articlesAPI = exp.Router()

articlesAPI.use(exp.json())
articlesAPI.use(cors())

articlesAPI.get('/',(req,res)=>{
    res.send("articles API")
})
articlesAPI.post('/postArticle',async (req,res)=>{
    try
    {
        console.log(req.body)
        let articlesCollection = req.app.get('articlesCollection')
        await articlesCollection.insertOne(req.body)
        res.send({"status":"success","message":"article inserted successfully"})
    }
    catch(err)
    {
        res.send({"status":"fail","message":"an error has occured in data base"})
    }
})

articlesAPI.get('/getAll',async (req,res)=>{
    let articlesCollection = req.app.get('articlesCollection')
    let data = await articlesCollection.find().toArray()
    res.send({"status":"success","articles":data})
})

articlesAPI.get('/getByAuthorName',async (req,res)=>{
    try
    {
        let articlesCollection = req.app.get('articlesCollection')
        let data = await articlesCollection.find({"author":req.query.name}).toArray()
        res.send({"status":"success","articles":data})
    }
    catch(err)
    {
        res.send({"status":"failed","error":err})
    }
})

articlesAPI.put('/PostComment',async (req,res)=>{
    
    try
    {
        let articleId = req.query.articleId;
        const data = req.body;
        articleId = Number(articleId)

        let articlesCollection = req.app.get('articlesCollection')
        let response = await articlesCollection.updateOne({"articleId":articleId},{$push:{"comments":{"comment":data.comment,"userName":data.userName,"upVotes":0,"downVotes":0,"comments":[]}}})

        res.send({"status":response.acknowledged})
    }
    catch(err)
    {
        res.send({"status":"false","error":err})
    }
})

articlesAPI.get('/getArticleId',async (req,res)=>{
    let articleCount = req.app.get('articleCount')
    let data = await articleCount.find().toArray()
    data = data[0].count;
    await articleCount.updateOne({"count":data},{$set:{"count":data+1}})
    res.send({"status":"true","count":data})

})

module.exports = articlesAPI;