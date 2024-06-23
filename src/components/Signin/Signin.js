import React, { useState } from 'react';
import axios from 'axios';

const Signin = ({ onRouteChange, loadUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitSignin = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    axios.post('http://localhost:3080/signin', {
      email: email,
      password: password
    })
      .then(response => {
        const user = response.data;
        if (user.id) {
          loadUser(user);
          onRouteChange('home');
        }
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  };

  return (
    <div>
      <article className="br3 ba shadow b--black-10 mv4 w-100 w-50-m w-25-l mw5 center">
        <main className="pa4 black-80">
          <form className="measure" onSubmit={onSubmitSignin}>
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input 
                  className="pa2 input-reset  bg-transparent hover-bg-black hover-white w-100" 
                  type="email" 
                  name="email-address" 
                  id="email-address" 
                  onChange={onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input 
                  className="b pa2 input-reset  bg-transparent hover-bg-black hover-white w-100" 
                  type="password" 
                  name="password" 
                  id="password" 
                  onChange={onPasswordChange}
                />
              </div>
            </fieldset>
            
            <div className="">
              <input 
                
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                type="submit" 
                value="Sign in" 
              />
            </div>
            <div className="lh-copy mt3">
              <p onClick={() => onRouteChange('register')} className="f6 link dim black db">Register</p>
            </div>
          </form>
        </main>
      </article>
    </div>
  );
};

export default Signin;
