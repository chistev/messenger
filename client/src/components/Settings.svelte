<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function handleBackClick() {
        dispatch('closeSettings');
    }

    async function handleSignOut() {
        try {
            const response = await fetch('https://messenger-tu85.onrender.com/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = '/signin';
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }
</script>

<style>
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
        background: none;
        border: none;
        padding: 0;
        font-size: inherit;
        color: inherit;
        transition: transform 0.2s ease-in-out; 
    }

    .back-icon:hover {
        transform: scale(1.1); 
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
            <button 
                class="back-icon" 
                aria-label="Go back"
                on:click={handleBackClick}
                on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleBackClick()}>
                <i class="bi bi-arrow-left fs-4 text-white"></i>
            </button>
            <button class="sign-out-button" on:click={handleSignOut}>Sign Out</button>
        </div>
    </div>
</div>
