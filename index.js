import dotenv from "dotenv";
import { getEventStandings } from "./query.js";
import { promises as fs } from "fs";

dotenv.config();

const tournamentUrls = await fs.readFile(process.env.URLS_PATH, "utf-8");
const tournaments = tournamentUrls.split("\r\n");


const topEighters = {};

for (const tournament of tournaments) {
    console.log(`Querying ${tournament}`);
    const standings = await getEventStandings(tournament);
    // console.log(standings);
    
    for (const i of standings) {
        const discriminator = i.entrant.participants[0].user.discriminator;
        topEighters[discriminator] = {
            name: i.entrant.name,
            highest: Math.min(i.placement, topEighters[discriminator] === undefined ? Infinity : topEighters[discriminator].highest)
        }
    }
}

console.log(topEighters);