import { getLottieQuestion, solveLottie } from './resolver.module.js';
const getProgress = async (page)=>{
    return await page.$eval('body > div.container-top > div.text-center > div > h5', (node)=>{
        return parseInt(node.textContent.trim().match(/(.+)\/20/)[1]); // @returns XX/20
    });
};
const mainProcess = async (page)=>{
    await page.goto('https://lingos.pl/students/learning', {
        waitUntil: 'networkidle0'
    });
    const startingProgress = await getProgress(page);
    let progress = startingProgress;
    while(progress < 20){
        const qusetion = await getLottieQuestion(page);
        await solveLottie(page, qusetion);
        if (progress === 19) {
            return;
        }
        progress = await getProgress(page);
    }
};
export { mainProcess };
