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

const FRONTEND_TO_BACKEND_STATUS = {
  todo:      "incomplete",
  doing:     "progress",
  completed: "completed",
};

export const registerUser = (data) => Api.post("/api/auth/register", data);
export const loginUser = (data) => Api.post("/api/auth/login", data);

export const getAllCareers = () => Api.get("/api/career/");
export const getCareerById = (id) => Api.get(`/api/career/${id}`);

export const createLevel = (data) => Api.post("/api/level/createlevels", data, config);
export const getLevelsByCareerId = (careerId) => Api.get(`/api/level/career/${careerId}`);

export const createTask = (data) => Api.post("/api/task/createTask", data, config);
export const getTasksByLevelId = (levelId) => Api.get(`/api/task/getTask/${levelId}`);

// ✅ FIXED: uses /updateTask/:id route (already working) instead of /:id/status
export const updateTaskStatus = (taskId, frontendStatus) => {
  const backendStatus = FRONTEND_TO_BACKEND_STATUS[frontendStatus] ?? frontendStatus;
  return Api.put(`/api/task/updateTask/${taskId}`, { status: backendStatus }, config);
};

export const getMe = () => Api.get("/api/auth/getme", config);

export const addUserInterests = (interests, educationLevel, description = "") => {
  return Api.post(
    "/api/interest",
    { interests, educationLevel, description },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getUserInterests = (userId) => {
  return Api.get(`/api/interest/${userId}`, config);
};

export const askGeminiToMakeTaskAccordingToCarrer = (careerName) => {
  return Api.post("/api/gemini/askGeminiToMakeTaskAccordingToCarrer", { careerName }, config);
}