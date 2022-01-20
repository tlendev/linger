import fs from 'fs';
import { dbObject } from '../util/dbObject.interface';

const readFromDb = async (): Promise<dbObject[]> => {
	const buf = fs.readFileSync('./database/db.json');
	return JSON.parse(buf.toString());
};

const writeToDb = async (newDbEntry: dbObject) => {
	const db = await readFromDb();
	await fs.writeFileSync(
		'./database/db.json',
		JSON.stringify([...db, newDbEntry])
	);
};

export { readFromDb, writeToDb };
