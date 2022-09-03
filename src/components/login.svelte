<!-- /.login-box -->
<script>
	import { createEventDispatcher } from 'svelte';
	// Define schema with Yup
	import * as yup from 'yup';
	import { UserStore } from '../stores/UserStore';

	const dispatch = createEventDispatcher();

	const schema = yup.object().shape({
		email: yup
			.string()
			.required('Please enter your Email address to log in')
			.email('Please enter a complete email address to log in'),
		password: yup.string().required('Please enter your Password to log in'),
		rememberme: yup.boolean().default(false)
	});

	let form = {
		email: '',
		password: '',
		rememberme: false
	};
	let errors = {};

	async function submitHandler() {
		try {
			// `abortEarly: false` to get all the errors
			await schema.validate(form, { abortEarly: false });
			errors = {};

			$UserStore.authenticate(form.email, form.password, form.rememberme,
				(response) => {
					// Emit custom login event.
					dispatch('login', {
						user: $UserStore
					});
				},
				(error) => {
					Swal.fire('Login Error', error.message || error, 'error');
				}
			);
		} catch (err) {
			errors = extractErrors(err);
		}

		function extractErrors(err) {
			return err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
		}
	}

</script>

<form class="login-box" on:submit|preventDefault={submitHandler}>
	<div class="login-logo">
		<span>Semantic Admin Login</span>
	</div>
	<!-- /.login-logo -->
	<div class="login-box-body">
		<p class="login-box-msg">Sign in to start your session</p>

		<div class="input-row">
			<div class="input-group">
				<input type="text" class="form-control" bind:value={form.email} placeholder="Your email" />
				<span class="input-group-text"><i class="fas fa-envelope" /></span>
			</div>
			{#if errors.email}{errors.email}{/if}
		</div>

		<div class="input-row">
			<div class="input-group">
				<input
					type="password"
					class="form-control"
					bind:value={form.password}
					placeholder="Password"
				/>
				<span class="input-group-text"><i class="fas fa-lock" /></span>
			</div>
			{#if errors.password}{errors.password}{/if}
		</div>

		<div class="form-group clearfix mb-0">
			<div class="float-right">
				<button type="submit" class="btn btn-primary btn-block">Log In</button>
			</div>
			<div class="float-left">
				<div class="form-check">
					<input
						class="form-check-input"
						type="checkbox"
						bind:checked={form.rememberme}
						id="rememberme"
					/>
					<label class="form-check-label" for="rememberme"> Remember Me </label>
				</div>
			</div>
		</div>
	</div>
	<!-- /.login-box-body -->
</form>

<style lang="scss">
	@import '../scss/variables.scss';

	.login-box {
		margin: auto;
		width: 360px;
		border: 1px solid $gray-dark;
		border-radius: 8px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

		.login-logo {
			border-top-left-radius: 8px;
			border-top-right-radius: 8px;
			background-color: #f3f3f3;
			padding: 8px;
			margin-bottom: 0;
			border: 1px solid #f3f3f3;
			border-bottom: 2px solid #a34706;
			font-size: 35px;
			text-align: center;
			font-weight: 300;
			background-color: #343a40;

			span {
				color: #fff;
			}

			span {
				font-size: 28px;
				font-weight: bold;
			}
		}

		.login-box-body {
			border-bottom-left-radius: 8px;
			border-bottom-right-radius: 8px;
			background: #fff;
			padding: 20px;
			color: #666;

			.input-row {
				margin-bottom: 20px;
			}
		}

		.login-box-msg {
			margin: 0;
			text-align: center;
			padding: 0 20px 20px 20px;
		}

		@media (max-width: $screen-sm) {
			width: 90%;
		}
	}
</style>
