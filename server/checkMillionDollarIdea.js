//`checkMillionDollarIdea` that will come in handy in some /api/ideas routes. 
// Write this function in the **server/checkMillionDollarIdea.js** file. 
// This function will make sure that any new or updated ideas are still worth at least one million dollars! 
// The total value of an idea is the product of its `numWeeks` and `weeklyRevenue` properties.

const checkMillionDollarIdea = (req, res, next) => {
    const newIdeaPayload = req.body;
    if (newIdeaPayload.numWeeks && newIdeaPayload.weeklyRevenue) {
        const ideaValue = Number(newIdeaPayload.numWeeks) * Number(newIdeaPayload.weeklyRevenue);
        if (ideaValue >= 1000000) return next();
        return next(new Error('Please enter an idea worth greater than or equal to $1MM.'));
    } else {
        return next(new Error('Please enter a valid numWeeks and weeklyRevenue for the idea.'));
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
