'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashed_password_1', // Replace with a hashed password for security
        role: 'user',
        phone: '123-456-7890',
        image: 'src/public/users/images/image1.jpg', // Example image path
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'hashed_password_2',
        role: 'user',
        phone: '987-654-3210',
        image: 'src/public/users/images/image2.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
