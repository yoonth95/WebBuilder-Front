import { logoutUser } from 'redux/userSlice';

export const logoutAPI = (dispatch) => {
  fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/logout`, {
    method: 'POST',
    credentials: 'include', // Include cookies
  })
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (dispatch) dispatch(logoutUser());
    })
    .catch((err) => {
      console.error(err);
    });
};
