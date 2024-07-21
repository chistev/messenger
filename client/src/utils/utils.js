export const getJwtToken = () => {
    console.log('All cookies:', document.cookie);

    const token = document.cookie.split('; ').find(row => row.startsWith('jwt='));
    const jwtToken = token ? token.split('=')[1] : null;
    console.log('Retrieved JWT token:', jwtToken);
    return jwtToken;
  };
  