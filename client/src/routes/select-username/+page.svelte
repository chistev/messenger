<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    
    let username = '';
    let csrfToken = ''; // You should set this based on your authentication mechanism
    let errorMessage = '';
    let successMessage = '';
    let formDisabled = true;

    const dispatcher = createEventDispatcher();

    const checkUsernameAvailability = async (username) => {
        try {
            const response = await fetch(`/check-username?username=${username}`);
            const data = await response.json();
            if (data.available) {
                successMessage = 'Username available!';
                errorMessage = '';
                formDisabled = false;
            } else {
                errorMessage = 'This username is already taken.';
                successMessage = '';
                formDisabled = true;
            }
        } catch (error) {
            console.error('Error checking username availability:', error);
        }
    };

    const validateUsername = (username) => {
        let error = '';

        if (username.includes(' ')) {
            error += 'Your username cannot contain spaces. ';
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            error += 'Your username can only contain letters, numbers, and \'_\'. ';
        }

        if (/^\d+$/.test(username)) {
            error += 'Include a non-number character. ';
        }

        if (username.length < 5) {
            error += 'Your username must be at least 5 characters long. ';
        }

        return error;
    };

    const handleInput = async () => {
        const error = validateUsername(username);
        if (error) {
            errorMessage = error;
            successMessage = '';
            formDisabled = true;
        } else {
            errorMessage = '';
            await checkUsernameAvailability(username);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`/select-username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            const data = await response.json();
            if (data.error) {
                errorMessage = data.error;
                successMessage = '';
                formDisabled = true;
            } else {
                // Success case, redirect or proceed accordingly
                dispatcher('redirect', { location: '/' });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
</script>

<style>
    body {
        background-color: #242d34;
    }
    .card {
        background-color: #000000;
        color: white;
        padding: 20px;
        border-radius: 10px;
        width: 90%;
        max-width: 600px;
        text-align: center;
    }
    .form-group {
        margin-bottom: 20px;
        width: 80%;
    }
    .input-error {
        border-color: red;
    }
    .submit-button {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .submit-button.enabled {
        opacity: 1;
        cursor: pointer;
    }
</style>

<body class="d-flex flex-column align-items-center justify-content-center">
    <div class="card mt-5">
        <h2>What should we call you?</h2>
        <h3 class="mb-4">Your @username is unique. You can't change it later.</h3>
        <form id="username-form" on:submit={handleSubmit}>
            <input type="hidden" name="_csrf" value={csrfToken}>
            <div class="form-group position-relative mx-auto">
                <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: white;">@</span>
                <input type="text" id="username" name="username" bind:value={username} placeholder="Username" on:input={handleInput} required>
            </div>
            {#if errorMessage}
                <div class="error-message" style="color: red; font-size: 12px;">{errorMessage}</div>
            {/if}
            {#if successMessage}
                <div class="available-message" style="color: green; font-size: 12px;">{successMessage}</div>
            {/if}
            <button class="submit-button mt-5" class:enabled={!formDisabled} type="submit" {disabled}>Next</button>
        </form>
    </div>
</body>
