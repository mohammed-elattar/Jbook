import React, { useEffect, useRef } from 'react';
import './preview.css';
interface PreviewProps {
  code: string;
  error: string;
}

const html = `
<html>
<head></head>
<body>
   <div id="root"></div>
   <script>
   const handleError = (error) => {
    const root = document.querySelector('#root');
    root.innerHTML = '<div style="color: red"><h4>Run time error</h4>'+ error + '</div>';
    throw error;
   }
   window.addEventListener('error', (event) => {
    event.preventDefault();    
    handleError(event.error);
   });
   window.addEventListener('message', (event) => {
       try {
           eval(event.data)
       } catch(error) {
          handleError(error); 
       }    
   }, false)
   </script>
</body>
</html>
 `;

const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframe = useRef<any>();
  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        ref={iframe}
        srcDoc={html}
        title='execute html code'
        sandbox='allow-scripts'
      />
      {error && <div className='preview-error'>{error}</div>}
    </div>
  );
};

export default Preview;
