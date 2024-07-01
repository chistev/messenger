<script>
  export let data;
</script>

<svelte:head>
  <title>{data.title}</title>
  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" 
  integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <!-- Bootstrap Javascript -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" 
    integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" 
    crossorigin="anonymous"></script>
</svelte:head>


  <slot></slot>

<style>
  /* Logout */
  .sign-in-btn {
      transition: background-color 0.3s, color 0.3s;
  }

  .sign-in-btn:hover {
      background-color: rgba(29, 155, 240, 0.1);
  }

  /* Select Username */
  .submit-button {
      background-color: transparent;
      color: white;
      padding: 10px 20px;
      border: 1px solid #ccc;
      border-radius: 50px;
      cursor: pointer;
      width: 80%;
      transition: background-color 0.3s ease;
  }

  .submit-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
  }

  .input-error {
      border-color: #f4212e !important;
  }

  /* Messages */
  .border-right {
      border-right: 1px solid #2f3336;
      border-left: 1px solid #2f3336;
  }

  .form-control::placeholder {
      color: #e7e9ea;
      opacity: 1;
      font-weight: bold;
  }

  .direct-search-input-container {
      display: flex;
      align-items: center;
      border: 1px solid #35363a;
      border-radius: 25px;
      padding: 5px 15px;
      width: 100%;
  }

  .direct-search-input {
      background: transparent;
      border: none;
      color: #e7e9ea;
      flex-grow: 1;
      outline: none;
  }

  .direct-search-input:focus {
      background: transparent;
      box-shadow: none;
      color: #e7e9ea;;
  }

  .direct-search-input::placeholder {
      color: #71767b;
      font-weight: 100;
  }

  .three-dots-icon-container {
      cursor: pointer;
  }

  .user-container .three-dots-icon-container {
      display: none;
  }

  .user-container:hover .three-dots-icon-container {
      display: block;
  }

  .three-dots-custom-modal-dialog {
      max-width: fit-content;
      margin: auto;
  }

  .custom-popover {
      background-color: #202327;
      color: #e7e9ea;
      border-radius: 0.5rem;
  }

  .custom-popover .popover-arrow::before {
      background-color: #202327;
  }

  .custom-popover .custom-popover-content {
      color: #e7e9ea;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      font-weight: 700; 
      font-size: 15px; 
      line-height: 20px; 
      color: #e7e9ea;
  }
</style>
