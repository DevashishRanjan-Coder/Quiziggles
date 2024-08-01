import axios from "axios"
import express, { response } from "express"
import body from "body-parser"

const app = express();
const port = 3000;

var correctAnswer = "";
var randomJoke = "";

app.use(express.static("public"));
app.use(body.urlencoded({ extended: true }));

async function generateQuestion(res, category) {
    switch (category) {
        case "rM":
            try {
                const EP = await axios.get(`https://rickandmortyapi.com/api/episode/${Math.floor(Math.random() * 51)}`);
                const getCharacter = await axios.get(`${EP.data.characters[Math.floor(Math.random() * EP.data.characters.length)]}`);
                const getRandomCharacter = await axios.get(`https://rickandmortyapi.com/api/character/${Math.floor(Math.random() * 826)},${Math.floor(Math.random() * 826)}`);

                const dataCase1 = {
                    epName: EP.data.name,
                    epNumber: EP.data.episode,
                    charName: getCharacter.data.name,
                    random1: getRandomCharacter.data[0].name,
                    random2: getRandomCharacter.data[1].name,
                    choice: 2,
                    flag: false,
                }
                correctAnswer = getCharacter.data.name;
                res.render("index.ejs", dataCase1);
            } catch (error) {
                response.status(404).send("Something is wrong");
            }

            break;

        case "breakingBad":
            const bB = await axios.get("https://api.breakingbadquotes.xyz/v1/quotes");
            const dataCase2 = {
                quote: bB.data[0].quote,
                choice: 1,
                flag: false,
            }
            correctAnswer = bB.data[0].author;
            res.render("index.ejs", dataCase2);
            break;
    }
}

async function getJokes() {
    const result = await axios.get("https://v2.jokeapi.dev/joke/Programming?lang=en&type=single");
    randomJoke = result.data.joke;
}


app.get("/", (req, res) => {
    res.render("index.ejs", { choice: 0 });
})

app.post("/quizMe", (req, res) => {
    const category = req.body["type"];
    generateQuestion(res, category);
    console.log("You pressed quiz me!");
    getJokes();
})

app.post("/solution", (req, res) => {
    console.log(req.body);
    if (req.body["userAnswer"] === correctAnswer) {

        const correctResponse = {
            joke: randomJoke,
            choice: 1,
            flag: true,
        }
        res.render("index.ejs", correctResponse);

    } else if (req.body["userAnswer"] === "idk") {
        const actualResponse = {
            message: `The answer is ${correctAnswer}`,
            choice: 1,
            flag: false,
        }
        res.render("index.ejs", actualResponse)
    } else {
        const wrongResponse = {
            message: "Wubba lubba dub dub! Guess again smarty pants!",
            choice: 1,
            flag: false,
        }
        res.render("index.ejs", wrongResponse)
    }
    console.log("answer is: " + correctAnswer);
});


app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})