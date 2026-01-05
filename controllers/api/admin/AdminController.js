const bcrypt = require('bcryptjs');

register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }

        // Password hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // For now response only (DB later connect karenge)
        return res.status(201).json({
            status: true,
            message: "Admin registered successfully",
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


module.exports = {
  register
    
};