/**
 * Validation middleware that checks the body of a request to ensure it has the given properties
 * @param  {...any} properties Array of properties to be checked if included in request body
 * @returns 
 */
 function hasProperties (...properties){
    return function(req,res,next){
        const {data = {}} = req.body
        try{
            properties.forEach((property)=>{
                if(!data[property]){
                    const error = new Error(`A ${property} is required`)
                    error.status=400
                    throw error
                }
            })
            next()
        } catch (error){
            next(error)
        }
    }
}
module.exports= hasProperties