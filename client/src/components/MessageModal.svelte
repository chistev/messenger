<script>
  export let showModal;

  import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();

    function closeModal() {
        dispatch('closeModal'); 
    }
</script>

<div class={`modal fade ${showModal ? 'show' : ''}`} id="messageModal" tabindex="-1" aria-labelledby="messageModalLabel" aria-hidden={!showModal}>
    <div class="modal-dialog">
        <div class="modal-content text-white" style="background-color: #000000;">
            <div class="modal-header border-0 d-flex justify-content-between">
                <div class="d-flex justify-content-center align-items-center">
                    <div>
                        <h5 class="modal-title ms-5" id="messageModalLabel">New message</h5>
                    </div>
                </div>
                <div class="modal-header border-0 d-flex justify-content-end">
                  <button type="button" class="btn" style="font-weight: 700; font-size: 15px; line-height: 20px; color: #0f1419; background-color: #ffffff; border-radius: 50px;" on:click={closeModal}>
                      Close
                  </button>
              </div>
              
            </div>
            <div class="modal-body">
                <div class="input-group d-flex align-items-center">
                    <span class="input-group-text bg-transparent border-0">
                        <i class="bi bi-search search-icon mb-3" style="color: #ffffff;"></i>
                    </span>
                    <input type="text" class="form-control mb-3 search-input" placeholder="Search people" style="background-color: transparent; border: none; box-shadow: none; color: #ffffff; caret-color: #ffffff; opacity: 1;">
                </div>
                <hr>
                <div id="user-results"></div>
            </div>
        </div>
    </div>
</div>

<style>
    .modal.show {
        display: block;
        opacity: 1;
        transition: opacity 0.15s linear;
    }
</style>
