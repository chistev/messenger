export const getJwtToken = () => {
    console.log('Retrieving JWT token from localStorage');
    
    const jwtToken = localStorage.getItem('jwt');
    console.log('Retrieved JWT token:', jwtToken);
    
    return jwtToken;
  };
  