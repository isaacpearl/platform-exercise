const axios = require('axios');
const fs = require('fs')

const registerNewUser = async (userData) => {
    const registrationData = JSON.stringify(userData);
    const config = {
        method: 'post',
        url: 'http://localhost:3000/api/v1/register',
        headers: { 
            'Content-Type': 'application/json'
        },
        data: registrationData,
    };
    const response = await axios(config)
        .then(data => data.data)
        .catch (err => err.response.data);
    return response;
}

const loginAsUser = async (email, password) => {
    const config = {
        method: 'post',
        url: 'http://localhost:3000/api/v1/login',
        headers: { 
            'Content-Type': 'application/json'
        },
        data: {
            email: email,
            password: password,
        },
    };
    const response = await axios(config)
        .then(data => data.data)
        .catch (err => err.response.data);
    return response;
};

const updateUser = async (token, userId, newData) => {
    const config = {
        method: 'put',
        url: `http://localhost:3000/api/v1/users/${userId}`,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        data: newData, 
    };
    const response = await axios(config)
        .then(data => data.data)
        .catch (err => err.response.data);
    return response;
};

const deleteUser = async (token, userId) => {
    const config = {
        method: 'delete',
        url: `http://localhost:3000/api/v1/users/${userId}`,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    const response = await axios(config)
        .then(data => data.data)
        .catch (err => err.response.data);
    return response;
};

const logOutUser = async (token) => {
    const config = {
        method: 'post',
        url: `http://localhost:3000/api/v1/logout`,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    const response = await axios(config)
        .then(data => data.data)
        .catch (err => err.response.data);
    return response;
}

(async () => {
    // create new user
    const user1Registration = await registerNewUser({"name":"Isaac Pearl","email":"isaac@pearl.com","password":"abc123"});
    console.log(`User 1 email: ${user1Registration.data.email}`);
    console.assert(user1Registration.data.email === 'isaac@pearl.com');

    // attempt to add new user with same email address
    const userSameEmail = await registerNewUser({"name":"Isaac Pearl","email":"isaac@pearl.com","password":"abc123"});
    console.log(`Duplicate email registration attempt error message: ${userSameEmail.error}`);
    console.assert(userSameEmail.error === 'User already exists with this email address');

    // attempt to login with incorrect password and recieve error
    const incorrectPasswordError = await loginAsUser('isaac@pearl.com', 'abcdefghijklmnop');
    console.log(`Incorrect password login error message: ${incorrectPasswordError.error}`);
    console.assert(incorrectPasswordError.error === 'Incorrect password');

    // login as user correctly and save JWT
    const user1 = await loginAsUser('isaac@pearl.com', 'abc123');
    console.log(`User 1 login JWT token: ${user1.token}`);
    console.assert(user1.token);

    // update user email
    const user1Update = await updateUser(user1.token, 1, {email: "isaac123@pearl.com"});
    console.log(user1Update);
    //console.assert(user1Update.email === "isaac123@pearl.com");

    // log user out
    const user1Logout = await logOutUser(user1.token);
    console.log(user1Logout);

    const user1IllegalPut = await updateUser(user1.token, 1, {email: "isaac456@pearl.com"});
    console.log(user1IllegalPut);

    // create second user and login
    const user2Registration = await registerNewUser({"name":"Fender USA","email":"usa@fender.com","password":"def456"});
    console.log(`User 2 email: ${user2Registration.data.email}`);
    console.assert(user2Registration.data.email === 'usa@fender.com');

    const user2 = await loginAsUser('usa@fender.com', 'def456');
    console.log(`User 2 login JWT token: ${user2.token}`);
    console.assert(user2.token);
    
    const illegalDelete = await deleteUser(user2.token, 1);
    console.log(illegalDelete);

    const legalDelete = await deleteUser(user2.token, 2);
    console.log(legalDelete);
    
})();
