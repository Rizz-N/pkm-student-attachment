const Users = require("../models/UserModel");

const adminMiddleware = async (req, res, next) => {
  try {
    const user_id = req.userId;

    const user = await Users.findOne({
      where: { user_id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya admin yang bisa mengakses",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = adminMiddleware;
