import { Page } from 'puppeteer';
import { getLottieQuestion, solveLottie } from './resolver.module.js';

/**
 * Gets the progress of solved questions. Must be awaited.
 *
 * @example
 * const progress = await getProgress(page);
 *
 * @param page Page object
 * @returns Promise: progress of solved questions
 */
const getProgress = async (page: Page): Promise<number> => {
	return await page.$eval(
		'body > div.container-top > div.text-center > div > h5',
		(node) => {
			return parseInt(node.textContent.trim().match(/(.+)\/20/)[1]); // @returns XX/20
		}
	);
};

/**
 * The main instruction set for the bot. This should be awaited directly in index.ts
 *
 * @param page Page object
 */
const mainProcess = async (page: Page) => {
	await page.goto('https://lingos.pl/students/learning', {
		waitUntil: 'networkidle0',
	});
	const startingProgress = await getProgress(page);
	let progress = startingProgress;

	while (progress < 20) {
		const qusetion = await getLottieQuestion(page);
		await solveLottie(page, qusetion);
		if (progress === 19) {
			return;
		}
		progress = await getProgress(page);
	}
};

export { mainProcess };
