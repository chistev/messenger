<script>
    import { onMount } from 'svelte';
  
    onMount(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const redirectUrl = urlParams.get('redirectUrl');
  
      if (token) {
        // Save the token in localStorage or another storage solution
        localStorage.setItem('jwt', token);
  
        // Redirect to the appropriate URL
        window.location.href = redirectUrl;
      } else {
        // Handle error or redirect to sign-in page
        window.location.href = '/signin';
      }
    });
  </script>
  
  <p>Loading...</p>
  