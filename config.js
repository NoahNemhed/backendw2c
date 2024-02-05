const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { collection, doc, setDoc, query, getDocs, where, deleteDoc, updateDoc } = require("firebase/firestore")
const {  } = require('firebase/firestore')
const dotenv = require('dotenv');
const moveFromDatabaseToJson = require('./moveFromDatabaseToJson')
const removeDuplicateItems = require('./RemoveDuplicateItems')
const addSearchFieldName = require('./AddSearchFieldName')

dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: procces.env.PROJECT_ID,
  storageBucket: procces.env.STORAGE_BUCKET,
  messagingSenderId: procces.env.MESSAGING_SENDER_ID,
  appId: procces.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Reference to Firestore
const db = getFirestore(app); // Pass the app instance to getFirestore

const Products = collection(db, "Products");



module.exports = { db, Products };
