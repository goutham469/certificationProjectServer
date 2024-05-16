const exp = require('express')

const usersAPI = exp.Router()

usersAPI.use(exp.json())

usersAPI.post('/createUser',async (req,res)=>{
    try
    {
        let userData = req.body;
        console.log(userData);
        let usersCollection = req.app.get('usersCollection')
        await usersCollection.insertOne(userData)
        res.send({"status":"success"})
    }
    catch(err)
    {
        console.log(err);
        res.send({"status":"failed to fetch server","message":"an error occured during fetching the server"})
    }
})
usersAPI.get('/getUsers',async (req,res)=>{
    let usersCollection = req.app.get('usersCollection')
    let data = await usersCollection.find().toArray()
    res.send({"payload":data})
})

usersAPI.get('/checkUser',async (req,res)=>{
    let data = req.query;
    data = data.name;
    const usersCollection = req.app.get('usersCollection')
    let response = await usersCollection.find({"email":data}).toArray()
    if(response.length>=1)
    {
        res.send({"message":"userFound"})
    }
    else
    {
        res.send({"message":"userNotFound"})
    }
})

usersAPI.post('/checkPassword',async (req,res)=>{
    // console.log(req.query,req.body.password)
    let usersCollection = req.app.get('usersCollection')
    let data = await usersCollection.find({"email":req.query.name}).toArray()
    if(data)
    {
        if(data[0])
        {
            if(data[0].password == req.body.password)
            {
                res.send({"status":"true","message":"password mached in database"})
            }
            else{res.send({"status":"false","message":"password not-mached in database"})}
        }else{res.send({"status":"false","message":"user not found in database"})}
    }
    else{res.send({"status":"false","message":"user not found in database"})}
})

usersAPI.get('/getPassword',async (req,res)=>{
    console.log(`${req.query.email} requested for Password`);
    let usersCollection = req.app.get('usersCollection')
    let data = await usersCollection.find({"email":req.query.email}).toArray();
    res.send({"status":"true",password:data[0].password})
})

usersAPI.post('/getPublicationData',async (req,res)=>{
    let usersCollection = req.app.get('usersCollection')
    let articlesCollection = req.app.get('articlesCollection')
    let data = {}

    let total_articles_published = await articlesCollection.find({"author":req.body.email}).toArray()
    if(total_articles_published)
    {
        data['total_articles_published'] = total_articles_published.length;
    }

    let total_article_views = 0;
    let total_upVotes = 0;
    let total_downVotes = 0;
    let total_article_comments = 0;
    for(let x in total_articles_published)
    {
        total_article_views += total_articles_published[x].views
        total_upVotes += total_articles_published[x].upVotes
        total_downVotes += total_articles_published[x].downVotes
        total_article_comments += total_articles_published[x].comments.length
    }
    data['total_article_views'] = total_article_views;
    data['total_upVotes'] = total_upVotes;
    data['total_downVotes'] = total_downVotes;
    data['total_article_comments'] = total_article_comments;
    

    let highest_single_view = {"count":0,"articleId":null};
    let highest_single_upVotes = {"count":0,"articleId":null};
    let highest_single_downVotes = {"count":0,"articleId":null};
    let highest_single_comments = {"count":0,"articleId":null};

    for(let x in total_articles_published)
    {
        if(total_articles_published[x].views > highest_single_view.count)
        {
            highest_single_view['count'] = total_articles_published[x].views;
            highest_single_view['articleId'] = total_articles_published[x].articleId;
        }
        if(total_articles_published[x].upVotes > highest_single_upVotes.count)
        {
            highest_single_upVotes['count'] = total_articles_published[x].upVotes;
            highest_single_upVotes['articleId'] = total_articles_published[x].articleId;
        }
        if(total_articles_published[x].downVotes > highest_single_downVotes.count)
        {
            highest_single_downVotes['count'] = total_articles_published[x].downVotes;
            highest_single_downVotes['articleId'] = total_articles_published[x].articleId;
        }
        if(total_articles_published[x].comments > highest_single_comments.count)
        {
            highest_single_comments['count'] = total_articles_published[x].comments;
            highest_single_comments['articleId'] = total_articles_published[x].articleId;
        }
    }

    data['highest_single_view'] = highest_single_view;
    data['highest_single_upVotes'] = highest_single_upVotes;
    data['highest_single_downVotes'] = highest_single_downVotes;
    data['highest_single_comments'] = highest_single_comments;
    // console.log(data)
    res.send({"status":"true","data":data})

})
module.exports = usersAPI