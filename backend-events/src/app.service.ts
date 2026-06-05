import { Injectable } from '@nestjs/common';
import * as https from 'https';

export interface NoResponse {
  reason: string;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async no(): Promise<NoResponse> {
    const url = 'https://naas.isalman.dev/no';
    const body = await new Promise<string>((resolve, reject) => {
      https
        .get(url, (res) => {
          const { statusCode } = res;
          if (!statusCode || statusCode < 200 || statusCode >= 300) {
            res.resume();
            reject(new Error(`Request failed. Status code: ${statusCode}`));
            return;
          }

          res.setEncoding('utf8');
          let raw = '';
          res.on('data', (chunk) => (raw += chunk));
          res.on('end', () => resolve(raw));
        })
        .on('error', (err) => reject(err));
    });

    let parsed: NoResponse | undefined;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      console.log(err);
    }

    if (!parsed || typeof parsed.reason !== 'string') {
      throw new Error('Response does not match NoResponse shape');
    }

    return parsed;
  }
}
