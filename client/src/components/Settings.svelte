<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function handleBackClick() {
        dispatch('closeSettings');
    }
</script>

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
