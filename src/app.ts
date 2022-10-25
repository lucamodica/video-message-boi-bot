import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import axios from 'axios';
import fs from 'fs';


// bot init
const token: string = process.env.BOT_TOKEN as string;
const bot: Telegraf<Context<Update>> = new Telegraf(token);
const helpMsg = `Send/record a video message, I'll convert it to a normal video!`;


// bot handlers
// /start
bot.start((ctx) => {
  ctx.reply(
    `Hello ${ctx.from.first_name}! This is video message boi bot.`
  );
  ctx.reply(helpMsg);
});

// /help
bot.help((ctx) => ctx.reply(helpMsg));

// send the normal video from a video message
bot.on('video_note', async (ctx) => {
  // get file id
  const videoNoteId = ctx.message.video_note.file_id;

  // reply with a normal video
  await ctx.reply('Converting video message to video...');
  await ctx.replyWithVideo({
    url: (await ctx.telegram.getFileLink(videoNoteId)).href
  }).catch((err) => {
    ctx.reply('Cannot convert to video due to an error :(');
    ctx.reply('Try sending the video message again!');
    console.log('Error on sending normal video: ', err);
  });
  await ctx.reply('Video sent!');
});


// bot starting point
bot.launch({
  dropPendingUpdates: true
});

// custom error handling
bot.catch((err) => {
  console.log('Error occoured! ', err)
})


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
