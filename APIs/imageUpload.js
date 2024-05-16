const exp = require('express')
const cors = require('cors')
var cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const multer = require('multer')

const imageAPI = exp.Router()

cloudinary.config({ 
    cloud_name: 'dxvjbmgta', 
    api_key: '379154846244176', 
    api_secret: 'TcyL0r-QyrDXQZLYvwQrxJLo-RY',
    secure:true
  });

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:async (req,file)=>{
        return {
            folder:'gouthamTest',
            public_id:Date.now()
        }
    }
})

var upload = multer({storage:cloudinaryStorage})


imageAPI.use(exp.json())
imageAPI.use(exp.urlencoded())


imageAPI.post('/uploadImage',upload.single("photo"),(req,res)=>{
    console.log('asked for image upload')
    console.log(req.body)

    console.log(req.file)
    
    res.send({"status":"true","file":req.file})
})

imageAPI.post('/uploadProfileImage',upload.single("photo"),async (req,res)=>{
    let authorsCollection = req.app.get('authorsCollection')

    console.log('asked for image profile upload')
    console.log(req.body)

    console.log(req.file)
    await authorsCollection.updateOne({"email":req.body.email},{$push:{"profilePicture":{"profilePicture":req.file.path}}})
    
    res.send({"status":"true","file":req.file})
})


module.exports = imageAPI;