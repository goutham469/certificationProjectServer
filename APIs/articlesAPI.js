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

    for(let x in data)
    {
        await articlesCollection.updateOne({ "articleId": Number(data[x].articleId)},{ $inc: { "views": 0.5 } })
    }

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
    data = data[0]
    console.log(data)
    if(data)
    {
        if(data.count)
        {
            
                await articleCount.updateOne({"count":data.count},{$set:{"count":data.count+1}})
                console.log(data.count)
                res.send({"status":"true","count":data.count})

            
        }else{res.send({"status":"false"})}
    }else{res.send({"status":"false"})}
    
})
articlesAPI.get('/getArticleById',async (req,res)=>{
    // console.log(Number(req.query.id));
    let articlesCollection = req.app.get('articlesCollection')

    let response = await articlesCollection.find({"articleId":Number(req.query.id)}).toArray();
    await articlesCollection.updateOne({ "articleId": Number(req.query.id )},{ $inc: { "views": 1 } })

    if(response[0])
    {
        res.send({"status":"true",article:response[0]})
    }else{res.send({"status":"false"})}

})


articlesAPI.get('/upVote',async (req,res)=>{
    let articlesCollection = req.app.get('articlesCollection')
    await articlesCollection.updateOne({ "articleId": Number(req.query.id )},{ $inc: { "upVotes": 1 } })
    res.send({"status":"successful"})
      
})

articlesAPI.get('/upVoteNegative',async (req,res)=>{
    let articlesCollection = req.app.get('articlesCollection')
    await articlesCollection.updateOne({ "articleId": Number(req.query.id )},{ $inc: { "upVotes": -1 } })
    res.send({"status":"successful"})
})

articlesAPI.get('/downVote',async (req,res)=>{
    let articlesCollection = req.app.get('articlesCollection')
    await articlesCollection.updateOne({ "articleId": Number(req.query.id )},{ $inc: { "downVotes": 1 } })
    res.send({"status":"successful"})
      
})

articlesAPI.get('/downVoteNegative',async (req,res)=>{
    let articlesCollection = req.app.get('articlesCollection')
    await articlesCollection.updateOne({ "articleId": Number(req.query.id )},{ $inc: { "downVotes": -1 } })
    res.send({"status":"successful"})
      
})

articlesAPI.get('/IncrementView',async (req,res)=>{
    let articlesCollection = req.app.get('articlesCollection')
    await articlesCollection.updateOne({ "articleId": Number(req.query.id )},{ $inc: { "views": 1 } })
    res.send({"status":"successful"})
})

articlesAPI.post('/ChangeTitle',async (req,res)=>{
    console.log(req.body)
    let articlesCollection = req.app.get('articlesCollection')
    await articlesCollection.updateOne({"articleId":req.body.articleId},{$set:{"title":req.body.changedTitle}})
    res.send({"status":"title changed ->true"})
})


articlesAPI.post('/ChangeCategory',async (req,res)=>{
    console.log(req.body)
    let articlesCollection = req.app.get('articlesCollection')
    await articlesCollection.updateOne({"articleId":req.body.articleId},{$set:{"category":req.body.changedCategory}})
    res.send({"status":"category changed ->true"})
})

articlesAPI.post('/ChangeContent',async (req,res)=>{
    console.log(req.body)
    let articlesCollection = req.app.get('articlesCollection')
    await articlesCollection.updateOne({"articleId":req.body.articleId},{$set:{"content":req.body.changedContent}})
    res.send({"status":"content changed ->true"})
})

articlesAPI.post('/DeleteArticle',async (req,res)=>{
    console.log(req.body)
    let articlesCollection = req.app.get('articlesCollection')
    await articlesCollection.deleteOne({"articleId":req.body.articleId})
    res.send({"status":"true"})
})

articlesAPI.post('/updateLastEdit',async(req,res)=>{
    let currentDate = new Date
    const articlesCollection = req.app.get('articlesCollection')
    // let last_edited = `${current_date.getSeconds()}-${current_date.getMinutes()}-${current_date.getHours()}-${current_date.getDay()}-${current_date.getMonth()}-${current_date.getFullYear()}`
    // let last_edited = current_date.toDateString().substring(4,)+"---"+current_date.toTimeString().substring(0,8)
    let cur_date = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()} - ${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`
    console.log(`article with id : ${req.body.articleId} , last updated on ${cur_date} .`)
    await articlesCollection.updateOne({"articleId":req.body.articleId},{$set:{"lastUpdate":cur_date}})
    res.send({"status":"true"})
})


module.exports = articlesAPI;