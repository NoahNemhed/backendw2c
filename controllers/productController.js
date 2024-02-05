
const Product = require('../models/product');
const { db, Products } = require('../config');
const { doc, setDoc, collection, query, where, getDocs, addDoc, orderBy, limit, startAfter } = require('firebase/firestore');

exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    console.log(JSON.stringify(productData));

    const itemCategory = productData.ItemCategory;

    if (!itemCategory) {
      res.status(400).send({ error: 'Item category is missing' });
      return;
    }

    // Create a reference to the "Products" collection
    const productsCollection = collection(db, "Products");

    // Create a reference to the category document
    const categoryDocRef = doc(productsCollection, itemCategory);

    // Get the reference to the "Items" subcollection within the category document
    const categoryItemsCollection = collection(categoryDocRef, "Items");

    const querySnapshot = await getDocs(query(
      categoryItemsCollection,
      where("name", "==", productData.itemName || ""),
      where("affiliateLink", "==", productData.myAffiliateUrl || ""),
      where("pic_url", "==", productData.pic_url || "")
    ));

    console.log("Query snapshot.size : " + querySnapshot.size)
    

    if (querySnapshot.size > 0) {
      // Product with the same name already exists within the category
      res.send({ msg: 'Product with same URL or Name already exists.' });
      return;
    }
    const itemNameWithoutPattern = productData.itemName.replace(/\[\d*\]/, "").trim();

    const newProduct = new Product(
      itemNameWithoutPattern,
      productData.priceUSD,
      productData.sales,
      productData.dimensions,
      productData.weight,
      productData.qclink,
      productData.myAffiliateUrl,
      productData.pic_url
    );

    // Add the new product to the "Items" subcollection within the category document
    await addDoc(categoryItemsCollection, { ...newProduct });

    res.send({ msg: 'Product added' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};


// Update getProductsBySearch route
exports.getProductsBySearch = async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const pageSize = 25;

    const firestoreQuery = query(
      collection(db, 'Products'),
      orderBy('searchname'), // Update with your sorting criteria
      where('searchname', '>=', searchQuery.toLowerCase().trim()),
      where('searchname', '<=', searchQuery.toLowerCase().trim() + '\uf8ff'),
      limit(pageSize)
    );

    const productsSnapshot = await getDocs(firestoreQuery);
    const products = productsSnapshot.docs.map(doc => doc.data());

    res.send({ products });
  } catch (error) {
    console.error('Error in getProductsBySearch route:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}




// Update getProductsByCategory route
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category || ''; // Use query instead of params
    const pageSize = 25;

    // Category-based fetching
    const firestoreQuery = query(
      collection(db, 'Products', category, 'Items'),
      orderBy('name'), // Update with your sorting criteria
      where('name', '>=', ''), // Update with your criteria
      where('name', '<=', '\uf8ff'), // Update with your criteria
      limit(pageSize)
    );

    const productsSnapshot = await getDocs(firestoreQuery);
    const products = productsSnapshot.docs.map(doc => doc.data());

    res.send({ products });
  } catch (error) {
    console.error('Error in getProductsByCategory route:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};











  