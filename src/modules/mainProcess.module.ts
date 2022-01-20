import { Page } from 'puppeteer';
import { getLottieQuestion, solveLottie } from './resolver.module.js';

const mainProcess = async (page: Page) => {
	await page.goto('https://lingos.pl/students/learning', {
		waitUntil: 'networkidle0',
	});
	const progress: number = +(await page.$eval(
		'body > div.container-top > div.text-center > div > h5',
		(node) => {
			return node.innerHTML.trim().match(/(.+)\/20/)[1]; // @returns XX/20
		}
	));
	while (progress < 19) {
		console.log(`DEV: ${progress}`);
		const q = await getLottieQuestion(page);
		await solveLottie(page, q);
	}
};

export { mainProcess };