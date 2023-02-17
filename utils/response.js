exports.response = (res, status_code, type, message, data) =>{

    return res.status(status_code).json({
        status_code,
        type, //error, success
        message, 
        data:data
    });
}