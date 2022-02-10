import fs from 'fs';
import { dbObject } from '../util/dbObject.interface';

/**
 * Gets the content of database file returned as an array of objects.
 * The path to the database file is hardcoded.
 * Should be awaited.
 * @example
 * // Shape of a single object:
 * {id: string, wordPl: string, wordEn: string}
 *
 * @returns Promise: full content of the db.json file parsed to a js object array
 */
const readFromDb = async (): Promise<dbObject[]> => {
	const buf = fs.readFileSync('./database/db.json');
	return JSON.parse(buf.toString());
};

/**
 * Reads the database and writes new translation-pair object to the db.json file.
 * The path to the database file is hardcoded.
 * Should be awaited.
 *
 * @param newDbEntry dbObject
 */
const writeToDb = async (newDbEntry: dbObject) => {
	const db = await readFromDb();
	await fs.writeFileSync(
		'./database/db.json',
		JSON.stringify([...db, newDbEntry])
	);
};

export { readFromDb, writeToDb };
