import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = ({ children, className = '', ...props }: CardHeaderProps) => {
  return (
    <div 
      className={`px-6 py-4 border-b border-gray-200 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle = ({ children, className = '', ...props }: CardTitleProps) => {
  return (
    <h3 
      className={`text-lg font-semibold text-gray-900 ${className}`} 
      {...props}
    >
      {children}
    </h3>
  );
};

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription = ({ children, className = '', ...props }: CardDescriptionProps) => {
  return (
    <p 
      className={`text-sm text-gray-500 mt-1 ${className}`} 
      {...props}
    >
      {children}
    </p>
  );
};

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = ({ children, className = '', ...props }: CardContentProps) => {
  return (
    <div 
      className={`px-6 py-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = ({ children, className = '', ...props }: CardFooterProps) => {
  return (
    <div 
      className={`px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};