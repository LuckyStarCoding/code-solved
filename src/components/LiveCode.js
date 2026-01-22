import React, { useState, useEffect, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import '../css/live-editor.css';

const LiveCodeEditor = ({ code: initialCode }) => {
  const [EditorTools, setEditorTools] = useState(null);
  const [editorCode, setEditorCode] = useState(initialCode.trim());
  const iframeRef = useRef(null);

  useEffect(() => {
    // Dynamic import for react-live to support SSR
    const tools = require('react-live');
    setEditorTools(tools);
  }, []);

  // Phase 2 & 5: The Iframe Template with CSP and Safe Rendering
  const iframeHtml = `


  
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Security-Policy" 
            content="default-src 'none'; 
                     script-src 'unsafe-inline' 'unsafe-eval'; 
                     style-src 'unsafe-inline';">
        <style>
          body { font-family: sans-serif; color: #333; margin: 0; padding: 10px; font-size: 14px; }
          .log-line { border-bottom: 1px solid #eee; padding: 2px 0; font-family: monospace; }
          .error { color: #ff0000; }
        </style>
      </head>
      <body>
        <div id="output"></div>
        <script>
          const outputDiv = document.getElementById('output');
          
          // Phase 5: Safe Logging using textContent
          const logToScreen = (msg, isError = false) => {
            const line = document.createElement('div');
            line.className = isError ? 'log-line error' : 'log-line';
            line.textContent = '> ' + (typeof msg === 'object' ? JSON.stringify(msg) : msg);
            outputDiv.appendChild(line);
          };

          window.addEventListener('message', (event) => {
            const { action, code } = event.data;
            if (action === 'run') {
              outputDiv.innerHTML = ''; // Clear previous output
              try {
                // Phase 4: IIFE Wrapper for scope isolation
                (function() {
                  const result = eval(code);
                  if (result !== undefined) logToScreen(result);
                })();
              } catch (err) {
                logToScreen(err.message, true);
              }
            }
          });
        </script>
      </body>
    </html>
  `;

  const handleRun = () => {
    if (iframeRef.current) {
      // Phase 3: Injection Guard & Stringify
      const sanitizedCode = editorCode.replace(/<\/script>/g, '<\\/script>');
      
      // Send code to sandbox via postMessage
      iframeRef.current.contentWindow.postMessage(
        { action: 'run', code: sanitizedCode }, 
        '*'
      );
    }
  };

  const handleReset = () => {
    setEditorCode(initialCode.trim());
  };

  if (!EditorTools) return <div className="live-code-output">Loading Editor...</div>;

  const { LiveProvider, LiveEditor } = EditorTools;

  return (
    <div className="live-code-container">
      <LiveProvider code={editorCode}>
        <div className="live-code-editor-wrapper">
          <LiveEditor 
            onChange={code => setEditorCode(code)} 
            style={{ fontFamily: 'monospace', fontSize: '14px' }} 
          />
        </div>

        <div className="live-code-controls">
          <button onClick={handleRun} className="live-btn live-btn-run">▶ Run Code</button>
          <button onClick={handleReset} className="live-btn live-btn-reset">↺ Reset</button>
        </div>
        
        <div className="live-code-output">
          <span className="live-code-label">Secure Sandbox Output:</span>
          <hr style={{ margin: '10px 0', opacity: '0.1' }} />
          
          {/* Phase 1: The Isolation Layer (Sandboxed iFrame) */}
          <iframe
            ref={iframeRef}
            title="Secure Sandbox"
            sandbox="allow-scripts"
            srcDoc={iframeHtml}
            style={{ width: '100%', height: '150px', border: 'none', background: '#f9f9f9' }}
          />
        </div>
      </LiveProvider>
    </div>
  );
};

export default function LiveCode(props) {
  return <BrowserOnly>{() => <LiveCodeEditor {...props} />}</BrowserOnly>;
}