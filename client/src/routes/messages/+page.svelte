<script>
    import Settings from '../../components/Settings.svelte';
    import MessageModal from '../../components/MessageModal.svelte';

    let showSettings = false;
    let settingsComponent;
    let showMessageModal = false;

    // Function to toggle settings component
    function toggleSettings() {
        showSettings = !showSettings;
        console.log('Toggle Settings Clicked. showSettings:', showSettings);

        if (showSettings) {
            settingsComponent = new Settings({
                target: document.body
            });

            settingsComponent.$on('closeSettings', () => {
                showSettings = false;
                settingsComponent = null; // Remove the component instance
            });
        } else {
            settingsComponent = null; // Remove the component instance
        }
    }

    function toggleMessageModal() {
      showMessageModal = !showMessageModal;
      if (showMessageModal) {
          document.querySelector('.page-container').style.backgroundColor = '#242d34'; 
      } else {
          document.querySelector('.page-container').style.backgroundColor = '#000000'; // Revert to original color
      }
  }

  function closeMessageModal() {
      showMessageModal = false;
      document.querySelector('.page-container').style.backgroundColor = '#000000'; // Revert to original color
  }

  
    
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
  
  <div class="page-container" style="background-color: #000000;">
    <div class="container-fluid min-vh-100 d-flex flex-column" style="width: 80%;">
        <div class="row flex-grow-1">
            <div class="col-md-4 border-right" id="sidebar-container">
                <div class="p-3">
                    <div class="d-flex align-items-center justify-content-between">
                        <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 20px; line-height: 24px; color: #e7e9ea;">
                            Messages
                        </h3>
                        <div class="fs-6 text-white">
                            <i style="cursor: pointer;" class="bi bi-gear me-3" on:click={toggleSettings} aria-label="Toggle Settings"></i>
                            <i class="bi bi-envelope-at" style="cursor: pointer;" on:click={toggleMessageModal} aria-label="Open Message Modal"></i>
                        </div>
                    </div>
                    <br id="break-tag">
                    <div id="welcome-message">
                        <h4 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 31px; line-height: 36px; color: #e7e9ea;">
                            Welcome to your inbox!
                        </h4>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 400; font-size: 15px; line-height: 20px; color: #71767b;">
                            Search for a user and have private conversations with them.
                        </p>
                        <button class="btn p-3" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 17px; line-height: 20px; color: #ffffff; background-color: #1d9bf0; border-radius: 50px;" on:click={toggleMessageModal}>
                            Write a message
                        </button>
                    </div>
                </div>
            </div>
            {#if showSettings && settingsComponent}
                <Settings on:closeSettings={() => showSettings = false} />
            {:else}
                <div id="content-column" class="col-md-8 border-right d-flex flex-column align-items-center justify-content-center">
                    <div class="p-3 text-center">
                        <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 31px; line-height: 36px; color: #e7e9ea;">
                            Select a message
                        </h3>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 400; font-size: 15px; line-height: 20px; color: #71767b;">
                            Choose from your existing conversations, or start a new one.
                        </p>
                        <button class="btn p-3" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 17px; line-height: 20px; color: #ffffff; background-color: #1d9bf0; border-radius: 50px;" on:click={toggleMessageModal}>
                            New message
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
    <MessageModal showModal={showMessageModal} on:closeModal={closeMessageModal} />
</div>