import React, { useRef } from "react";
import { useAppVisible } from "./utils";
import { useState } from 'react';

import { Editor } from '@monaco-editor/react';
import debounce from 'lodash/debounce';


function App() {
  const [result, setResult] = useState("");

  function handleEditorChange(value: string | undefined, event: any) {
    if (!value) { return; }

    debounce(() => {
      logseq.DB.datascriptQuery(value).then((res) => {
        setResult(JSON.stringify(res, null, 2));      
      }).catch((err) => {
        setResult(err.message);
      });
    }, 300)();
  }

  const innerRef = useRef<HTMLDivElement>(null);
  const visible = useAppVisible();
  const defaultValue = `
  [:find (pull ?b [*]) 
  :where 
    [?b :block/name]
    [?b :block/properties ?prop]
    [(get ?prop :type) ?type]
  ]`

  if (visible) {
    return (
      <main
        className="backdrop-filter backdrop-blur-md fixed inset-0 flex items-center justify-center flex"
        onClick={(e) => {
          if (innerRef.current == e.target) {
            window.logseq.hideMainUI();
          }
        }}
      >
        <div className="grid grid-cols-2 gap-2 h-full grow p-40" ref={innerRef}>
          <div className="text-size-2em">
            <Editor height="100%" width="100%" theme="vs-dark" defaultLanguage="clojure" defaultValue={defaultValue} options={{minimap: {enabled: false}}} onChange={handleEditorChange} />
          </div>
          <div className="text-size-2em">
            <Editor height="100%" width="100%" theme="vs-dark" defaultLanguage="json" value={result} options={{minimap: {enabled: false}, lineNumbers: "off", readOnly: true}} />
          </div>
        </div>
      </main>
    );
  }
  return null;
}

export default App;
