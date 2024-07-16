export default function Loading() {
    // Or a custom loading skeleton component
    return (
      <div className="flex items-center justify-center w-full min-h-100">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-4xl font-extrabold tracking-tighter">
              <span className="loading loading-infinity loading-lg"></span>{" "}
            </span>
            <p className="text-center text-gray-500 md:w-96">
              Ennhancing your business needs
            </p>
          </div>
          Loading...
        </div>
      </div>
    );
  }