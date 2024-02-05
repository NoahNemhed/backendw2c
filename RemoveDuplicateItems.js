const { collection, query, getDocs, where, deleteDoc } = require("firebase/firestore")

const removeDuplicateProducts = async (Products) => {
    try {
      // Get all categories
      const categoriesSnapshot = await getDocs(Products);
  
      // Iterate through each category
      for (const categoryDoc of categoriesSnapshot.docs) {
        const categoryPath = categoryDoc.ref.path;
  
        // Check if the category has a non-empty path
        if (categoryPath) {
          const categoryItemsCollection = collection(categoryDoc.ref, "Items");
  
          // Get all products in the category
          const productsSnapshot = await getDocs(categoryItemsCollection);
  
          const uniqueProducts = new Map();
  
          // Iterate through each product in the category
          productsSnapshot.forEach((doc) => {
            const productData = doc.data();
            const key = `${productData.pic_url}-${productData.myAffiliateUrl}`;
  
            // Check if the product with the same pic_url and affiliateLink already exists
            if (!uniqueProducts.has(key)) {
              uniqueProducts.set(key, doc);
            }
          });
  
          console.log('Category:', categoryPath);
          console.log('Total products (before removal):', productsSnapshot.size);
          console.log('Unique products (before removal):', uniqueProducts.size);
  
  // Remove duplicate products
  uniqueProducts.forEach(async (productDoc) => {
    const productData = productDoc.data(); // Retrieve product data
  
    const picUrlQuerySnapshot = await getDocs(
      query(categoryItemsCollection, where("pic_url", "==", productData.pic_url))
    );
  
    const matchingProducts = picUrlQuerySnapshot.docs.filter(
      (doc) => doc.data().myAffiliateUrl === productData.myAffiliateUrl
    );
  
    if (matchingProducts.length > 1) {
      matchingProducts.slice(1).forEach(async (duplicateDoc) => {
        await deleteDoc(duplicateDoc.ref);
        console.log(`Deleted duplicate product with id: ${duplicateDoc.ref.id}`);
      });
    }
  });
  
  
          // Get all products in the category after removal
          const updatedProductsSnapshot = await getDocs(categoryItemsCollection);
          const updatedUniqueProducts = new Map();
  
          // Iterate through each product in the category after removal
          updatedProductsSnapshot.forEach((doc) => {
            const productData = doc.data();
            const key = `${productData.pic_url}-${productData.myAffiliateUrl}`;
  
            // Check if the product with the same pic_url and affiliateLink already exists
            if (!updatedUniqueProducts.has(key)) {
              updatedUniqueProducts.set(key, doc);
            }
          });
  
          console.log('Total products (after removal):', updatedProductsSnapshot.size);
          console.log('Unique products (after removal):', updatedUniqueProducts.size);
        }
      }
  
      console.log('Duplicate products removed successfully.');
    } catch (error) {
      console.error('Error removing duplicate products:', error);
    }
  };



  module.exports = removeDuplicateProducts