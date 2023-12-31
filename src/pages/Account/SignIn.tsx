import { Lock, User } from 'iconsax-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button';
import useFetchProducts from '../../Hooks/useFetchProduct';

interface LoginProps {
  onClick: any;
  showSignUp: () => void;

}

const SignIn: React.FC<LoginProps> = ({ onClick, showSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  ;

  const { login } = useFetchProducts();
  const handleLogin = () => {
    const user = { username, password };
    setError('');

    onClick(user);
    onClick(user)
      .then(() => {
        setSuccessMessage('Login successful');
      }).catch((error:any) => {
        setError(`Error logging in: ${error.message}`);
      });

  };

  return (
    <div className="mt-5 p-2 border rounded-md w-fit m-auto">
      <div className="login w-fit m-auto text-3xl text-primary mb-3">Login</div>
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
                className="p-2 rounded-md outline-none w-1/2"
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
                className="p-2 rounded-md outline-none w-1/2"
              />
            </div>
          </div>
          {successMessage && <p className="success">{successMessage}</p>}
        {error && <p className="error">{error}</p>}

          <div className="flex justify-between w-11/12">
            <div className="flex gap-2 capitalize font-light">
              <input type="checkbox" name="" id="" />
              <div className="">Remember me</div>
            </div>
            <div className="font-light">Forgot password?</div>
          </div>
          <Button variant="primary" onClick={handleLogin} className="w-10/12 rounded text-white">
            Login
          </Button>
          <div className="">
            {error && <p className="error">{error}</p>}
          </div>
          <div className="signup font-light">
            Don't have an Account?
            <Button
            variant='secondary'
              onClick={() => {
                showSignUp(); 
              }}
              className="text-primary font-semibold ml-2"
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
