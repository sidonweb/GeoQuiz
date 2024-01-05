import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let currentQuestion = {};
let quiz = [];
let totalCorrect = 0;

app.get("/", (req, res) => {
    res.render("index.ejs");
})

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "123456",
  port: 5432,
});

db.connect();

function queryFunction(dbname) {
    
    db.query("SELECT * FROM " + dbname, (err, res) => {
        if(err) {
            console.log("Error executing query", err.stack);
        } else{
            quiz = res.rows;
        }
    })
}


app.get("/flags", async (req, res) => {
    queryFunction("flags");
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("flags.ejs", { question: currentQuestion });
})

app.post("/submitFlag", (req, res) => {
    let answer = req.body.answer.trim();
    let isCorrect = false;
  if (currentQuestion.name.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("flags.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
})



app.get("/capitals", async(req, res) => {
    queryFunction("capitals");
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("capitals.ejs", { question: currentQuestion });
})

app.post("/submitCapital", (req, res) => {
    let answer = req.body.answer.trim();
    let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("capitals.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
})
async function nextQuestion() {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomCountry;
  }
app.listen(port, () => {
    console.log(`Server listening on PORT ${port}`);
})