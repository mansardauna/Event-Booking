import React, { useState } from 'react';
import useFetchProducts from '../../Hooks/useFetchProduct';
import Button from '../../components/UI/Button';
import { Lock, User } from 'iconsax-react';

interface Users {
  username: string;
  password: string;
}

interface SignUpProps {
  showSignIn: any;
  
}

const SignUp: React.FC<SignUpProps> = ({ showSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { signup, loading } = useFetchProducts();  

  const handleSignUp = () => {
    const user: Users = {
      username,
      password,
    };

    signup(user)
      .then(() => {
        setSuccessMessage('Sign up successful');
        setErrorMessage(''); // Clear any previous error message
      })
      .catch((error) => {
        setErrorMessage(`Error signing up: ${error.message}`);
        setSuccessMessage(''); // Clear any previous success message
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=' mt-5 p-2 w-fit m-auto border'>
      <div className="login w-fit m-auto text-3xl text-primary mb-3">Sign up</div>
      <div className="m-auto p-2">
        <div className="flex flex-col gap-10 items-center">
          <div className="username flex flex-col gap-2">
            <div className="label text-xl flex w-10/12 m-auto items-center gap-3 border-b border-primary font-light">
              <User />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2  rounded-md outline-none w-1/2"
              />
            </div>
          </div>
          <div className="password flex flex-col gap-2">
            <div className="label border-b w-10/12 m-auto text-xl gap-3 flex items-center border-primary">
              <Lock />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2  rounded-md outline-none w-1/2"
              />
            </div>
          </div>
          <div className=" text-green-700">
        {successMessage && <p className="success">{successMessage}</p>}
        {errorMessage && <p className="error text-red-600">{errorMessage}</p>}
      </div>
          <Button variant='primary' onClick={handleSignUp} className="w-10/12 rounded text-white">Sign up</Button>
          <div className="">
            {/* {error && <p className="error">{error}</p>} */}
          </div>
          <div className="signup font-light">
            Already have an Account?
            <Button
              variant='secondary'
              onClick={() => {
                showSignIn();
              }}
              className="text-primary font-semibold ml-2"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;