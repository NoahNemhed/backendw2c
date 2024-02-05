// Import required modules from Firebase
const { collection, getDocs, updateDoc } = require("firebase/firestore");

// Function to add a 'searchName' field to each product document in a Firestore collection
const addSearchNameField = async (Products) => {
    try {
      // Get all categories in the 'Products' collection
      const categoriesSnapshot = await getDocs(Products);
  
      // Iterate through each category
      for (const categoryDoc of categoriesSnapshot.docs) {
        const categoryPath = categoryDoc.ref.path;
  
        // Check if the category has a non-empty path
        if (categoryPath) {
          // Reference to the 'Items' subcollection within the category
          const categoryItemsCollection = collection(categoryDoc.ref, "Items");
  
          // Get all products in the category
          const productsSnapshot = await getDocs(categoryItemsCollection);
  
          // Iterate through each product in the category
          productsSnapshot.forEach(async (doc) => {
            const productData = doc.data();
  
            // Add a 'searchName' field with a lowercase value of the 'name' field without spaces
            const searchName = productData.name.toLowerCase().replace(/\s+/g, '');
  
            // Update the document with the new 'searchName' field
            await updateDoc(doc.ref, { searchName });
  
            console.log(`Added searchName field to product with id: ${doc.ref.id}`);
          });
        }
      }
  
      console.log('SearchName field added successfully.');
    } catch (error) {
      console.error('Error adding searchName field:', error);
    }
};

// Export the function for use in other modules
module.exports = addSearchNameField;

  