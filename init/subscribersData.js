


const faker = require('faker');

// Function to generate fake user data
const generateFakeUsers = (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
      const user = {
          username: faker.name.findName(), // Generate a random name
          email: faker.internet.email(), // Generate a random email
          age: faker.datatype.number({ min: 16, max: 80 }) // Generate a random age between 16 and 80
      };
      users.push(user);
  };

  return users;
};
// Generate 50 fake users
module.exports=  subscribers = generateFakeUsers(100);