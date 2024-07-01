<script>
    import MessageModal from '../../components/MessageModal.svelte';
	import SelectedUsersList from '../../components/SelectedUsersList.svelte';
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

<body class="text-white" style="background-color: #000000;">
    <div class="container-fluid min-vh-100 d-flex flex-column" style="width: 80%;">
        <div class="row flex-grow-1">
            <div class="col-md-4 border-right" id="sidebar-container">
                <div class="p-3">
                  <div class="d-flex align-items-center justify-content-between">
                    <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Helvetica, sans-serif; font-weight: 700; font-size: 20px; line-height: 24px; color: #e7e9ea;">Messages</h3>
                    <div class="fs-6">
                      <i id="gear-icon" class="bi bi-gear me-3" style="cursor: pointer;"></i>
                      <i class="bi bi-envelope-at"></i>
                    </div>
                  </div>
                  <br id="break-tag">
                    <div id="welcome-message">
                    <h4 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Helvetica, sans-serif; font-weight: 800; font-size: 31px; line-height: 36px; color: #e7e9ea;">Welcome to your inbox!</h4>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Helvetica, sans-serif; font-weight: 400; font-size: 15px; line-height: 20px; color: #71767b;">Search for a user and have private conversations with them.</p>
                    <button class="btn p-3" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Helvetica, sans-serif; font-weight: 700; font-size: 17px; line-height: 20px; color: #ffffff; background-color: #1d9bf0; border-radius: 50px;">Write a message</button>
                    </div>
                </div>
            </div>
            <div id="content-column" class="col-md-8 border-right d-flex flex-column align-items-center justify-content-center">
                <div class="p-3 text-center">
                    <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Helvetica, sans-serif; font-weight: 800; font-size: 31px; line-height: 36px; color: #e7e9ea;">Select a message</h3>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Helvetica, sans-serif; font-weight: 400; font-size: 15px; line-height: 20px; color: #71767b;">Choose from your existing conversations, or start a new one.</p>
                    <button class="btn p-3" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Helvetica, sans-serif; font-weight: 700; font-size: 17px; line-height: 20px; color: #ffffff; background-color: #1d9bf0; border-radius: 50px;">New message</button>
                  </div>
                </div>
            
            </div>
        </div>
        
        <div class="modal fade" id="messageModal" tabindex="-1" aria-labelledby="messageModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content text-white" style="background-color: #000000;">
              <div class="modal-header border-0 d-flex justify-content-between">
                <div class="d-flex justify-content-center align-items-center">
                    <div>
                        <h5 class="modal-title ms-5" id="messageModalLabel" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Helvetica, sans-serif; font-weight: 700; font-size: 20px; line-height: 24px; color: #ffffff;">New message</h5>
                    </div>
                </div>
                    <div>
                        <button type="button" class="btn" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Helvetica, sans-serif; font-weight: 700; font-size: 15px; line-height: 20px; color: #0f1419; background-color: #787a7a; border-radius: 50px;" data-bs-dismiss="modal">Next</button>
                    </div>
              </div>
              <div class="modal-body">
                <div class="input-group d-flex align-items-center">
                    <span class="input-group-text bg-transparent border-0 ">
                        <i class="bi bi-search search-icon mb-3" style="color: #ffffff;"></i>
                    </span>
                    <input type="text" class="form-control mb-3 search-input" placeholder="Search people" style="background-color: transparent; border: none; box-shadow: none; color: #ffffff; caret-color: #ffffff; opacity: 1; /* Firefox */ color: #e7e9ea;">
                </div>
                <hr>
                <div id="user-results"></div>
              </div>
            </div>
          </div>
        </div>
</body>    
            
                  
                  
            

