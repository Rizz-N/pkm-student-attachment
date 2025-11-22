const User = require ('../models/UserModel')
const jwt = require ('jsonwebtoken')
const response =  require ('../config/response')

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return response(401, null, "Refresh token tidak ditemukan", res)
            
        const user = await User.findOne({where:{ refresh_token: refreshToken } })

        if(!user) return response(403, null, "Refresh token tidak terdaftar di sistem", res)
             
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if(err) return response(403, null, "Refresh token tidak valid atau kadaluarsa", res);
                const UserId = user.user_id;
                const Username = user.username;
                const UserType = user.user_Type;
                
                const accessToken = jwt.sign(
                    {UserId, Username, UserType},process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '15m'}
                );
                return response(200, {accessToken}, "Token Berhasil di perbaharui", res)
            }
        );
    } catch (error) {
        console.error("Refrsh token error", error)
        return response(500, null, "Terjadi kesalahan pada server", res)
    }
}

module.exports = { refreshToken }