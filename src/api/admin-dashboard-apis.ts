import type { AxiosError } from "axios";
import { api } from "./landing-page-services";
import type { BlogCategory, AppointmentCreate, PrayerRequestCreate, statusType } from "../constants/basic-types";
import { API_URL } from "./auth-api";
import axios from "axios";
import { body } from "framer-motion/client";

// Event's CRUD 
export const createEvent = async (token: string, body: {
  title: string;
  description: string;
  location: string;
  start_datetime: string;
  end_datetime: string;
  bannerFile?: null | File;
  banner?: string;
}) => {
  const url = `${API_URL}/event/create/`
  try {
    const formData = new FormData();
    formData.append('title', body.title);
    formData.append('description', body.description);
    formData.append('location', body.location);
    formData.append('start_datetime', body.start_datetime);
    formData.append('end_datetime', body.end_datetime);
    if (body.banner) {
      formData.append('banner', body.banner);
    }
    if (body.bannerFile) {
      formData.append('banner_file', body.bannerFile);
    }
    const response = await axios.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    })
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const deleteEvent = async (token: string, id: number) => {
  try {
    const response = await api.delete(`/event/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

// Sermon's CRUD
export const createSermon = async (token: string, body: {
  title: string;
  minister: string;
  sermon_type: string;
  file: null | File;
  description: string;
}) => {
  const url = `${API_URL}/sermons/create/`
  try {
    const formData = new FormData();
    formData.append('title', body.title);
    formData.append('minister', body.minister);
    formData.append('sermon_type', body.sermon_type);
    formData.append('description', body.description);
    if (body.file) {
      formData.append('file', body.file)
    }
    const response = await axios.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    })
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const deleteSermon = async (token: string, id: number) => {
  try {
    const response = await api.delete(`/sermons/${id}/delete/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

// Blog's CRUD
export const createBlog = async (token: string, body: {
  title: string;
  // content: string;
  excerpt: string;
  featured_image: null | File;
  category: BlogCategory;
  is_featured: boolean;
}) => {
  const url = `${API_URL}/blogs/create/`
  try {
    const formData = new FormData();
    formData.append('title', body.title);
    formData.append('excerpt', body.excerpt);
    formData.append('category', body.category);
    formData.append('is_featured', body.is_featured.toString());
    if (body.featured_image) {
      formData.append('file', body.featured_image)
    }
    // if (body.content) {
    //   formData.append('file', body.content)
    // }
    const response = await axios.post(url, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    })
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const deleteBlog = async (token: string, slug: string) => {
  try {
    const response = await api.delete(`/blogs/${slug}/delete/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}


export const getAllUsers = async (token: string) => {
  try {
    const response = await api.get('/users/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const getIndividualUser = async ({ token, userID }: { token: string, userID: number }) => {
  try {
    const response = await api.get(`/users/${userID}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const getAllMembers = async ({ token }: { token: string }) => {
  try {
    const response = await api.get(`/members/all/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const approveMember = async ({ token, member_id }: { token: string, member_id: number }) => {
  try {
    const response = await api.post(`/members/approve-member/`, { member_id }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

//|---------------------|
//| Ministers Api calls |
//|---------------------|


export const getMinisters = async ({ token }: { token: string }) => {
  try {
    const response = await api.get(`/ministers/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const createMinister = async ({ token, user_id, branch, title }: { token: string, user_id: number, branch?: number, title: string }) => {
  try {
    const response = await api.post(`/ministers/`, { user_id, branch, title }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

//|---------------------|
//| Staff Api calls     |
//|---------------------|

export const getStaff = async ({ token }: { token: string }) => {
  try {
    const response = await api.get(`/staff/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const createStaff = async ({ token, user_id, branch, position }: { token: string, user_id: number, branch?: number, position: string }) => {
  try {
    const response = await api.post(`/staff/`, { user_id, branch, position }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}



//|-----------------------|
//| Appointment Api calls |
//|-----------------------|

export const getAppointments = async ({ token }: { token: string }) => {
  try {
    const response = await api.get(`/minister/appointments/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const createAppointment = async ({ token, data }: { token: string, data: AppointmentCreate }) => {
  try {
    const response = await api.post(`/minister/appointments/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

//|---------------------------|
//| Prayer Requests Api calls |
//|---------------------------|

export const getPrayerRequests = async ({ token }: { token: string }) => {
  try {
    const response = await api.get(`/minister/prayer-requests/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const createPrayerRequests = async ({ token, data }: { token: string, data: PrayerRequestCreate }) => {
  try {
    const response = await api.post(`/minister/prayer-requests/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const getPastorPrayerRequests = async ({ token }: { token: string }) => {
  try {
    const response = await api.get(`/minister/minister/prayer-requests/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const getRequestById = async ({ token, id }: { token: string, id: number }) => {
  try {
    const response = await api.get(`/minister/prayer-requests/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const pastorPrayerRequestResponse = async ({ token, id, body }: {
  token: string,
  id: number,
  body: {
    status: statusType,
    minister_comment: string,
    prayer_points: string,
    scripture_references: string
  }
}) => {
  try {
    const response = await api.put(`/minister/prayer-requests/${id}/respond/`, body, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const membersPrayerRequestTestimony = async ({ token, id }: {
  token: string,
  id: number,
  body: {
    testimony: string,
    testimony_date: string
  }
}) => {
  try {
    const response = await api.put(`/minister/prayer-requests/${id}/testimony/`, body, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}