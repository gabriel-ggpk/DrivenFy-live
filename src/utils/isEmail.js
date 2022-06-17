function isEmail(input){
    return /^[a-z0-9.!#]{4,30}@[a-z0-9]{3,15}(.[a-z]{1,5}){1,5}$/.test(input);
    //return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(input);
}

export {isEmail};