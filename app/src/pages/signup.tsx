import { UserForm } from "../components";
import { signupSubmitCallback } from "../core";


const Signup = () => {
	return (
		<>
			<UserForm title="Signup" submitCallback={signupSubmitCallback} />
		</>
	);
};

export default Signup;
