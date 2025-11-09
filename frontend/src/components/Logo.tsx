import { useNavigate } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white';
}

const Logo = ({ className = '', size = 'md', variant = 'default' }: LogoProps) => {
  const navigate = useNavigate();

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl'
  };

  const variantClasses = {
    default: 'text-pink-600',
    white: 'text-white'
  };

  return (
    <div
      onClick={() => navigate('/')}
      className={`font-bold cursor-pointer transition-all duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`}
    >
      <span className={`${variantClasses[variant]} drop-shadow-lg`}>
        Fab
      </span>
      <span className="text-pink-500 font-light">Hair</span>
    </div>
  );
};

export default Logo;
