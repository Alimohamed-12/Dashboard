import React, { useState, useEffect } from 'react';
import axios from 'axios';

import UserHeader from './UserHeader';
import UserStats from './UserState';
import UserTable from './UserTable';

function Users() {
  const [usersList, setUsersList] = useState([]);
  
  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDNjYmQ0MzMwYTZjN2ZkYWZlOTc1ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MzU2MTY5NCwiZXhwIjoxNzgzOTkzNjk0fQ.pbcJKo6R3cwfMp-H5wJ95SVDk8KJhR92vV2C2z8N8Og"; 

    axios.get('https://e-commerce-api-3wara.vercel.app/users/all', {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
    .then((response) => {
      const fetchedUsers = response.data.users || response.data || [];
      setUsersList(fetchedUsers);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
  }, []);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <UserHeader />
      <UserStats users={usersList} />
      <UserTable users={usersList} />
    </div>
  );
}

export default Users;