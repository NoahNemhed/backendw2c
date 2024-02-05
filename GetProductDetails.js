const randomUseragent = require('random-useragent');

// Initial session data with a random user agent and predefined cookies
const session = {
    UserAgent: randomUseragent.getRandom(),
    Cookies: [
        { name: "_ga", value: "GA1.1.1978201636.1706024672", path: "/", domain: ".pandabuy.com" },
    ]
};

// Function to generate dynamic headers including randomized user agent
const dynamicHeaders = () => {
    const acceptLanguages = ["sv-SE", "sv;q=0.9", "en-US;q=0.8", "en;q=0.7"];
    const userAgent = randomUseragent.getRandom();

    return {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": acceptLanguages.join(","),
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": session.Cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; '),
        "User-Agent": session.UserAgent,
    };
};

/**
 * Function to fetch and process product details from Pandabuy.
 * @param {string} url - The product URL to fetch details for.
 * @param {number} retryCount - Number of retry attempts in case of errors.
 */
async function getProductDetails(url, retryCount = 6) {
    try {
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            try {
                // Generate dynamic headers for each attempt
                const headers = dynamicHeaders();

                // Fetch product details from Pandabuy API
                const response = await fetch("https://www.pandabuy.com/gateway/product/itemGet?url=" + url + "&userId=443009223", {
                    method: "GET",
                    headers: headers,
                });

                // If response is successful, extract and return specific product data
                if (response.ok) {
                    const xmlData = await response.text();
                    const itemData = extractSpecificData(xmlData);
                    return itemData;
                }

                // Handle rate-limiting (HTTP status 429) by retrying after a delay
                if (response.status === 429) {
                    const delay = getRetryDelay(attempt);
                    console.log(`Received 429. Retrying after ${delay} ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));

                    // Change user agent after each retry
                    session.UserAgent = randomUseragent.getRandom();
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error on attempt ${attempt}:`, error.message);
            }
        }

        console.error('All retry attempts failed.');
    } catch (error) {
        console.error('Error fetching or processing data:', error.message);
    }
}

/**
 * Function to calculate the retry delay based on the attempt number.
 * @param {number} attempt - The current retry attempt.
 * @returns {number} - The delay in milliseconds.
 */
function getRetryDelay(attempt) {
    const intervals = [1500, 3000, 5000, 10000, 20000, 4000]; // Adjusted intervals
    const index = Math.min(attempt - 1, intervals.length - 1);
    return intervals[index];
}

/**
 * Function to extract specific data from XML response.
 * @param {string} data - The XML data received from Pandabuy.
 * @returns {Object} - Extracted product details.
 */
async function extractSpecificData(data) {
    try {
        // Extract specific data from XML using regular expressions
        const xmlData = data;
        const priceRegex = /<price>(.*?)<\/price>/;
        const priceMatch = xmlData.match(priceRegex);
        const price = priceMatch ? priceMatch[1] : '';
        const roundedPrice = Math.round(price * 0.14 * 10) / 10;

        // Repeat similar extraction for other data fields (e.g., pic_url, sales, dimensions, weight, detailUrl)

        return { roundedPrice, sales, dimensions, weight, detailUrl, pic_url }

    } catch (error) {
        console.error('Error reading or extracting data from XML file:', error.message);
    }
}

module.exports = getProductDetails;
