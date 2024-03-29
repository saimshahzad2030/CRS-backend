const User = require('../model/user.model')
const Job = require('../model/job.model')
const deleteCompany = async (req, res) => {
    try {
        const user = req?.user;
        const { id,email } = req.query
        if (user.role === 'admin') {

            if (!id || !email) {
                res.status(401).send('Enter Email')
            }
            else {
                const findUser = await User.findOne({ _id:id });
                if (!findUser) {
                    res.status(401).send('No Company Found')
                    return
                }
              
                    await User.deleteOne({ _id:id })
                    await Job.deleteMany({ companyemail: email })
                    res.status(200).json({ message: `${findUser.email} Deleted Successfully` })

                
            }
        }
        else {

            res.status(520).json({ message: "You are not authorized" });
        }
    }
    catch (error) {
        return res.status(520).json({ message: "internal server error", error: error.message });
    }
}


const allCompanies = async (req, res) => {
    try {
        if (req?.user.role == 'admin') {
            const users = await User.find({ role: 'company' });
            res.status(200).json({ data: users, message: 'Commpanies Fetched' })
        }
        else {
            res.status(401).send("you are not authorized")
        }
    }
    catch (error) {
        return res.status(520).json({ message: error.message });
    }
}

module.exports = { deleteCompany, allCompanies }