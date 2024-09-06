module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/backend', '<rootDir>/front-end'], // This points to your backend directory
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
  };
  