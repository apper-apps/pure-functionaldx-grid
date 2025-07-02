import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'skeleton') {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="bg-white rounded-lg border border-clinical-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-clinical-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-clinical-200 rounded w-1/4"></div>
                <div className="h-10 bg-clinical-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-clinical-200 rounded w-1/4"></div>
                <div className="h-10 bg-clinical-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-clinical-200 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-5 bg-clinical-200 rounded w-1/4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-clinical-200 rounded w-1/3"></div>
                      <div className="h-10 bg-clinical-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-clinical-200 p-4">
                <div className="animate-pulse space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-clinical-200 rounded w-1/3"></div>
                    <div className="h-6 bg-clinical-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-clinical-200 rounded w-full"></div>
                  <div className="h-4 bg-clinical-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'matrix') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-clinical-200 p-4">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-clinical-200 rounded w-1/2"></div>
                <div className="h-6 w-6 bg-clinical-200 rounded-full"></div>
              </div>
              <div className="h-3 bg-clinical-200 rounded w-3/4"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-8 bg-clinical-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <motion.div
          className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-4 text-clinical-600 font-medium">Loading...</p>
        <p className="text-sm text-clinical-500">Please wait while we process your request</p>
      </div>
    </div>
  );
};

export default Loading;