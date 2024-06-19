const yup = require ('yup')
// const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[]/


const validateUser = (schema) => (req, res, next) => {
    try {
        const body = req.body
        schema.validateSync( body , {abortEarly: false})
        next()
    } catch (error) {
        res.status(400).send({message: 'error while validating' , error})
    }
}


const validateSchema = yup.object().shape({
    userName : yup.string().required(true, 'Username is required').min(4, "Username must be at least four letters"),
    email : yup.string().required(true, 'Email is required').email(true, 'Must be a valid email'),
    password : yup.string().required(true, 'Password is required').min(6 , 'must be at least 6 chars')


})

const validateLogin = (schema) => (req, res, next) => {
    try {
        const body = req.body
        schema.validateSync( body , {abortEarly: false})
        next()
    } catch (error) {
        res.status(400).send({message: 'error while validating' , error})
        
    }
}

const validateLoginSchema = yup.object().shape({
    email : yup.string().required(true, 'Email is required').email(true, 'Must be a valid email'),
    password : yup.string().required(true, 'Password is required').min(6 , 'must be at least 6 chars')


})

module.exports = {validateSchema, validateUser ,validateLoginSchema, validateLogin}

