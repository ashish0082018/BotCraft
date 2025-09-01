import axios from 'axios';
import { setauthUserDetail } from '../redux/userSlice';
import store from '../redux/store';
import toast from 'react-hot-toast';

// Function to fetch and update user dashboard data
export const updateUserData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/user/dashboard', {
      withCredentials: true,
    });
    
    if (response.data.success) {
      // Update the Redux store with the latest user data
      store.dispatch(setauthUserDetail(response.data.data));
      return response.data.data;
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};
