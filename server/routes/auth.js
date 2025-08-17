const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const ordersPath = path.resolve(__dirname, '../data/orders.json');
const adminsPath = path.resolve(__dirname, '../data/admins.json');

const ordersRaw = fs.readFileSync(ordersPath, 'utf-8');
const adminsRaw = fs.readFileSync(adminsPath, 'utf-8');

console.log('ordersRaw:', ordersRaw);
console.log('adminsRaw:', adminsRaw);

if (!ordersRaw || !adminsRaw) {
  throw new Error('קובץ orders.json או admins.json ריק!');
}

const orders = JSON.parse(ordersRaw);
const admins = JSON.parse(adminsRaw);
