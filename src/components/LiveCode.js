import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
// Using the @site alias ensures this never breaks!

const LiveCodeEditor = ({ code: initialCode }) => {
  const [EditorTools, setEditorTools] = useState(null);
  const [editorCode, setEditorCode] = useState(initialCode.trim());
  const [runCode, setRunCode] = useState(initialCode.trim());

  useEffect(() => {
    const tools = require('react-live');
    setEditorTools(tools);
  }, []);

  if (!EditorTools) return <div className="live-code-output">Loading Editor...</div>;

  const { LiveProvider, LiveEditor, LiveError, LivePreview } = EditorTools;

  const handleReset = () => {
    const cleanCode = initialCode.trim();
    setEditorCode(cleanCode);
    setRunCode(cleanCode);
  };

  return (
    <div className="live-code-container">
      <LiveProvider code={runCode} noInline={true}>
        <div className="live-code-editor-wrapper">
          <LiveEditor 
            code={editorCode} 
            onChange={code => setEditorCode(code)} 
            style={{ fontFamily: 'monospace', fontSize: '14px' }} 
          />
        </div>
        <div className="live-code-controls">
          <button onClick={() => setRunCode(editorCode)} className="live-btn live-btn-run">▶ Run Code</button>
          <button onClick={handleReset} className="live-btn live-btn-reset">↺ Reset</button>
        </div>
        <LiveError className="live-code-error" />
        <div className="live-code-output">
          <span className="live-code-label">Output:</span>
          <hr style={{ margin: '10px 0', opacity: '0.1' }} />
          <LivePreview />
        </div>
      </LiveProvider>
    </div>
  );
};

export default function LiveCode(props) {
  return <BrowserOnly>{() => <LiveCodeEditor {...props} />}</BrowserOnly>;
}