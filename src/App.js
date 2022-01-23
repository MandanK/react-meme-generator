import './App.css';
// /** @jsxImportSource @emotion/react */
// // import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';

// A function for downloading; reference: https://stackoverflow.com/questions/49668363/html5-download-attribute-not-working-when-download-external-pdf-file-on-chrome
function forceDownload(blob, filename) {
  // Create an invisible anchor element
  const anchor = document.createElement('a');
  anchor.style.display = 'none';
  anchor.href = window.URL.createObjectURL(blob);
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);

  // Trigger the download by simulating click
  anchor.click();

  // Clean up
  window.URL.revokeObjectURL(anchor.href);
  document.body.removeChild(anchor);
}
function downloadResource(URL, filename) {
  // If we dont know what is the filename, let's produce just a number
  if (!filename) filename = Math.random();
  fetch(URL, {
    headers: new Headers({
      Origin: window.location.origin,
    }),
    mode: 'cors',
  })
    .then((response) => response.blob())
    .then((blob) => forceDownload(blob, filename))
    .catch((e) => console.error(e));
}

function App() {
  const [template, setTemplate] = useState([]);
  const [topText, setTopText] = useState('To be or not to be...');
  const [bottomText, setBottomText] = useState('This is the question!');
  const [templateName, setTemplateName] = useState('');
  const [url, setUrl] = useState('https://api.memegen.link/images/ds.png');

  // Let's fetch the templates
  useEffect(() => {
    const templateToFetch = async () => {
      try {
        const response = await fetch('https://api.memegen.link/templates/');
        const json = await response.json();
        setTemplate(json);
      } catch (e) {
        console.error(e);
      }
    };
    templateToFetch().catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <main>
      <div className="App">
        <div id="left">
          <h1 className="App-header">Random meme Generator</h1>
          <form>
            <label htmlFor="top_text"> Top text</label>
            <input
              name="top_text"
              id="top_text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
            />
            <br />
            <label htmlFor="bottom_text"> Bottom text</label>
            <input
              name="bottom_text"
              id="bottom_text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
            />
            <br />
            <label htmlFor="template_name"> Template</label>
            <input
              name="template_name"
              id="template_name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <br />
          </form>
          <div className="inputArea">
            <label htmlFor="image">Meme template: </label>
            <select
              id="image"
              placeholder="buzz"
              value={templateName}
              onChange={(event) => {
                setTemplateName(event.currentTarget.value);
              }}
            >
              {template.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div>
            <button
              class="previewButton"
              onClick={() => {
                setUrl(
                  `https://api.memegen.link/images/${templateName}/${topText}/${bottomText}.jpg`,
                );
              }}
            >
              Preview meme
            </button>
            <button
              class="downloadButton"
              onClick={() => {
                downloadResource(
                  `https://api.memegen.link/images/${templateName}/${topText}/${bottomText}.jpg`,
                );
              }}
            >
              Download
            </button>
          </div>
        </div>
        <div id="right">
          <div>
            <img data-test-id="meme-image" src={url} alt="Custom meme" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
