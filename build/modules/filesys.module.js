import fs from 'fs';
const readFromDb = async ()=>{
    const buf = fs.readFileSync('./database/db.json');
    return JSON.parse(buf.toString());
};
const writeToDb = async (newDbEntry)=>{
    const db = await readFromDb();
    await fs.writeFileSync('./database/db.json', JSON.stringify([
        ...db,
        newDbEntry
    ]));
};
export { readFromDb, writeToDb };
