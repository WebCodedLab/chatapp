import User from "../models/user.model.js";

export const registerUser = async ({fullname, email, password, profilePicture}) => {
    if (!fullname || !email || !password || !profilePicture) {
        throw new Error("All fields are required");
    }
    return await User.create({ fullname, email, password, profilePicture});
};