'use strict';

// const bitbank = require('node-bitbankcc');
import * as bitbank from 'node-bitbankcc';

const bitbankApiConf: bitbank.ApiConfig = {
    endPoint: 'https://public.bitbank.cc',
    keepAlive: true,
    timeout: 3000,
};

const CHAT_ID = 698998391;

const bitbankApi = new bitbank.PublicApi(bitbankApiConf);

// import * as TelegramBot from 'node-telegram-bot-api';
const TelegramBot = require('node-telegram-bot-api');
const telegramBotToken = process.env.TELEGRAM_CRYPTO_PRICE_BOT_TOKEN;
const bot = new TelegramBot(telegramBotToken, { polling: true });

async function getMonaCoinLatestPrice(api: bitbank.PublicApi): Promise<number> {
    const monaTicker = await api.getTicker(
        {
            pair: 'mona_jpy',
        }
    );
    const monaLastPrice = monaTicker.data.last;
    if (!monaLastPrice) { throw Error() }
    return +monaLastPrice;
}

const main = async () => {
    const monaPrice = await getMonaCoinLatestPrice(bitbankApi);
    // console.log(monaPrice);

    const message = "現在のモナンコインの価格は " + monaPrice + " です";
    bot.sendMessage(CHAT_ID, message);
};

import { scheduleJob } from 'node-schedule';
const job = scheduleJob('0 * * * * *', async () => {
    await main();
 });
