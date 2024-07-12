<script>
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';

    const dispatch = createEventDispatcher();

    function handleBackClick() {
        dispatch('closeSettings');
    }

    async function handleSignOut() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Include cookies in the request
            });

            if (response.ok) {
                // Redirect to the sign-in page
                window.location.href = '/signin';
            } else {
                // Handle error response from the server
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }
</script>

<style>
    /* Messages */
    .border-right {
        border-right: 1px solid #2f3336;
        border-left: 1px solid #2f3336;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .back-icon {
        cursor: pointer;
    }

    .sign-out-button {
        background-color: #ff4b5c;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }

    .sign-out-button:hover {
        background-color: #ff1f3b;
    }
</style>

<div class="col-md-8 border-right">
    <div class="p-3">
        <div class="header">
            <i class="bi bi-arrow-left fs-4 back-icon text-white" id="back-icon" on:click={handleBackClick}></i>
            <button class="sign-out-button" on:click={handleSignOut}>Sign Out</button>
        </div>
    </div>
</div>
