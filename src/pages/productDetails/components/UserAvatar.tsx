import React, { useEffect, useState } from 'react';

interface UserAvatarProps {
  username: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ username }) => {
  const [bgColor, setBgColor] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user has a stored color in local storage
    const storedColor = localStorage.getItem(`userColor_${username}`);
    
    if (storedColor) {
      setBgColor(storedColor);
    } else {
      // If no stored color, generate a random color
      const randomColor = getRandomColor();
      setBgColor(randomColor);

      // Save the generated color in local storage for future use
      localStorage.setItem(`userColor_${username}`, randomColor);
    }
  }, [username]);

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div
      className={`flex items-center justify-center w-10 h-10 text-white rounded-full`}
      style={{ backgroundColor: bgColor ?? undefined }}
    >
      {initials}
    </div>
  );
};

// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default UserAvatar;
