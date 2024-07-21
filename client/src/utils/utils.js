export const getJwtToken = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('jwt='));
    return token ? token.split('=')[1] : null;
  };
  