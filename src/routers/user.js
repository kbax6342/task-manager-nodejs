const express = require('express')
const { findById } = require('../models/user')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const { sendWelcomeEmail } = require('../emails/account')
const { sendGoodbyeEmail } = require('../emails/account')
const router = new express.Router()



const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb( new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users', async (req, res) => {
    
    const user =  new User(req.body)
    

    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})

    } catch (e) {
        res.status(400).send(e)
    }
    
})



router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }catch (e){
        res.status(500).send()
    }

})

router.post('users/logoutALL', auth, async (req, res) =>{
    try{
        req.user.tokens = []
        
       await req.user.save()
       req.send()

    }catch(e){
        res.status(500).send()
    }
})


router.get('/users/profile', auth, async (req, res) => {
       
    res.send(req.user)

})



router.delete('/users/me',  auth, async (req, res) => {

    try{

        await req.user.remove()
        sendGoodbyeEmail(user.email, user.name)
        res.send(req.user)
    }catch(e) {
        res.status(500).send(e)
    }
})




router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every( (update) => allowedUpdates.includes(update))

    if (!isValidOperation)  {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try{
        updates.forEach((update) => user[update] = req.body[update])

        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/me/avatar', auth , upload.single('avatar'), async (req, res) => {
    
   req.user.avatar = req.file.buffer
   await req.user.save()
   res.send()

}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth , async (req, res) => {
    
    req.user.avatar = undefined
    await req.user.save()
    res.send(200)
 
 })

 router.get('/users/:id/avatar', async (req, res) => {
     try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)

     }catch(e){
         res.status(404).send()
     }
 })

module.exports = router