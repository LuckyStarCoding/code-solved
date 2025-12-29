import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const LiveCodeEditor = ({ code: initialCode }) => {
  const [EditorTools, setEditorTools] = useState(null);
  const [editorCode, setEditorCode] = useState(initialCode.trim());
  const [iframeDoc, setIframeDoc] = useState('');

  useEffect(() => {
    // Dynamic import for react-live to handle Docusaurus SSR
    const tools = require('react-live');
    setEditorTools(tools);
  }, []);

const generateSafeHtml = (userCode) => {
    // 1. ESCAPE: Prevent script tag breakout
    const sanitizedCode = userCode.replace(/<\/script>/g, '<\\/script>');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline';">
          <style>
            body { font-family: -apple-system, sans-serif; padding: 15px; line-height: 1.5; color: #333; }
            #output { font-family: 'Fira Code', monospace; font-size: 13px; white-space: pre-wrap; }
            .error-box { color: #d73a49; background: #ffeef0; padding: 10px; border-radius: 4px; border: 1px solid #f97583; font-size: 13px; }
            .hint { color: #6e7681; font-size: 11px; margin-top: 5px; display: block; }
          </style>
        </head>
        <body>
          <div id="output"></div>
          <script>
            (function() {
              const outputDiv = document.getElementById('output');
              
              const logToScreen = (msg) => {
                const line = document.createElement('div');
                line.textContent = '> ' + (typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg);
                outputDiv.appendChild(line);
              };

              window.render = logToScreen;
              window.console.log = logToScreen;

              try {
                // 2. EXECUTION: Using eval to capture the last expression result
                const result = eval(${JSON.stringify(sanitizedCode)});
                
                if (result !== undefined) {
                  logToScreen(result);
                }
              } catch (err) {
                const errDiv = document.createElement('div');
                errDiv.className = 'error-box';
                
                // 3. CLARITY: Check for JSX/HTML tags (which cause the '<' error)
                if (err.message.includes("Unexpected token '<'") || err.name === 'SyntaxError') {
                   errDiv.innerHTML = '<strong>Syntax Error:</strong> HTML/JSX tags detected.';
                   const hint = document.createElement('span');
                   hint.className = 'hint';
                   hint.textContent = 'This editor supports Pure JavaScript logic. Please use strings like "Hello" instead of <div>Hello</div>.';
                   errDiv.appendChild(hint);
                } else {
                   errDiv.innerHTML = '<strong>Runtime Error:</strong> ';
                   const msg = document.createElement('span');
                   msg.textContent = err.message;
                   errDiv.appendChild(msg);
                }
                
                document.body.appendChild(errDiv);
              }
            })();
          </script>
        </body>
      </html>
    `;
  };
  if (!EditorTools) return <div>Loading Secure Editor...</div>;
  const { LiveProvider, LiveEditor } = EditorTools;

  const handleRun = () => setIframeDoc(generateSafeHtml(editorCode));
  const handleReset = () => {
    setEditorCode(initialCode.trim());
    setIframeDoc('');
  };

  return (
    <div className="live-code-container" style={{ border: '1px solid #30363d', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
      <LiveProvider code={editorCode} noInline={true}>
        {/* Input Area */}
        <div style={{ background: '#0d1117', padding: '10px' }}>
          <LiveEditor 
            onChange={code => setEditorCode(code)} 
            style={{ fontFamily: 'monospace', fontSize: '14px' }} 
          />
        </div>

        {/* Action Bar */}
        <div style={{ padding: '8px 15px', background: '#161b22', borderTop: '1px solid #30363d', display: 'flex', gap: '10px' }}>
          <button onClick={handleRun} className="live-btn live-btn-run">▶ Run Code</button>
          <button onClick={handleReset} className="live-btn live-btn-reset">↺ Reset</button>
        </div>

        {/* Sandbox Output */}
        <div style={{ background: '#ffffff', padding: '15px' }}>
          <small style={{ color: '#6e7681', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px' }}>
            🔒 Sandboxed Output
          </small>
          <iframe
            title="Secure Sandbox"
            sandbox="allow-scripts" 
            srcDoc={iframeDoc}
            style={{ width: '100%', height: '200px', border: 'none', marginTop: '10px' }}
          />
        </div>
      </LiveProvider>
    </div>
  );
};

export default function LiveCode(props) {
  return <BrowserOnly>{() => <LiveCodeEditor {...props} />}</BrowserOnly>;
}