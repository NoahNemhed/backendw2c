const fs = require('fs');
const path = require('path');
const { collection, getDocs } = require("firebase/firestore")
const {   } = require('firebase/firestore')
 const moveFromDatabaseToJson = async (Products) => {
    try {
      // Get the reference to the Products collection
      const categoriesSnapshot = await getDocs(Products);
  
      for (const categoryDoc of categoriesSnapshot.docs) {
        const categoryPath = categoryDoc.ref.path;
        const categoryItemsCollection = collection(categoryDoc.ref, "Items");
  
        const category = categoryPath.split("/")[1];
        const productsSnapshot = await getDocs(categoryItemsCollection);
        
        // Adjusted file path relative to the client directory
        const filePath = path.join(__dirname, '../client/src/assets/ProductData', `${category}.json`);
  
        const productsData = productsSnapshot.docs.map(doc => doc.data());
  
        // Use fs.writeFile with a callback function
        fs.writeFile(filePath, JSON.stringify(productsData, null, 2), (err) => {
          if (err) {
            console.error(`Error writing data to file for category '${category}':`, err);
          } else {
            console.log(`Data for category '${category}' moved successfully to JSON file.`);
          }
        });
      }
  
    } catch (error) {
      console.error(`Error moving data for category '':`, error);
    }
  };


module.exports = moveFromDatabaseToJson