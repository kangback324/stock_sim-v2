module.exports = async (req) => {
    console.log(req.user_id);
    
    return !!req.session.user_id;
}