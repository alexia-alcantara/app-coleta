const express = require("express")
const server = express()

//pegar o bd
const db = require("./database/db")

server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }))

//utilizando template nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})




server.get("/", (req, res) =>{
    return res.render("index.html", { title: "Um título"})
})

server.get("/create-point", (req, res) =>{
    // console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    console.log(req.body)

   // inserir dados
       const query = `
       INSERT INTO places (
           image,
           name,
           address,
           address2,
           state,
           city,
           items
       ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items

    ]

    function afterInsertData(err) {
       if(err) {
         console.log(err)
         return res.send("Erro no cadastro!")
       }

       console.log("Cadastrado com sucesso!")
       console.log(this)

       return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)

})



server.get("/search", (req, res) =>{
    //pegar os dados do bd
    db.all(`SELECT * FROM places`, function(err, rows) {
    if(err) {
        return console.log(err)
       }

       const total = rows.length

       //mostrar a pagina html com os dados do bd
       return res.render("search-results.html", { places: rows, total})
    })
})

server.listen(3000)