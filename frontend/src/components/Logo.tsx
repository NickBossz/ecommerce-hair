import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white';
}

const Logo = ({ className = '', size = 'md', variant = 'default' }: LogoProps) => {
  const navigate = useNavigate();

  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl'
  };

  const iconSizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6 md:h-7 md:w-7',
    lg: 'h-8 w-8 md:h-9 md:w-9'
  };

  const variantClasses = {
    default: 'text-primary',
    white: 'text-white'
  };

  const bgVariantClasses = {
    default: 'bg-primary/10',
    white: 'bg-white/20'
  };

  return (
    <div
      onClick={() => navigate('/')}
      className={`flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className={`${bgVariantClasses[variant]} ${variantClasses[variant]} p-2 rounded-lg`}>
        <ShoppingBag className={iconSizeClasses[size]} />
      </div>
      <div className={`font-bold ${sizeClasses[size]}`}>
        <span className={`${variantClasses[variant]} drop-shadow-lg`}>
          E-
        </span>
        <span className={`${variant === 'default' ? 'text-foreground' : 'text-white/90'} font-light`}>
          Shop
        </span>
      </div>
    </div>
  );
};

export default Logo;
