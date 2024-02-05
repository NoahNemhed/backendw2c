class Product {
  constructor(name, price, sales, dimensions, weight, qualityCheckLink, affiliateLink, pic_url) {
      this.name = name;
      this.price = price;
      this.sales = sales;
      this.dimensions = dimensions;
      this.weight = weight;
      this.qualityCheckLink = qualityCheckLink;
      this.affiliateLink = affiliateLink;
      this.pic_url = pic_url;
  }
}

module.exports = Product;
