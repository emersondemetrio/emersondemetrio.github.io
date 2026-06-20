import { Page } from "@/components/page/page";
import { REPOS } from "@/constants";
import "./code-pen.css";
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
    >
      <div className="cp-layout">
        <div className="cp-section">
          <h3 className="font-bold text-[var(--mx-ink)]">URL to JSON</h3>
          <input
            type="text"
            placeholder="Paste URL"
            className="input input-bordered w-full"
            onChange={(e) => setResult(url2JSON(e.target.value))}
          />
          <label className="font-bold text-[var(--mx-ink)] cursor-pointer">
            Results
          </label>
          <textarea
            rows={10}
            placeholder="Paste above ^"
            value={result ? JSON.stringify(result, null, 4) : ""}
            onClick={() => result ? copy(JSON.stringify(result, null, 4)) : noop}
            className="input input-bordered w-full"
          />
        </div>
        <div className="cp-section">
          <h3 className="font-bold text-[var(--mx-ink)]">Slacker ({slackColor})</h3>
          <div className="cp-radio-group">
            <div className="cp-radio-group">
              <input
                type="radio"
                id="yellow"
                name="color"
                value="yellow"
                defaultChecked
                onChange={() => updateTextColor("yellow")}
              />
              <label htmlFor="yellow" className="cp-radio-label">Yellow</label>
            </div>
            <div className="cp-radio-group">
              <input
                type="radio"
                id="white"
                name="color"
                value="white"
                onChange={() => updateTextColor("white")}
              />
              <label htmlFor="white" className="cp-radio-label">White</label>
            </div>
          </div>
          <input
            placeholder="Type Something"
            onChange={(e) =>
              debounce(() => setSlackMessage(createSlackAlphabet(e.target.value, slackColor)))}
            type="text"
            className="input input-bordered w-full"
          />
          <label
            className="font-bold text-[var(--mx-ink)] cursor-pointer"
            onClick={() => copy(slackMessage)}
          >
            Results 📋
          </label>
          <textarea
            rows={5}
            value={slackMessage}
            placeholder="Type above ^"
            onClick={() => copy(slackMessage)}
            className="input input-bordered w-full"
          />
        </div>
      </div>
    </Page>
  );
};
