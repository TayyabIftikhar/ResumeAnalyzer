// const express = require('express');
import express from 'express';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter); 


//@name and @description and @access private
// module.exports = app;
export default app;