import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Web3Provider from './Web3Provider';
import { BrowserRouter } from "react-router-dom";
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

ReactDOM.render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Web3Provider>
                <App />
            </Web3Provider>
        </ThemeProvider>
    </BrowserRouter>
    , document.getElementById('root'));

