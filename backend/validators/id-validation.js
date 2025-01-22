const idValidation = {
    id:{
        in:['params'],
        isMongoId:{ 
            errorMessage : 'Invalid id format'
        }
    }
}

export default idValidation