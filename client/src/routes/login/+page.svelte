<script>
  </script>
  
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

  .direct-search-input:focus{
    background: transparent;
    box-shadow: none;
    color: #e7e9ea;;
  }

  .direct-search-input::placeholder {
    color: #71767b;
    font-weight: 100;
  }

  .three-dots-icon-container{
    cursor: pointer;
  }
  
  .user-container .three-dots-icon-container {
    display: none;
  }
  
  .user-container:hover .three-dots-icon-container {
    display: block;
  }
  
  .three-dots-custom-modal-dialog{
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Helvetica, sans-serif; 
    font-weight: 700; 
    font-size: 15px; 
    line-height: 20px; 
    color: #e7e9ea;
}
</style>
 
<body style="background-color: #000000;">
    <div class="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div class="row text-center">
        <div class="col-12">
          <div class="happening-now text-light fw-bold display-3">
            Happening now
          </div>
        </div>
        <div class="col-12 mt-3">
          <div class="join-today text-light fw-bold h3">
            Join today.
          </div>
        </div>
      </div>
  
      <div class="row mt-5 w-100">
        <div class="col-12 d-flex flex-column align-items-center">
          <!-- Sign up with Google Button -->
          <a href="http://localhost:3000/auth/google" class="btn btn-light mb-2 d-flex align-items-center justify-content-center px-4 py-2 rounded-pill" style="width: 300px;">
            <img src="" alt="Google Icon" class="me-2" style="width: 20px; height: 20px; object-fit: cover;">
            Sign up with Google
          </a>
  
          <!-- Divider -->
          <div class="d-flex align-items-center my-3 w-100" style="max-width: 300px;">
            <hr class="flex-grow-1 text-light">
            <span class="mx-2 text-light" style="font-family: Verdana, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">or</span>
            <hr class="flex-grow-1 text-light">
          </div>
  
          <!-- Sign In Link -->
          <div class="text-center w-100" style="max-width: 300px;">
            <p class="text-light fw-bold" style="font-family: Verdana, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Already have an account?</p>
            <a href="/signin" class="btn btn-outline-light sign-in-btn rounded-pill w-100 text-primary" style="color: #1d9bf0;">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  </body>
  
  