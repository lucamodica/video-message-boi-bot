import { Context, Markup, Telegraf, Telegram } from 'telegraf';
import { Update } from 'typegram';
import axios from 'axios';
import fs from 'fs';


// bot init
const token: string = process.env.BOT_TOKEN as string;
const bot: Telegraf<Context<Update>> = new Telegraf(token);


// bot handlers
// /start
bot.start((ctx) => {
  ctx.reply(`Hello ${ctx.from.first_name}! This is video message boi.`);
  ctx.reply(`Send/record a video message, I'll download it!`);
});

// download on any video message sent
bot.on('video_note', async (ctx) => {
  if (ctx.message.video_note) {
    // get file id
    const videoNoteId = ctx.message.video_note.file_id;

    // ensuring that the download path exists
    const downloadPath = `./video_notes`;
    fs.mkdir(downloadPath, (err) => {
      if (err) throw err;
    });

    // download file
    ctx.telegram.getFileLink(videoNoteId).then((url) => {
      axios({url: url.href, responseType: 'stream'}).then(response => {
        return new Promise((resolve, reject) => {

          // save file
          response.data.pipe(fs.createWriteStream(downloadPath + `/${ctx.update.message.from.id}.MPEG4`))
            .on('finish', () => ctx.reply('Video message downloaded!'))
            .on('error', (e: any) => {
              ctx.reply('Video message not downloaded due to an error :(');
              console.log('The error: ', e);
            })
          });
        })
    });
  }
});


// bot starting point
bot.launch();


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
