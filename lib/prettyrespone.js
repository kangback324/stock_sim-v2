const respone = (statuscode, req, res, data) => {
    res.status(statuscode).json({
        statuscode : statuscode,
        path : req.path,
        method : req.method,
        data : data,
        timestamp : new Date()
    })
}

module.exports = respone;