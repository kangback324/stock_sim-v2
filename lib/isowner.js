module.exports = async (req) => {
    return !!req.session.user_id;
}