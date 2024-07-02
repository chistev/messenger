<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function handleBackClick() {
        dispatch('closeSettings');
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

<div class="col-md-8 border-right">
    <div class="p-3">
        <div class="d-flex">
            <div>
                <i class="bi bi-arrow-left fs-4" id="back-icon" style="cursor: pointer;" on:click={handleBackClick}></i>
            </div>
            <div>
                <h3 class="mb-5 ms-5">Direct Messages</h3>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-between">
            <div>
                <div>Show read receipts</div>
            </div>
            <div>
                <input type="checkbox" name="read-receipts" value="read-receipts">
            </div>
        </div>
        <div>Let people you’re messaging with know when you’ve seen their messages.</div>
    </div>
</div>
