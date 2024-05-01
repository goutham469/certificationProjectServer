const exp = require('express')

const authorsAPI = exp.Router()


authorsAPI.use(exp.json())

authorsAPI.post('/createAuthor',async (req,res)=>{
    try
    {
        let authorData = req.body;
        console.log(authorData);
        let authorsCollection = req.app.get('authorsCollection')
        await authorsCollection.insertOne(authorData)
        res.send({"status":"success"})
    }
    catch(err)
    {
        console.log(err);
        res.send({"status":"failed to fetch server","message":"an error occured during fetching the server"})
    }
})
authorsAPI.get('/getAuthors',async (req,res)=>{
    let authorsCollection = req.app.get('authorsCollection')
    let data = await authorsCollection.find().toArray()
    res.send({"payload":data})
})

authorsAPI.get('/checkAuthor',async (req,res)=>{
    let data = req.query;
    data = data.name;
    const authorsCollection = req.app.get('authorsCollection')
    let response = await authorsCollection.find({"email":data}).toArray()
    if(response.length>=1)
    {
        res.send({"message":"userFound"})
    }
    else
    {
        res.send({"message":"userNotFound"})
    }
})

authorsAPI.post('/checkPassword',async (req,res)=>{
    let authorsCollection = req.app.get('authorsCollection')
    let data = await authorsCollection.find({"email":req.query.name}).toArray()
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

authorsAPI.get('/checkAuthorName',async (req,res)=>{
    const authorsCollection = req.app.get('authorsCollection')
    let data = await authorsCollection.find({"email":req.query.email}).toArray()
    if(data)
    {
        if(data[0])
        {
            res.send({"status":"true","existence":"exists"})
        }else{res.send({"status":"true","existence":"false"})}
    }else{res.send({"status":"true","existence":"false"})}
})

module.exports = authorsAPI