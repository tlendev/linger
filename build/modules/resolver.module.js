import { v4 as uuid } from 'uuid';
import { readFromDb, writeToDb } from './filesys.module.js';
const getLottieQuestion = async (page)=>{
    return await page.$eval('.mb-0.h3', (node)=>{
        return node.innerHTML.trim();
    });
};
const generateIfNotFound = async (page, lottieQuestion)=>{
    const dbEntries = await readFromDb();
    if (!dbEntries.find((element)=>{
        return element.wordPl === lottieQuestion;
    })) {
        console.log(`🟠 [Notice]: DB search failed! Generating new entry for "${lottieQuestion}"...`);
        await Promise.resolve([
            page.click('#nextBtn'),
            await page.waitForNavigation({
                waitUntil: 'networkidle0'
            }), 
        ]);
        const lottieAnswer = await page.$eval('body > div.container-main > div.container-main-2 > h5:nth-child(5) > span > strong', (node)=>{
            return node.innerHTML.trim();
        });
        await writeToDb({
            id: uuid(),
            wordEn: lottieAnswer,
            wordPl: lottieQuestion
        });
        await Promise.resolve([
            page.click('#next'),
            await page.waitForNavigation({
                waitUntil: 'networkidle0'
            }), 
        ]);
    }
};
const solveLottie = async (page, lottieQuestion)=>{
    const dbEntries = await readFromDb();
    const match = dbEntries.find((element)=>{
        return element.wordPl === lottieQuestion;
    });
    if (match) {
        const progress = +await page.$eval('body > div.container-top > div.text-center > div > h5', (node)=>{
            return node.innerHTML.trim().match(/(.+)\/20/)[1]; // x/20
        });
        console.log(`🔃 [${progress + 1}/20] Solving the question...`);
        await page.type('#answer', match.wordEn);
        await Promise.resolve([
            page.click('#nextBtn'),
            await page.waitForNavigation({
                waitUntil: 'networkidle0'
            }), 
        ]);
        await Promise.resolve([
            page.click('#next'),
            await page.waitForNavigation({
                waitUntil: 'networkidle0'
            }), 
        ]);
        console.log('✅ Question solved!');
    } else {
        await generateIfNotFound(page, lottieQuestion);
    }
};
export { getLottieQuestion, solveLottie };
