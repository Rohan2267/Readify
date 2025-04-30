const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

//Sign up

router.post("/sign-up", async (req, res) => {
    try {
        // console.log("Received sign-up request:", req.body); 
        const { username, email, password, address } = req.body;

        //check length greater than 3
        if (username.length < 4) {
            return res
                .status(400)
                .json({ message: "Username length should be greater than 3" });
        }

        //username exists ?
        // console.log("Checking existing user...");
        const existUsername = await User.findOne({ username: username });
        if (existUsername) {
            return res
                .status(400)
                .json({ message: "Username already exists" });
        }
        //email exists ?
        //  console.log("Checking existing email...");
        const existEmail = await User.findOne({ email: email });
        if (existEmail) {
            return res
                .status(400)
                .json({ message: "Email already exists" });
        }

        // check password length
        //  console.log("Hashing password...");
        if (password.length <= 5) {
            return res
                .status(400)
                .json({ message: "Passwords length should be greater than 5" });
        }

        const hashPass = await bcrypt.hash(password, 10);
        //  console.log("Creating new user...");
        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address,
        });

        await newUser.save();
        //  console.log("User created successfully!");
        return res
            .status(200)
            .json({ message: "Sign up succesfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

});

//Sign in
router.post("/sign-in", async (req, res) => {
    try {
        
        const { username, password } = req.body;
        const existUsername = await User.findOne({ username });
        if (!existUsername) {
            return res.status(400)
                .json({ message: "Invalid credentials" });
        }
   
     
        
        const isPasswordCorrect = await bcrypt.compare(password, existUsername.password);
      
                if (isPasswordCorrect) {
                    const authClaims = [
                        { name: existUsername.username },
                        { role: existUsername.role },

                    ]
                    const token = jwt.sign({ authClaims }, "bookStore123", {
                        expiresIn: "30d",
                    });
                     return res.status(200)
                        .json({
                            _id: existUsername._id,
                            role: existUsername.role,
                            token: token,
                        });
                }
                else {
                    return res.status(400)
                        .json({ message: "Invalid credentials" });
                }

            
        
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

});

//get-user-information
router.get("/get-user-information", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//update adderss
router.put("/update-address", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address });
        return res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
);

module.exports = router;
