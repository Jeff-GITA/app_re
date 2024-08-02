import React from 'react';
import ReactDOM from 'react-dom/client';
import './render/index.css';
import App from './render/App';
// import reportWebVitals from './reportWebVitals';

// export PUBLIC_URL="/static"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();