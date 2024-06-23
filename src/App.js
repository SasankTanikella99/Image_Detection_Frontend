import React, { useState } from 'react';
import ParticlesBg from 'particles-bg';
import axios from 'axios';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

const App = () => {
  const [state, setState] = useState(initialState);

  const loadUser = (data) => {
    setState(prevState => ({
      ...prevState,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    }));
  };

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  };

  const displayFaceBox = (box) => {
    setState(prevState => ({ ...prevState, box }));
  };

  const onInputChange = (event) => {
    setState(prevState => ({ ...prevState, input: event.target.value }));
  };

  const onButtonSubmit = () => {
    const { input, user } = state;

    setState(prevState => ({ ...prevState, imageUrl: input }));

    axios.post('https://image-detection-backend-x4an.onrender.com/imageurl', {
      input: input
    })
      .then(response => {
        if (response.data) {
          return axios.put('https://image-detection-backend-x4an.onrender.com/image', {
            id: user.id
          });
        } else {
          throw new Error('Failed to detect image URL');
        }
      })
      .then(response => {
        setState(prevState => ({
          ...prevState,
          user: {
            ...prevState.user,
            entries: response.data
          }
        }));
        displayFaceBox(calculateFaceLocation(response.data)); // Invoke these functions here
      })
      .catch(err => console.error('Error:', err));
  };

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setState(initialState);
    } else if (route === 'home') {
      setState(prevState => ({ ...prevState, isSignedIn: true }));
    }
    setState(prevState => ({ ...prevState, route }));
  };

  const { isSignedIn, imageUrl, route, box } = state;

  return (
    <div className="App">
      <ParticlesBg type="square" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      { route === 'home'
        ? <div>
            <Logo />
            <ImageLinkForm
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        : (
          route === 'signin'
          ? <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
          : <Register loadUser={loadUser} onRouteChange={onRouteChange} />
        )
      }
    </div>
  );
};

export default App;
