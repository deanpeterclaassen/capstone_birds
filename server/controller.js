const path = require('path')
require('dotenv').config()
const {DATABASE_URL} = process.env
const Sequelize = require('sequelize')
const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})
module.exports={
    getHtml: (req,res)=>{
        res.sendFile(path.join(__dirname,'../public/index.html'))
    },
    getCss: (req,res)=>{
        res.sendFile(path.join(__dirname,'../public/styles.css'))
    },
    getJS: (req,res)=>{
        res.sendFile(path.join(__dirname,'../public/main.js'))
    },
    addBird: (req,res)=>{
        const{name} = req.body;
        sequelize.query(`insert into birdList(bird_name,bird_seen)
        values('${name}',true)
        ON CONFLICT (bird_name)
        DO NOTHING;`)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    getBirds: (req,res)=>{
        sequelize.query   (`select * from birdList
        where bird_seen = true;`)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    getWishBirds: (req,res)=>{
        sequelize.query(`select * from birdList
        where bird_seen = false;`)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    
    
    addList: (req,res)=>{
        const {name} = req.body;
        sequelize.query(`insert into birdList (bird_name,bird_seen)
        values('${name}',false) ON CONFLICT (bird_name)
        DO NOTHING;`)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))

    },
    countBirds: (req,res)=>{
        sequelize.query(`Select Count(*) From birdList Where bird_seen = true;`)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    markBirdAsSeen: (req,res)=>{
        let {bird_id} = req.body;
        sequelize.query(`Update birdList set bird_seen=true where bird_id = ${bird_id};`)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    deleteBird: (req,res)=>{
        const {bird_id} = req.body;
        sequelize.query(`Delete from birdList where bird_id = ${bird_id};`)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))

    }
}