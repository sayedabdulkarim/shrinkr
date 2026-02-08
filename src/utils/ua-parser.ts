import { UAParser } from 'ua-parser-js';

export interface ParsedUserAgent {
  browser: string;
  os: string;
  deviceType: string;
}

export function parseUserAgent(userAgent: string | undefined): ParsedUserAgent {
  if (!userAgent) {
    return { browser: 'Unknown', os: 'Unknown', deviceType: 'Unknown' };
  }

  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  return {
    browser: browser.name || 'Unknown',
    os: os.name || 'Unknown',
    deviceType: device.type || 'desktop',
  };
}
