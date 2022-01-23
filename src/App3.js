import './App.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import randomColor from 'randomcolor';
import { useEffect, useState } from 'react';

// THE DOWNLOADING FUNCTION
function forceDownload(blob, filename) {
  // CREATE AN INVISIBLE ANCHOR ELEMENT
  const anchor = document.createElement('a');
  anchor.style.display = 'none';
  anchor.href = window.URL.createObjectURL(blob);
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);

  // TRIGGER THE DOWNLOAD
  anchor.click();

  // DOES THE CLEAN UP
  window.URL.revokeObjectURL(anchor.href);
  document.body.removeChild(anchor);
}
function downloadResource(URL, filename) {
  // WHEN A FILE NAME IS NOT SET, USE THE FILE NAME OF THE URL
  if (!filename) filename = URL.match(/\/([^/#?]+)[^/]*$/)[1];
  fetch(URL, {
    headers: new Headers({
      Origin: window.location.origin,
    }),
    mode: 'cors',
  })
    .then((response) => response.blob())
    .then((blob) => forceDownload(blob, filename))
    .catch((event) => console.error(event));
}

// Function to create meme div
function MemeDiv(userInput) {
  return (
    <div
      css={css`
        text-align: center;
        height: 100px;
        font-size: 40px;
        padding: 200px 0;
        //The background-color is replaced by the
        //color selected by user
        background-color: ${userInput.color};
      `}
    >
      <img
        data-test-id="meme-image"
        src={`https://api.memegen.link/images/both/${userInput.topText}/${userInput.bottomText}~q.png?height=450&width=800`}
        alt=""
      ></img>
    </div>
  );
}

// Header will only display things.
function App() {
  const [template, setTemplate] = useState('');

  const [image, setImage] = useState('');

  const [topText, setTopText] = useState('Your Text');

  const [bottomText, setBottomText] = useState('Your Text');

  const [url, setUrl] = useState('https://api.memegen.link/images/doge.png');
  const parameter = {
    luminosity: bottomText,
    hue: topText,
  };

  // FETCHING THE MEME TEMPLATE USING THE API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.memegen.link/templates/');
        const json = await response.json();
        setTemplate(json);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData().catch((err) => {
      console.error(err);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Meme Generator</h1>
          <form>
            <label htmlFor="top_text"> Top text</label>
            <input
              name="top_text"
              id="top_text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
            />
            <br />
            {/*todo update based on the top text*/}
            <h2>Bottom text:</h2>
            <input
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
            />
          </form>
          {/*<div>
            <button onClick={() => setColor(randomColor(parameter))}>
              Generate
            </button>
           Defining the props of ColoredDiv
            <MemeDiv topText={topText} bottomText={bottomText} />
          </div>*/}

          <div className="inputArea">
            <label htmlFor="previewImage">Meme template: </label>
            <select
              id="previewImage"
              placeholder="buzz"
              value={image}
              onChange={(event) => {
                setImage(event.currentTarget.value);
              }}
            >
              {template.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={() => {
                setUrl(
                  `https://api.memegen.link/images/${image}/${topText}/${bottomText}.jpg`,
                );
              }}
            >
              Preview meme
            </button>

            <button
              onClick={() => {
                downloadResource(
                  `https://api.memegen.link/images/${image}/${topText}/${bottomText}.jpg`,
                );
              }}
            >
              Download
            </button>
          </div>
          <div>
            <img data-test-id="meme-image" src={url} alt="Custom meme" />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
