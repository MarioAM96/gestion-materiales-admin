const API_BASE_URL = 'http://10.255.246.88:8000/api';
//const API_BASE_URL = 'https://api.tvmax.ec/api';
//const API_BASE_URL = 'http://45.173.228.31:81/api';

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) {
      // Lanza un error con el código de estado para que el caller lo maneje
      const error = new Error(`Error: ${response.statusText}`);
      error.status = response.status; // Adjuntamos el código de estado al error
      throw error;
    }
    return await response.json();
  } catch (error) {
    // Propagamos el error al caller en lugar de solo hacer console.error
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const postDataForm = async (endpoint, data) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "POST",
    body: data,
  });

  return await response.json();
};

export const updateData = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Update error:', error);
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Delete error:', error);
  }
};