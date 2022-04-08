const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("Server Is Running on http://localhost/4000");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//api1
app.get("/players/", async (request, response) => {
  const getAllThePlayers = `
    SELECT *
    FROM cricket_team`;
  const allPlayers = await db.all(getAllThePlayers);
  response.send(allPlayers);
});

//api2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const postPlayerDetails = `
    INSERT  INTO 
    cricket_team (player_name,jersey_number,role)
     VALUES
      (
         ${playerName},
         ${jerseyNumber},
         ${role}
      );`;
  const dbResponse = await db.run(postPlayerDetails);
  const player_id = dbResponse.lastID;
  response.send("player added to the team");
});

//api3
app.get("/players/:player_id", async (request, response) => {
  const { player_id } = request.params;
  const getPlayerByPlayerId = `
    SELECT * 
    FROM cricket_team 
    WHERE player_id = ${player_id};`;
  const player = await db.get(getPlayerByPlayerId);
  response.send(player);
});

//api4
app.put("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerDetails = `
    UPDATE cricket_team
    SET 
    player_name = ${playerName},
    jersey_number = ${jerseyNumber},
    role = ${role}
    WHERE player_id = ${player_id}`;
  const dbResponse = await db.run(updatePlayerDetails);
  response.send(dbResponse);
});

//api5

app.delete("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const deletePlayer = `
    DELETE FROM cricket_team 
    WHERE player_id = ${player_id}
    `;
  await db.run(deletePlayer);
  response.send("Player Removed");
});

module.exports = app;
