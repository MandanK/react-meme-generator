import './App.css';
// /** @jsxImportSource @emotion/react */
// // import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';

// * A function to download the URL modified by user;
// * Thanks to Karl, reference: https://stackoverflow.com/questions/49668363/html5-download-attribute-not-working-when-download-external-pdf-file-on-chrome

function forceDownload(blob, filename) {
  // * Create an invisible anchor element
  const anchor = document.createElement('a');
  anchor.style.display = 'none';
  anchor.href = window.URL.createObjectURL(blob);
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);

  // * Trigger the download by simulating click
  anchor.click();

  // * Clean up
  window.URL.revokeObjectURL(anchor.href);
  document.body.removeChild(anchor);
}
function downloadResource(URL, filename) {
  // * If we dont know what is the filename, let's produce just a number
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
// * Function to define the variables
//* and also to create the useStates
// * in order to make the text boxes
// * the template names in selector element
// * and also the url of the templates
// * that we have used on the function above
function App() {
  const [memeTemplate, setMemeTemplate] = useState([]);
  const [topText, setTopText] = useState('To be or not to be...');
  const [bottomText, setBottomText] = useState('');
  const [memeTemplateName, setMemeTemplateName] = useState('aag');
  const [url, setUrl] = useState('https://api.memegen.link/images/ds.png');

  // * Let's fetch the templates, the code was found in internet
  useEffect(() => {
    const templateToFetch = async () => {
      try {
        const response = await fetch('https://api.memegen.link/templates/');
        const json = await response.json();
        setMemeTemplate(json);
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
        {/* Left and right ids are used in CSS only.*/}
        <div id="left">
          <h1 className="App-header">Meme Generator</h1>
          <form>
            {/* Labels to make text boxes}*/}
            <label htmlFor="top_text"> Top text</label>
            <input
              name="top_text"
              id="top_text"
              value={topText}
              onChange={(e) => {
                setTopText(e.target.value);
                let slash = '';
                if (bottomText === '') {
                  slash = '';
                } else {
                  slash = '/';
                }
                setUrl(
                  `https://api.memegen.link/images/${memeTemplateName}/${e.target.value}${slash}${bottomText}.jpg`,
                );
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  setUrl(
                    `https://api.memegen.link/images/${memeTemplateName}/${topText}/${bottomText}.jpg`,
                  );
                }
              }}
            />
            <br />
            <label htmlFor="bottom_text"> Bottom text</label>
            <input
              name="bottom_text"
              id="bottom_text"
              value={bottomText}
              onChange={(e) => {
                setBottomText(e.target.value);
                setUrl(
                  `https://api.memegen.link/images/${memeTemplateName}/${topText}/${e.target.value}.jpg`,
                );
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  setUrl(
                    `https://api.memegen.link/images/${memeTemplateName}/${topText}/${bottomText}.jpg`,
                  );
                }
              }}
            />
            <br />
            <label htmlFor="template_name"> Template</label>
            <input
              name="template_name"
              id="template_name"
              value={memeTemplateName}
              onChange={(e) => {
                setMemeTemplateName(e.target.value);
                setUrl(
                  `https://api.memegen.link/images/${memeTemplateName}/${topText}/${bottomText}.jpg`,
                );
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  setUrl(
                    `https://api.memegen.link/images/${memeTemplateName}/${topText}/${bottomText}.jpg`,
                  );
                }
              }}
            />
            <br />
          </form>
          {/* To create a selector elements for memes templates*/}
          <div className="userInputSection">
            <label htmlFor="image">Meme template: </label>
            {/* Creat a selector to list the memes templates */}
            <select
              id="image"
              placeholder="buzz"
              value={memeTemplateName}
              onChange={(event) => {
                setMemeTemplateName(event.currentTarget.value);
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  setUrl(
                    `https://api.memegen.link/images/${memeTemplateName}/${topText}/${bottomText}.jpg`,
                  );
                }
              }}
            >
              {/* Create a map to render an array of templates for the selector*/}
              {memeTemplate.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div>
            <button
              // * Create a button to send the modified URL based on the user template selection and text entry to API
              className="previewButton"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  setUrl(
                    `https://api.memegen.link/images/${memeTemplateName}/${topText}/${bottomText}.jpg`,
                  );
                }
              }}
              onClick={() => {
                // * As you can see, users by choosing the template, typing the text, modify the URL and this new version will be send to API
                setUrl(
                  `https://api.memegen.link/images/${memeTemplateName}/${topText}/${bottomText}.jpg`,
                );
              }}
            >
              Preview
            </button>
            <button
              className="downloadButton"
              onClick={() => {
                // * The download function on the top allows users to download the selected memes
                downloadResource(
                  `https://api.memegen.link/images/${memeTemplateName}/${topText}/${bottomText}.jpg`,
                );
              }}
            >
              Download
            </button>
          </div>
        </div>
        {/* to say that the button will go on the right side */}
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
