import { useOnlineStatus } from "../../../hooks/useOnlineStatus";

// The wrapper is always on the page so screen readers announce the message
// when it appears
const OfflineBanner = () => {
  const online = useOnlineStatus();

  return (
    <div role="status">
      {!online && (
        <p className="bg-maize/20 px-4 py-2.5 text-center text-sm font-semibold text-maize-dark">
          You're offline. Pages you've already opened still work. Voting,
          feedback and forms need a connection.
        </p>
      )}
    </div>
  );
};

export default OfflineBanner;
