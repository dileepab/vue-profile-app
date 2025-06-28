// --- MOCK API SERVICE ---
// This file simulates a real API by returning Promises.

const mockUserData = {
  basic: {
    profileImage: 'https://placehold.co/160x160/EFEFEF/333333?text=JD',
    salutation: 'Mr.',
    firstName: 'John',
    lastName: 'Doe Jr.',
    email: 'johndoe@anyemail.com',
  },
  additional: {
    homeAddress: '123 Tech Avenue',
    country: 'Singapore',
    postalCode: '543210',
    dob: '1990-05-15',
    gender: 'Male',
    maritalStatus: 'Married',
  },
  spouse: {
    salutation: 'Mrs.',
    firstName: 'Jane',
    lastName: 'Doe',
  },
  personal: {
    hobbies: 'Coding, Hiking, Reading',
    sports: 'Tennis, Basketball',
    music: 'Jazz, Classical',
    movies: 'Sci-Fi, Thrillers',
  }
};

// Simulate API fetching user data
export const fetchUserProfile = () => {
  console.log("API: Fetching user profile...");
  return new Promise(resolve => {
    setTimeout(() => {
      // In a real app, this would be a deep copy of data from a database
      resolve(JSON.parse(JSON.stringify(mockUserData)));
    }, 500); // 500ms delay to simulate network
  });
};

// Simulate API updating user data
export const updateUserProfile = (updatedData) => {
  console.log("API: Updating user profile with...", updatedData);
  return new Promise(resolve => {
    setTimeout(() => {
      // Update the mock data source
      Object.assign(mockUserData, updatedData);
      console.log("API: User profile updated successfully.");
      resolve({ success: true, data: updatedData });
    }, 500);
  });
};

// Simulate user login
export const loginUser = (userId, password) => {
  console.log("API: Attempting login...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === 'testuser' && password === 'password') {
        resolve({ success: true, message: 'Login successful' });
      } else {
        reject({ success: false, message: 'Your user ID and/or password does not match' });
      }
    }, 500);
  });
};
