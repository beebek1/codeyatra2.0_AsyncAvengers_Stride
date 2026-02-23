import axios from 'axios';

const ApiFormData = axios.create({
    baseURL : import.meta.env.VITE_API_BASE_URL,
    withCredentials : true,
    headers : {
        "Content-Type" : "multipart/form-data",
    },
});

const Api = axios.create({
    baseURL : import.meta.env.VITE_API_BASE_URL,
    withCredentials : true,
    headers : {
        "Content-Type" : "application/json"
    }
});

const config = {
    headers : {
        'authorization' : `Bearer ${localStorage.getItem("token")}`
    }
}

export const registerUser = (data) => Api.post("/api/auth/register", data);
export const loginUser = (data) => Api.post("/api/auth/login", data);

export const getAllCareers = () => Api.get("/api/career/");
export const getMe = () => Api.get("/api/auth/getme", config);

export const addUserInterests = (interests, educationLevel, description = "") => {
  return Api.post(
    "/api/interest",
    {
      interests,
      educationLevel,
      description,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getUserInterests = (userId) => {
  return Api.get(`/api/interest/${userId}`, config);
<<<<<<< HEAD
};
=======
};
>>>>>>> origin/bisesh
