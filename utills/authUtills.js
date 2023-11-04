import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SCREATE_KEY } from '../config/config.js';

const verifyPassword = (userPassword, encryptedPassword) => {
    try {
        return bcrypt.compareSync(userPassword, encryptedPassword);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const createToken = (user) => {
    try {
        console.log("user ", user);
        const result = jwt.sign({
            id: user.user_id
        }, JWT_SCREATE_KEY, { expiresIn: '1d' });
        return result;
    } catch (error) {
        console.log(error);
        console.log("Something Went Wrong in Token Creation");
        throw { error };
    }
}

export {
    verifyPassword,
    createToken
}
