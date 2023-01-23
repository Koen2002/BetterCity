const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv")
dotenv.config()

const app = express();
const port = 4000;
const apikey = process.env.API_KEY

app.set("view engine", "ejs");
app.use(express.static("public"))


app.get("/", async function(request, response){
    var leagues = [{id: "PL", name: "Premier League", logo: "logo/Premier-League-Logo.png"}, {id: "DED", name: "Eredivisie", logo: "logo/Eredivisie_nieuw_logo_2017-.svg.png"}, {id: "BL1", name: "Bundesliga", logo: "logo/German-Bundesliga-Logo-2002.png"}, {id: "PD", name: "Primera Division", logo: "logo/Spanish-La-Liga-logo-500x281.png"}, {id: "FL1", name: "Ligue 1", logo: "logo/French-Ligue-1-Logo-500x281.png"}, {id: "SA", name: "Serie A", logo: "logo/Italian-Serie-A-logo-500x281.png"}]
    console.log(leagues)
    response.render("leagues", {leagues: leagues})
})

app.get("/:leagueId/standings", async function(request, response){
    const leagueId = request.params.leagueId
    console.log(leagueId)
    const eredivisieResponse = await axios.get(`http://api.football-data.org/v4/competitions/${leagueId}/standings`, {
        headers: {
            "X-Auth-Token": apikey
        }
    })

    // console.log(eredivisieResponse.data.standings[0].table)
    response.render("standings", {teams: eredivisieResponse.data.standings[0].table, league: leagueId});

})

app.get("/:leagueId/matches", async function(request, response){
    // localhost:4000/DED/matches 1 speelronde van de Eredivisie
    // stap1: Haal de league ID uit de params
    const leagueId = request.params.leagueId
    // console.log("Leageu ID", request.params.leagueId)
    
    // stap3: Vraag alle matches van deze competitie
    const matchesResponse = await axios.get(`http://api.football-data.org/v4/competitions/${leagueId}/matches`, {
        headers: {
            "X-Auth-Token": apikey
        }
    })
    // console.log("SHOW ALL MATCHES", allMatches.data.matches)
    // stap4: Haal 1 matchday uit de data
    // console.log("SHOW MATCH", allMatches.data.matches[0])

    // stap5: Maak een template voor matches met html + Hello World
    const rounds = []
    for (let index = 1; index <= 34; index++) {
        const round = []
        for (match of matchesResponse.data.matches) {
            if (match.matchday === index) {
                round.push(match)
            }
        }
        rounds.push(round)
        
    }
    console.log(rounds[0][0])
    // stap6: Render de template
    response.render("matches", {rounds: rounds, match: leagueId})
    // stap7: Geef 1 matchday waarscheinlijk een array of objects door aan de template
    // stap8: Loop over de matches met ejs en laat ze zien
})

app.listen(port, function () {
    console.log(`I AM ALIVE! on http://localhost:${port}/standings`);
  });