const User = require('../models/user');

const getUserWithProfileAggregation = async (userId) => {
    try {
        const userAggregation = await User.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(userId) }  // Match the user by userId
            },
            {
                $lookup: {
                    from: 'profiles',  // The Profile collection
                    localField: '_id',  // Field in User collection
                    foreignField: 'userId',  // Field in Profile collection
                    as: 'profile'  // Alias for the combined result
                }
            },
            {
                $unwind: '$profile'  // Unwind the profile array to get an object
            },
            {
                $project: {
                    password: 0  // Exclude the password from the response
                }
            }
        ]);
        
        if (userAggregation.length === 0) {
            throw new Error('User not found');
        }
        
        return userAggregation[0];  // Return the combined user with profile
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getUserWithProfileAggregation
};
