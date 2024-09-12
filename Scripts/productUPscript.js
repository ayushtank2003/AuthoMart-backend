const Products = [
    { name: "Classic Hoodie", price: 49.99, rating: 4.5, brand: "ComfyWear", catagory: "hoodies", gender: "unisex", stock: 150, discount: 10 },
    { name: "Slim Fit Denim", price: 79.99, rating: 4.0, brand: "DenimX", catagory: "denim", gender: "male", stock: 200, discount: 15 },
    { name: "Casual Trousers", price: 39.99, rating: 3.8, brand: "UrbanStyle", catagory: "trowser", gender: "female", stock: 120, discount: 5 },
    { name: "Graphic T-shirt", price: 19.99, rating: 4.2, brand: "Trendy Tees", catagory: "tshirt", gender: "unisex", stock: 300, discount: 20 },
    { name: "Formal Shirt", price: 59.99, rating: 4.7, brand: "ElegantApparel", catagory: "shirt", gender: "male", stock: 80, discount: 12 },
    { name: "Summer T-shirt", price: 24.99, rating: 3.9, brand: "BreezeWear", catagory: "tshirt", gender: "female", stock: 180, discount: 8 },
    { name: "Denim Jacket", price: 99.99, rating: 4.6, brand: "DenimX", catagory: "denim", gender: "unisex", stock: 50, discount: 25 },
    { name: "Workout Hoodie", price: 45.00, rating: 4.3, brand: "ActiveFit", catagory: "hoodies", gender: "female", stock: 90, discount: 5 },
    { name: "Comfort Fit Trousers", price: 55.99, rating: 4.4, brand: "ComfyWear", catagory: "trowser", gender: "male", stock: 70, discount: 10 },
    { name: "Classic White Shirt", price: 49.50, rating: 4.8, brand: "SharpLook", catagory: "shirt", gender: "male", stock: 110, discount: 20 },
];

const url = "http://localhost:8080/product/CreateProduct";

for (let i = 0; i < Products.length; i++) {
    const product = Products[i];
    product.id = i + 1;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    })
    .then(response => {
        // Log response status and error messages
        if (!response.ok) {
            console.error(`Failed to create product ${product.name}:`, response.status, response.statusText);
            return response.json().then(err => { throw new Error(JSON.stringify(err)); });
        }
        return response.json();
    })
    .then(data => {
        console.log('Product created successfully:', data);
    })
    .catch((error) => {
        console.error('Error creating product:', error);
    });
}

