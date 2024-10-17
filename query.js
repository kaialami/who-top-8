import dotenv from "dotenv";
import { promises as fs } from "fs";

dotenv.config();

const startgg = "https://www.start.gg/";
const startggApi = "https://api.start.gg/gql/alpha";
const startggKey = process.env.STARTGG_KEY;

export async function getEventStandings(eventUrl) {
    try {
        const slug = eventUrl.substring(startgg.length);
        const query = await getQueryFromFile("EventStandings.txt");
    
        let res = await fetchPage(slug, query, 1);
        let nodes = res.data.event.standings.nodes;

        return Promise.resolve(nodes);
    } catch (err) {
        console.log(err);
        throw Error(err.message);
    }
}

async function fetchPage(slug, query, page) {
    const res = await fetch(startggApi, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + startggKey
        },
        body: JSON.stringify({
            query: query,
            variables: {
                slug: slug,
                page: page,
                perPage: 8
            }
        })
    });

    return res.json();
}

async function getQueryFromFile(file) {
    return fs.readFile(`./resources/queries/${file}`, "utf8");
}
