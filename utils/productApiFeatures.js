class ApiFeatures {
    constructor(model, reqQuery) {
        this.model = model; // Mongoose model used for querying the database
        this.reqQuery = reqQuery; // Query parameters from the request
    }

    // Method to handle filtering of data based on query parameters
    filter() {
        let query = { ...this.reqQuery }; // Create a copy of the query parameters

        // STEP1: Exclude certain fields from filtering and keep only relevant fields
        const excludeFields = ["sort", "page", "fields", "limit"]; // Fields to exclude from filtering
        excludeFields.forEach((field) => delete query[field]); // Remove excluded fields

        let queryStr = JSON.stringify(query); // Convert the query object to a JSON string
        // Replace MongoDB comparison operators (gte, gt, lte, lt) with their MongoDB equivalents
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => "$" + match
        );
        query = JSON.parse(queryStr); // Parse the updated query string back to an object

        this.mongooseQuery = this.model.find(query); // Apply the filtering to the Mongoose query
        return this; // Return the instance for method chaining
    }

    // Method to handle sorting based on query parameters
    sort() {
        // Sorting
        if (this.reqQuery.sort) {
            // If a sort parameter is provided, split by comma and join with space for Mongoose
            this.reqQuery.sort = this.reqQuery.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(this.reqQuery.sort); // Apply sorting
        } else {
            // Default sorting by creation date in descending order
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        }
        return this; // Return the instance for method chaining
    }

    // Method to handle pagination based on query parameters
    async pagination() {
        const page = this.reqQuery.page || 1; // Default to page 1 if not provided
        const limit = this.reqQuery.limit || 100; // Default to 100 items per page if not provided
        const skipValue = (page - 1) * limit; // Calculate how many items to skip

        this.mongooseQuery = this.mongooseQuery.skip(skipValue).limit(limit); // Apply pagination

        // Error handling for invalid page number
        if (this.reqQuery.page) {
            const numPosts = await this.model.countDocuments(); // Get the total number of documents
            if (skipValue >= numPosts) // If skip exceeds the number of documents, return an error
                return next(new AppError("This page does not exist!", 404));
        }
        return this; // Return the instance for method chaining
    }

    // Method to handle field limiting based on query parameters
    fieldlimiting() {
        if (this.reqQuery.fields) {
            // If fields parameter is provided, split by comma and join with space for Mongoose
            this.reqQuery.fields = this.reqQuery.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(this.reqQuery.fields); // Select specific fields
        } else {
            // Default behavior: exclude the __v field (versioning field used by Mongoose)
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this; // Return the instance for method chaining
    }
}

module.exports = ApiFeatures; // Export the class for use in other modules
