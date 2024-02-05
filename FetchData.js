// Import required modules
const cheerio = require('cheerio');
const readCSVFile = require('./ReadCsv');  // Import custom CSV reader module
const getProductDetails = require('./GetProductDetails');  // Import custom module for fetching product details
const EventEmitter = require('events');  // Import EventEmitter for handling asynchronous events
const axios = require('axios');

// Define CSV file path and options for parsing
const csvFilePath = './CSVFILES/Shoes3.csv';
const options = {
    from_line: 1,
    headers: ["Name", "Link", "Price (¥)", "Price ($)", "Price (€)", "Links"]
};

// Create an EventEmitter for handling asynchronous requests
const fetchEmitter = new EventEmitter();
fetchEmitter.setMaxListeners(25);

// Function to process the CSV file and fetch product details
async function processCSV() {
    try {
        // Specify the category for the products
        const category = 'Shoes';

        // Read data from the CSV file using the provided options
        const data = await readCSVFile(csvFilePath, options, category);

        // Iterate through each product in the CSV data
        for (const product of data) {
            const url = product.link;

            // Skip processing if the URL is empty, contains "Links," or includes "yupoo"
            if (url === "" || url === "Links" || url.includes("yupoo")) {
                console.log("Skipping Bad Link : " + url);
                continue;
            } else {
                try {
                    const requestId = url; 

                    // Function to handle completed requests and remove the listener
                    const onRequestCompleted = (completedRequestId) => {
                        if (completedRequestId === requestId) {
                            console.log(`Request completed for URL: ${url}`);
                            fetchEmitter.removeListener('requestCompleted', onRequestCompleted);
                        }
                    };

                    // Set up the listener for the 'requestCompleted' event
                    fetchEmitter.once('requestCompleted', onRequestCompleted);

                    // Fetch HTML content from a conversion tool API
                    const conversionResponse = await fetch("https://www.jadeship.com/tools/converter?url=" + url, {
                        method: "GET",
                        headers: {
                            accept: "*/*",
                            "accept-language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7",
                            "cache-control": "no-cache",
                            "next-router-state-tree": "%5B%22%22%2C%7B%22children%22%3A%5B%22tools%22%2C%7B%22children%22%3A%5B%22converter%22%2C%7B%22children%22%3A%5B%22__PAGE__%3F%7B%5C%22url%5C%22%3A%5C%22https%3A%2F%2Fpandabuy.page.link%2FFhgf1FBq22ikR9q48%5C%22%7D%22%2C%7B%7D%2Cnull%2C%22refetch%22%5D%7D%5D%7D%5D%7D%5D",
                            "next-url": "/tools/converter",
                            pragma: "no-cache",
                            rsc: "1",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin"
                        },
                        referrer: "https://www.jadeship.com/tools/converter",
                        referrerPolicy: "strict-origin-when-cross-origin",
                        body: null,
                        mode: "cors",
                        credentials: "omit"
                    });

                    try {
                        // Extract necessary data from the HTML response
                        const html = await conversionResponse.text();
                        // Further processing to extract URL details
                        // ...

                        // Fetch product details using the extracted original URL
                        const ProductDetails = await getProductDetails(itemOriginalUrl);

                        // Check if the product details are valid
                        if (ProductDetails.sales == '' && ProductDetails.pic_url == '') {
                            continue;  // Skip to the next iteration of the loop
                        }

                        // Prepare product data for storage
                        const productData = {
                            "myAffiliateUrl": myAffiliateUrl,
                            "itemName": product.itemName.replace('"', ""),
                            "priceUSD": product.priceUSD,
                            "ItemCategory": "Shoes",
                            "qclink": qcURL,
                            "pic_url": ProductDetails.pic_url,
                            "sales": ProductDetails.sales,
                            "weight": ProductDetails.weight,
                            "dimensions": ProductDetails.dimensions
                        };

                        // Send a POST request to the server to create a new product
                        const response = await axios.post('http://localhost:3000/createProduct', productData);

                        // Check the response from the server
                        if (response.data.msg === 'Product added') {
                            console.log('Product added successfully!');
                            // Emit the 'requestCompleted' event
                            fetchEmitter.emit('requestCompleted', url);

                        } else {
                            console.error('Error adding product:', response.data.error);
                        }
                        // Emit the 'requestCompleted' event
                        fetchEmitter.emit('requestCompleted', url);
                    } catch (error) {
                        console.error('Error fetching QC link:', error);
                    }
                } catch (error) {
                    console.error('Error fetching URL:', error);
                }
            }
            // Introduce a delay between requests
            await new Promise(resolve => setTimeout(resolve, 25));
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Trigger the CSV processing function
processCSV();
