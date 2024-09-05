module.exports = async (req) => {
    if (req.session.user_id) {
        return true;
    }
    else {
        return false;
    }
}