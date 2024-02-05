const fs = require('fs');
const csv = require('csv-parser');

function readCSVFile(csvFilePath, options, category) {
  return new Promise((resolve, reject) => {
    const data = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv(options))
      .on('data', (row) => {
        const link = row['Links'];
        const itemName = row['Name'];
        const priceUSD = row['Price ($)'];
        

        const productData = {
          link: link,
          itemName: itemName,
          priceUSD: priceUSD.replace("$", ""),
          Productcategory: category
        };

        data.push(productData);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/*const csvFilePath = './CSVFILES/Shoes3.csv';
const options = {
    from_line: 1,
    headers: ["Nr", "Name", "Link", "Price (¥)", "Price ($)", "Price (€)", "Links"]
};


readCSVFile(csvFilePath, options, "Shoes")
.then(data => {
  console.log(data)
}) */



module.exports = readCSVFile;