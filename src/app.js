// const express = require('express');
import express from 'express';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);



// module.exports = app;
export default app;