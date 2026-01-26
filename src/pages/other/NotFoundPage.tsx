import React from 'react';
import { Error404 } from '../../components/other/Error404'; // Đường dẫn import component

const NotFoundPage: React.FC = () => {
  return (
    <>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-blue">
        <div className="w-full max-w-sm md:max-w-4xl">
          <Error404 />
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;