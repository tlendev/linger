import { Page } from 'puppeteer';
import { v4 as uuid } from 'uuid';
import { clickButton } from '../util/clickButton.js';
import { readFromDb, writeToDb } from './filesys.module.js';

let retardnessLevel = 0;

/**
 * Gets the current question to solve. Must be awaited.
 *
 * @param page Page object
 * @returns Promise: question to solve as a string
 */
const getLottieQuestion = async (page: Page): Promise<string> => {
	return await page.$eval('.mb-3.h3', (node) => {
		return node.innerHTML.trim();
	});
};

const generateIfNotFound = async (page: Page, lottieQuestion: string) => {
	const dbEntries = await readFromDb();
	if (
		!dbEntries.find((element) => {
			return element.wordPl === lottieQuestion;
		})
	) {
		console.log(
			`🟠 [Notice]: DB search failed! Generating new entry for "${lottieQuestion}"...`
		);
		await clickButton(page, '#nextBtn');
		const lottieAnswer = await page.$eval(
			'body > div.container-main > div.container-main-2 > h5:nth-child(5) > span > strong',
			(node) => {
				return node.innerHTML.trim();
			}
		);
		await writeToDb({
			id: uuid(),
			wordEn: lottieAnswer,
			wordPl: lottieQuestion,
		});
		await Promise.resolve([
			page.click('#next'),
			await page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);
	}
};

const solveLottie = async (page: Page, lottieQuestion: string) => {
	// Backup plan if there are 2 or more words with the same translation
	if (retardnessLevel === 2) {
		const answ: string = await page.$eval(
			'body > div.container-main > div.container-main-2 > h5:nth-child(5) > span > strong',
			(node) => {
				return node.textContent.trim();
			}
		);
		await Promise.resolve([
			page.click('#next'),
			await page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);
		await page.type('#answer', answ);
		await Promise.resolve([
			page.click('#nextBtn'),
			await page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);
		await Promise.resolve([
			page.click('#next'),
			await page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);
		console.log('✅ Question solved... with brute force');
		retardnessLevel = 0;
		return;
	}
	// Guard for clicking through new words
	if (
		await page.$(
			'body > div.container-main > div.container-main-2 > h4.mb-0.h4'
		)
	) {
		await Promise.resolve([
			page.click('#checkWordForm > form > button'),
			await page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);
		return;
	}
	const dbEntries = await readFromDb();
	const match = dbEntries.find((element) => {
		return element.wordPl === lottieQuestion;
	});
	if (match) {
		const progress: number = +(await page.$eval(
			'body > div.container-top > div.text-center > div > h5',
			(node) => {
				return node.innerHTML.trim().match(/(.+)\/20/)[1]; // @returns XX/20
			}
		));
		console.log(`🔃 [${progress + 1}/20] Solving the question...`);
		await page.type('#answer', match.wordEn);
		await Promise.resolve([
			page.click('#nextBtn'),
			await page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);
		if (await page.$('#lottie-fail')) {
			retardnessLevel++;
			console.log(
				'❎ OOPSIE WOOPSIE!! Uwu Czterobok made a fucky wucky; retrying...'
			);
			if (retardnessLevel === 2) {
				return;
			}
			await Promise.resolve([
				page.click('#next'),
				await page.waitForNavigation({ waitUntil: 'networkidle0' }),
			]);
			return;
		}
		await Promise.resolve([
			page.click('#next'),
			await page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);
		console.log('✅ Question solved!');
	} else {
		await generateIfNotFound(page, lottieQuestion);
	}
};

export { getLottieQuestion, solveLottie };
