import 'index.css';
import 'figma-plugin-ds/dist/figma-plugin-ds.css';

import React from 'react';
import ReactDOM from 'react-dom';
import * as Tabs from '@radix-ui/react-tabs';
import Editor from '@monaco-editor/react';
import {useEditor} from 'hooks/useEditor';
import {useCode} from 'hooks/useCode';
import {Loading} from 'views/Loading';
import {Hint} from 'views/Hint';

import * as config from 'config';

function App() {
  const editor = useEditor();
  const code = useCode();

  if (!editor) return <Loading/>;
  if (!code) return <Hint/>;

  return (
    <Tabs.Root defaultValue="editor" orientation="vertical" className="tabs">
      <Tabs.List aria-label="tools" className="tab-bar">
        <Tabs.Trigger value="editor" className="tab-label type type--bold">
          Code
        </Tabs.Trigger>
        <Tabs.Trigger value="code" className="tab-label type type--bold inactive">
          Theme
        </Tabs.Trigger>
        <Tabs.Trigger value="code" className="tab-label type type--bold inactive">
          Output
        </Tabs.Trigger>
        <Tabs.Trigger value="preview" className="tab-label type type--bold inactive">
          Preview
        </Tabs.Trigger>
        <div className="spacer"/>
        <span id="copy" className="action" title="Copy code to clipboard">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 16C10 14.8954 10.8954 14 12 14H14V13H12C10.3431 13 9 14.3431 9 16C9 17.6569 10.3431 19 12 19H14V18H12C10.8954 18 10 17.1046 10 16ZM18 14V13H20C21.6569 13 23 14.3431 23 16C23 17.6569 21.6569 19 20 19H18V18H20C21.1046 18 22 17.1046 22 16C22 14.8954 21.1046 14 20 14H18ZM13 16.5H19V15.5H13V16.5Z" fill="black"/>
          </svg>
        </span>
        <span id="settings" className="action" title="Editor settings">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-rule="evenodd" fill="#000" fill-rule="evenodd">
              <path d="m16.9537 9.92841-.1385-.33177c-.18-.43137-.5139-.59664-.8152-.59664s-.6352.16527-.8152.59664l-.1385.33177c-.5603 1.34249-1.9924 2.12919-3.4255 1.71879l-.499-.1429c-.3095-.0886-.6065.0247-.8154.3262-.2133.3076-.2671.735-.0489 1.1235.7427 1.323.4014 3.0678-.86052 3.9496-.31827.2224-.45616.6147-.37471 1.0245.08121.4087.34187.6682.67231.7231l.19495.0324c1.52547.2537 2.51027 1.6871 2.42307 3.1801-.0294.5034.2195.8613.5196 1.0287.2889.1611.6242.1551.922-.1087l.3727-.3302c1.0817-.9581 2.6645-.9581 3.7462 0l.3727.3302c.2978.2638.6331.2698.922.1087.3001-.1674.549-.5253.5196-1.0287-.0872-1.493.8976-2.9264 2.4231-3.1801l.1949-.0324c.3305-.0549.5911-.3144.6723-.7231.0815-.4098-.0564-.8021-.3747-1.0245-1.2619-.8818-1.6032-2.6266-.8605-3.9496.2182-.3885.1644-.8159-.0489-1.1235-.2089-.3015-.5059-.4148-.8154-.3262l-.499.1429c-1.4331.4104-2.8652-.3763-3.4255-1.71879zm.7844-.71693c-.6742-1.61531-2.802-1.61531-3.4762 0l-.1384.33176c-.3829.91726-1.3256 1.40086-2.2274 1.14266l-.4991-.1429c-1.57455-.4509-2.85501 1.3982-2.01151 2.9006.50464.8988.25662 2.0688-.56127 2.6403-1.39092.9719-.9319 3.2814.70633 3.5538l.19495.0324c.961.1598 1.6499 1.0893 1.5888 2.1353-.1045 1.7878 1.819 2.8641 3.103 1.7268l.3727-.3301c.7032-.6229 1.7168-.6229 2.42 0l.3727.3301c1.284 1.1373 3.2075.061 3.103-1.7268-.0611-1.046.6278-1.9755 1.5888-2.1353l.1949-.0324c1.6383-.2724 2.0973-2.5819.7064-3.5538-.8179-.5715-1.0659-1.7415-.5613-2.6403.8435-1.5024-.437-3.3515-2.0115-2.9006l-.4991.1429c-.9018.2582-1.8445-.2254-2.2274-1.14265z"/>
              <path d="m16 18.5c1.1046 0 2-.8954 2-2s-.8954-2-2-2-2 .8954-2 2 .8954 2 2 2zm0 1c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3-3 1.3431-3 3 1.3431 3 3 3z"/>
            </g>
          </svg>
        </span>
      </Tabs.List>
      <Tabs.Content value="editor" className="tab">
        <Editor
          value={code}
          height="100vh"
          path="Test.tsx"
          className="code-editor"
          defaultLanguage="typescript"
          theme={config.code.editor.theme}
          options={config.code.editor}
        />
      </Tabs.Content>
      <Tabs.Content value="preview" className="tab">
        Coming soon...
      </Tabs.Content>
    </Tabs.Root>
  );
}

ReactDOM.render(
  <App/>,
  document.getElementById('app'),
);
