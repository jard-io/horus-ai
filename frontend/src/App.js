import React, { useState, useRef } from 'react';
import './App.css';

const App = () => {
  const [text, setText] = useState('What is in this picture?');
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // holds image url preview
  const [answer, setAnswer] = useState('');
  const imageInputRef = useRef();

  // function handles image changes
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result); // set the preview URL
      };
      reader.readAsDataURL(file);
    }
  }
  // function handles submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('text', text);

    // if there's an image
    if (image) {
      formData.append('image', image);
    }
    
    // send to fastapi
    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      setAnswer(result.answer);
      console.log(result);

      // handle response
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="container">
      <main>
        <div className="hero">
          <div className="title">
            <h1 className="logo">Horus</h1>
            <h1 className="icon">🐦‍⬛</h1>
          </div>
          <h2>is an AI-powered tool that can answer your questions about any image.</h2>
        </div>
        <div className="image-area">
          {/* {!imagePreviewUrl && <label> Image will appear here </label>} */}
          {imagePreviewUrl && <img className="image-preview" src={imagePreviewUrl} alt="Image preview" />}
        </div>
        <div className="form-area">
          <form onSubmit={handleSubmit}>

            <div className="input-1">
              <label>
                1. Upload an image:
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  ref={imageInputRef}
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="input-2">
              <label>
                2. Ask a question:
                <input
                  type="text"
                  placeholder="What is in this picture?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </label>
            </div>
            
            <button type="submit">Submit</button>

            </form>
        </div>


        <div className="answer">
            <p>{answer && `Answer: ${answer}`}</p>
        </div>
      </main>
    </div>
  );
}

export default App;
