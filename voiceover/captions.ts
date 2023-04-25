import { CaptionType, RevAiApiClient } from 'revai-node-sdk';
import fs from 'fs';
import config from './config';
import Parser from 'srt-parser-2';

const client = new RevAiApiClient(config.REV_AI_TOKEN);

const parser = new Parser();

const waitForCompletion = async (id: string): Promise<void> => {
  const jobDetails = await client.getJobDetails(id);
  if (jobDetails.status === 'in_progress') {
    console.log('Job is still in progress');
    await new Promise(resolve => setTimeout(resolve, 5000));
    return waitForCompletion(id);
  }

  console.log('Job is complete');
  // return jobDetails;
};

const retryOnFail = async (fn: () => Promise<any>) => {
  let result;
  let retry = true;
  const maxRetries = 5;

  let retries = 0;
  while (retry && retries < maxRetries) {
    try {
      result = await fn();
      retry = false;
    } catch (err) {
      console.log('Retrying...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      retries++;
    }
  }
  return result;
};

export const getSrt = async (file: string) => {
  console.log('Getting transcript');

  // Submit a local file
  const job = await client.submitJobLocalFile(file);
  const jobId = job.id;
  // Const jobId = '6bguiCnpUoRPQcKh';

  console.log('Job Id: ' + jobId);

  await waitForCompletion(jobId);

  const captions = await retryOnFail(async () => {
    const captionsStream = await client.getCaptions(jobId, CaptionType.SRT).catch(err => {
      console.log(err);
    });

    if (!captionsStream) {
      console.log('No captions stream');
      return;
    }

    console.log('Transcript ready');

    captionsStream.pipe(fs.createWriteStream('./voice-over.srt'));

    // Save captions to variable
    const captionsBuffer = await captionsStream.read();
    const captions = captionsBuffer.toString('utf8');
    return captions;
  });

  const srt = parser.fromSrt(captions);

  return srt;
};
