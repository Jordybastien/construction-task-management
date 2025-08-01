const AppLoading = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center">
    <div className="mb-4 flex opacity-50">
      <img
        src="/assets/icon.png"
        alt="construction-logo"
        width={64}
        height={64}
      />
    </div>
    <span className="text-sm text-gray-500">loading...</span>
  </div>
);

export default AppLoading;
