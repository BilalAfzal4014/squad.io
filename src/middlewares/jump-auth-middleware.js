module.exports = function verifyJumpAuthHeader() {
    return (req, res, next) => {
        if (!req.headers['jump-auth-token']) {
            return res.status(403).json({
                message: "Please provide [JUMP-AUTH-TOKEN]"
            });
        }
        next();
    }
}
