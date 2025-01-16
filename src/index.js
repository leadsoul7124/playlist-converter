import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App';
import reportWebVitals from './reportWebVitals';

const clientId = "783412671216-vg835md5ieehdha954cslttagprtf1h6.apps.googleusercontent.com"; // Google Cloud Console에서 받은 Client ID를 여기에 입력하세요.

ReactDOM.render(
  <GoogleOAuthProvider clientId={clientId}
    redirectUri="https://dd0f-175-123-8-202.ngrok-free.app/oauth2callback"
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
  document.getElementById("root")
);

reportWebVitals();