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

module.exports = usersAPI