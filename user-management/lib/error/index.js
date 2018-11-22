module.exports = (err)=>{
    if(!err){
        return "Some Error Occoured"
    }

    let code = err.code ? err.code.toString() : 500;

    // console.log(".../",code);

    switch(code){
        case "11000":
            return "User with that Username Already Exists";
            break;
        case "503":
            return "Service Unavailable";
            break;
        case "500":
            return "Server Error";
            break;
        case "404":
            return "Resource Not Found";
        case "406":
            return "Missing Fields"
            break;
        case "403":
            return "Forbiden. Please provide valid credentials to access this page";
            break;
        case "401":
            return "Missing Credentials";
            break;
            default:
                return "Ooops!! something went wrong";
    }
}