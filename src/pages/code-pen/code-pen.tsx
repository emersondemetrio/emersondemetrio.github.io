import { Page } from "@/components/page/page";
import { REPOS } from "@/constants";
import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";
import { copyToClipboard, noop } from "@/utils/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { Color, createSlackAlphabet } from "./pens/slacker";
import { url2JSON, UrlToJson } from "./pens/url-to-json";

export const CodePen = () => {
  const isMobile = useIsMobile();
  const notify = (message: string) => toast(message);
  const [result, setResult] = useState<null | UrlToJson>(null);
  const [slackMessage, setSlackMessage] = useState("");
  const [slackColor, setSlackColor] = useState<Color>("yellow");

  const updateTextColor = (color: Color) => {
    setSlackColor(color);
    const toReplace = color === "yellow" ? "white" : "yellow";
    setSlackMessage(slackMessage.replace(new RegExp(toReplace, "g"), color));
  };

  const debounce = (callback: () => void, wait = 100) => {
    window.setTimeout(callback, wait);
  };

  const copy = async (text: string) => {
    if (text) {
      await copyToClipboard(text);
      notify("Copied to clipboard");
    }
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
          <h3 className="text-black text-lg font-bold cursor-pointer">URL to JSON</h3>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <input
                type="text"
                placeholder="Paste URL"
                className="appearance-none block w-full text-black border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                onChange={(e) => setResult(url2JSON(e.target.value))}
              />
            </div>
            <div className="w-full px-3">
              <label className="block text-black text-lg font-bold cursor-pointer">
                Results
              </label>
              <textarea
                rows={10}
                placeholder="Paste above ^"
                value={result ? JSON.stringify(result, null, 4) : ""}
                onClick={() => result ? copy(JSON.stringify(result, null, 4)) : noop}
                className="appearance-none block w-full text-black border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>
        <div className="w-full bg-grey-50 mt-3">
          <h3 className="text-black text-lg font-bold">Slacker ({slackColor})</h3>
          <div className="flex flex-wrap mx-3 mb-6 space-x-4 mt-4">
            <div>
              <input
                type="radio"
                id="yellow"
                name="color"
                value="yellow"
                defaultChecked
                onChange={() => updateTextColor("yellow")}
              />
              <label htmlFor="yellow">Yellow</label>
            </div>
            <div className="flex items-center ml-2">
              <input
                type="radio"
                id="white"
                name="color"
                value="white"
                onChange={() => updateTextColor("white")}
              />
              <label htmlFor="white">White</label>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <input
                placeholder="Type Something"
                onChange={(e) =>
                  debounce(() => setSlackMessage(createSlackAlphabet(e.target.value, slackColor)))}
                type="text"
                className="appearance-none block w-full text-black border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
            <div className="w-full px-3">
              <label
                className="block text-black text-lg font-bold cursor-pointer"
                onClick={() => copy(slackMessage)}
              >
                Results 📋
              </label>
              <textarea
                rows={5}
                value={slackMessage}
                placeholder="Type above ^"
                onClick={() => copy(slackMessage)}
                className="appearance-none block w-full text-black border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};
