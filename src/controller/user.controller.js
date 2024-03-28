const bcrypt = require('bcrypt') 

const User = require('../model/user.model')
const jwt = require('../middleware/jwt')
const BlockedUser = require('../model/blocked-user.model')



const signup = async (req, res) => {
    try {
        const { email, username, password,role ,name} = req.body;

        if (!email || !password || !username || !role) {
            return res.status(404).json({ message: "all fields required" });
        }
        else if(role ==='company' && !name){
            return res.status(404).json({ message: "all fields required" });

        }
        const exitingUser = await User.findOne({ email });
        const existingBlockedUser = await BlockedUser.findOne({ email });

        if (exitingUser) {
            return res.status(409).json({ message: "email already exist" });
        } else if (existingBlockedUser) {
            return res.status(409).json({ message: "You are a blocked user and cannot create your account" });
        } else {
            const hashPaswd = await bcrypt.hash(password, 10);
            const newUser = new User({
                email,
                username,
                password: hashPaswd,
                role,
                name:name===''?username:name
            });

            await newUser.save();
            const token = jwt.sign({ email,name, role });
            return res.status(200).json({ message: 'Signup Successful', token,role });
        }
    } catch (error) {
        return res.status(520).json({ message: "internal server error", error: error.message });
    }

}


const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email) {
            return res.status(401).json({ message: "Enter email please" })

        }
        else if (!password) {
            return res.status(401).json({ message: "Enter Password " })
        }

        else {
            const user = await User.findOne({ email })

            if (!user) {
                return res.status(401).json({ message: "wrong credentials" })
            }
            const isPaswd = await bcrypt.compare(password, user.password)
            console.log(isPaswd, "isPaswd")
            if (!isPaswd) {
                return res.status(401).json({ message: "wrong credentials" })
            }

            if (user) {
                if (user.role === 'admin') {
                    const token = jwt.sign({ email, role: 'admin' ,name:user.name})
                    console.log(user)
                    res.status(200).json({ message: 'login successful', token, role: user.role })
                }
                else if(user.role === 'student'){
                    const token = jwt.sign({ email, role: 'student' })
                    res.status(200).json({ message: 'login successful', token, role: user.role })
                }
                else {
                    const token = jwt.sign({ email, role: 'company' })
                    res.status(200).json({ message: 'login successful', token, role: user.role })
                }
            }
        }

    }
    catch (error) {
        return res.status(520).json({ message: "internal server error", error: error.message })
    }
}


module.exports = { login, signup }


