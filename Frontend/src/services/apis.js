// const BASE_URL = "http://10.1.0.104:3001";
export const BASE_URL = "http://localhost:3000";

// const BASE_URL2 = "http://localhost:3003/activity";
export const BASE_URL2 = "http://localhost:3000/api/tracks/activity";

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/api/auth/sendotp",
  SIGNUP_API: BASE_URL + "/api/auth/signup",
  LOGIN_API: BASE_URL + "/api/auth/login",
  GET_EMPLOYEES_API: BASE_URL + "/api/auth/getEmployee",
  RESETPASSTOKEN_API: BASE_URL + "/api/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "api/auth/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
};

export const activityEndpoints = {
  GET_WINDOW_API: BASE_URL2 + "/getwindow",
};
