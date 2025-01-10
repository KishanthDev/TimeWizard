import User from "../models/user-model.js"
export const registerUserValidation = {
    name:{
        in:["body"],
        trim:true,
        exists:{
            errorMessage:"name field is required"
        },
        notEmpty:{
            errorMessage:"name should not be empty"
        }
    },email:{
        in:["body"],
        trim:true,
        normalizeEmail:true,
        exists:{
            errorMessage:"Email field is required"
        },
        notEmpty:{
            errorMessage:"Email should not be empty"
        },
        isEmail:{
            errorMessage:"Email should be in valid format"
        },
        custom:{
            options:async function (value){
                const user = await User.findOne({email:value})
                if(user){
                    throw new Error("Email already taken")
                }else{
                    return true
                }
            }
        }
    },
    username:{
        in:["body"],
        trim:true,
        exists:{
            errorMessage:"Username field is required"
        },
        notEmpty:{
            errorMessage:"Username should not be empty"
        },
        custom:{
            options:async (value) => {
                const user = await User.findOne({username:value})
                if(user){
                    throw new Error("UserName is already taken")
                }else{
                    return true
                }
            }
        }
    },
    password:{
        in:["body"],
        trim:true,
        exists:{
            errorMessage:"password field is required"
        },
        notEmpty:{
            errorMessage:"password should not be empty"
        },isStrongPassword:{
            options:{
                minLength:8,
                minSymbols:1,
                minUppercase:1,
                minLowercase:1
            },
            errorMessage:"Password is weak"
            }
        }
}

export const loginUserValidation = {
    usernameorEmail:{
        in:["body"],
        trim:true,
        exists:{
            errorMessage:"UserName Or Email field is required"
        },
        notEmpty:{
            errorMessage:"UserName Or Email should not be empty"
        },
        custom:{
            options:async function (value){
                const user = await User.findOne({$or:[{email:value},{username:value}]})
                if(!user){
                    throw new Error("Enter a valid Email or Username")
                }
            }
        }
    },
    password:{
        in:["body"],
        trim:true,
        exists:{
            errorMessage:"password field is required"
        },
        notEmpty:{
            errorMessage:"password should not be empty"
        },isStrongPassword:{
            options:{
                minLength:8,
                minSymbols:1,
                minUppercase:1,
                minLowercase:1
            },
            errorMessage:"Password is weak"
            }
        }
}