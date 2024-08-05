import { Page } from '@/components/page/page';
import { REPOS } from '@/constants';
import { useIsMobile } from '@/hooks/use-is-mobile/use-is-mobile';
import { useState } from 'react';
import { createSlackAlphabet } from './pens/slacker';
import { url2JSON, UrlToJson } from './pens/url-to-json';

export const CodePen = () => {
  const isMobile = useIsMobile();
  const [result, setResult] = useState<null | UrlToJson>(null);

  const [slackMessage, setSlackMessage] = useState('');

  const debounce = (callback: () => void, wait = 100) => {
    window.setTimeout(callback, wait);
  };

  return (
    <Page
      name="Code Pens"
      withoutPadding={isMobile}
      repo={REPOS.codepen.url}
      className="bg-gray-200 text-black"
    >
      <div className="flex flex-col items-center">
        <div className="w-full bg-grey-50 mt-3">
          <h3 className="text-black">URL to JSON</h3>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <input
                type="text"
                placeholder="Paste URL"
                className="appearance-none block w-full text-black border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                onChange={e => setResult(url2JSON(e.target.value))}
              />
            </div>
            <div className="w-full px-3">
              <label className="block text-black text-sm font-bold mb-2">
                Results
              </label>
              <textarea
                rows={10}
                placeholder="Paste above ^"
                value={result ? JSON.stringify(result, null, 4) : ''}
                className="appearance-none block w-full text-black border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
        <div className="w-full bg-grey-50 mt-3">
          <h3 className="text-black">Slacker</h3>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <input
                placeholder="Type Something"
                onChange={e =>
                  debounce(() =>
                    setSlackMessage(createSlackAlphabet(e.target.value)),
                  )
                }
                type="text"
                className="appearance-none block w-full text-black border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
            <div className="w-full px-3">
              <label className="block text-black text-sm font-bold mb-2">
                Results
              </label>
              <textarea
                placeholder="Type above ^"
                rows={5}
                value={slackMessage}
                onChange={() => {}}
                className="appearance-none block w-full text-black border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};
