import { Page } from 'puppeteer';
import { getLottieQuestion, solveLottie } from './resolver.module.js';

const mainProcess = async (page: Page) => {
	// why is this ignored?
	await page.goto('https://lingos.pl/students/learning', {
		waitUntil: 'networkidle0',
	});

	const startingProgress: number = +(await page.$eval(
		'body > div.container-top > div.text-center > div > h5',
		(node) => {
			return node.innerHTML.trim().match(/(.+)\/20/)[1]; // @returns XX/20
		}
	));
	let progress = startingProgress;

	while (progress < 20) {
		const q = await getLottieQuestion(page);
		await solveLottie(page, q);
		if (progress === 19) {
			return;
		}
		progress = +(await page.$eval(
			'body > div.container-top > div.text-center > div > h5',
			(node) => {
				return node.innerHTML.trim().match(/(.+)\/20/)[1]; // @returns XX/20
			}
		));
	}
};

export { mainProcess };
