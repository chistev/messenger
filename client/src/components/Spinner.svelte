<script>
    export let size = "3rem"; // You can adjust the default size
  </script>
  
  <style>
    .spinner {
      border: 0.3rem solid rgba(255, 255, 255, 0.2); /* Light grey */
      border-top: 0.3rem solid #ffffff; /* White */
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  </style>
  
  <div class="spinner-container">
    <div class="spinner" style="width: {size}; height: {size};"></div>
  </div>
  