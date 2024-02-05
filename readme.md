W2C backend
Pandabuy Products Backend
Overview
This backend service is designed to fetch product data from CSV files, process the information, and upload it to Firebase Firestore. Additionally, it interacts with the Pandabuy platform to retrieve detailed product information such as sales, images, weight, dimensions, and more.

Technologies Used
Node.js: JavaScript runtime for executing server-side code.
Express.js: Web framework for building the API.
Firebase Firestore: Cloud-based NoSQL database for storing product data.
Axios: HTTP client for making requests to Pandabuy API.
Firebase Admin SDK: Official Node.js library for Firebase.
Cheerio: HTML parsing library for extracting data from HTML content.
CSV-Parser: CSV parsing library for reading data from CSV files.
Random-Useragent: Library for generating random user agents.
EventEmitter: Node.js module for implementing the observer pattern.
Axios: HTTP client for making requests to external APIs.
Features
CSV File Processing: Read product information from CSV files efficiently.
Firebase Integration: Upload processed data to Firebase Firestore for storage and retrieval.
Pandabuy Integration: Make requests to Pandabuy to gather detailed product information.
Duplicate Removal: Ensure data integrity by removing duplicate products in the Firestore database.