

const deleteCompany = async (req, res) => {
    try {
        const user = req?.user;
        console.log(user)
        const { email } = req.body
        if (user.role === 'admin') {

            if (!email) {
                res.status(401).send('Enter Email')
            }



            else {
                const findUser = await User.findOne({ email });
                console.log(findUser)
                if (!findUser) {
                    res.status(401).send('No Student Found')
                }
                else {
                    await User.deleteOne({ email, role: 'company' })
                    await BookedParking.deleteMany({ bookedBy: email })
                    console.log('deleted succesfully')
                    res.status(200).json({ message: `${email} Deleted Successfully` })

                }
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

module.exports = { deleteCompany, allCompanies,addJobController }