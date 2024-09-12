const { CatchAsync } = require("../errorHandling/utils");
const productModel = require("../Models/ProductModel");
const ApiFeatures = require("../utils/productApiFeatures");

exports.createProduct = CatchAsync(async function (req, res, next){
  const { price, name, rating, brand, catagory, gender, stock, discount } =
    req.body;
  const product = await productModel.create({
    price,
    name,
    rating,
    brand,
    catagory,
    gender,
    stock,
    discount,
  });
  res.status(201).json({
    status: "success",
    product,
  });
});


exports.getProduct = async (req, res, next) => {
    try {
        let features = new ApiFeatures(productModel, req.query)
            .filter() // Call filter method
            .sort() // Call sort method
             // Call pagination method
            .fieldlimiting(); // Call fieldlimiting method

        features=await features.pagination();
        const products = await features.mongooseQuery; // Execute the final query

        res.status(200).json({
            status: "Success",
            results: products.length,
            data: products
        });
    } catch (err) {
        next(err);
    }
};








// exports.getProduct=CatchAsync(async function(req,res,next){
//     console.log(req.query);

//     // // chaining method of Query

//     // strict coaded method more3 precised
//     // const product = await productModel.find().where("gender").equals("female");

//     // product result more specifice so we use .Query to avoid it
//     const QueryObj=res.query;
//     const productQuery =productModel.find();// if we dnt await it will gave a query object
//     const products=await productQuery; // when i await the Query object will gave result for the same ;

//      // there for to apply advance feature like pagination and sorting we can't await the find ()method from the get
//      // go as we need to play with the Query() object

//     // json model of Query
//     const product = await productModel.find(req.query)
//     res.status(200).json({

//         status:"Success",
//         product,
//     });
// });

// exports.getProduct = CatchAsync(async function (req, res, next) {
//   let queryObj = { ...req.query };
//   // Convert the query object to a string and replace query operators
//   // 51->53 bcoz passing normal Query in obj form will mis $ sigh as its a sign of mongos
//   let queryStr = JSON.stringify(queryObj);
//   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//   queryObj = JSON.parse(queryStr);

//   // Exclude certain keys that are not needed for filtering
//   const excludesKeys = ["page", "sort", "limit", "fields"];
//   excludesKeys.forEach((key) => {
//     delete queryObj[key];
//   });

//   // Initialize the product query
//   let productQuery = productModel.find(queryObj); // if we dnt await it will gave a query object

//   // Sorting
//   if (req.query.sort) {
//     // Check if sort exists, then split and join to format correctly
//     const sortingQuery = req.query.sort.split(",").join(" ");
//     productQuery = productQuery.sort(sortingQuery);
//   }

//   // pagination

//   // Pagination
//   // Extracting page and limit from query parameters, converting them to numbers
//   // If page or limit are not provided in the request, default values are used
//   const page = req.query.page * 1 || 1; // Default to page 1 if not specified
//   const limit = req.query.limit * 1 || 100; // Default to 100 items per page if not specified

//   // Calculate the number of documents to skip based on the current page
//   // For example, if page = 2 and limit = 10, skip = (2 - 1) * 10 = 10, so it skips the first 10 items
//   const skip = (page - 1) * limit;

//   // Apply the skip and limit to the query
//   // skip() skips the specified number of documents
//   // limit() limits the number of documents returned
//   productQuery = productQuery.skip(skip).limit(limit);

//   // Error handling for pagination
//   if (req.query.page) {
//     // Check if the page parameter is provided in the request
//     // Get the total number of documents in the collection
//     const numProducts = await productModel.countDocuments();

//     // If the skip value is greater than or equal to the total number of documents,
//     // it means the requested page does not exist, so throw an error
//     if (skip >= numProducts) throw new Error("This page does not exist!");
//   }

//   //limiting

//   // Projecting is the selection of some fields to be sent and not sending all fields
//   // It's a good idea to just request what is required. In Postman, we will create a request like this:
//   // /product?fields=description,likes
//   // For Mongoose, the query should look like this - query = query.select("likes description")
//   if (req.query.fields) {
//     // Handle field selection based on query parameters by converting the fields query string
//     // into a space-separated string format required by Mongoose select() method.
//     const fields = req.query.fields.split(",").join(" "); // e.g., 'description likes'
//     productQuery = productQuery.select(fields); // Selects only the specified fields
//   } else {
//     // Default behavior to exclude the __v field (a Mongoose internal version key)
//     productQuery = productQuery.select("-__v"); // Excludes the __v field if no specific fields are requested
//   }

//   const product = await productQuery; // when i await the Query object will gave result for the same ;

//   res.status(200).json({
//     status: "Success",
//     product,
//   });
// });

