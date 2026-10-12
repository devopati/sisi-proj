import ErrorMessage from "../components/shared/ui/ErrorMessage";
import Loader from "../components/shared/ui/Loader";
import PageHeader from "../components/shared/ui/PageHeader";
import WardDisplayCard from "../components/wards/WardDisplayCard";
import { useFetch } from "../hooks/useFetch";
import { type Ward } from "../types";

const Wards = () => {
  const { data: wards, error, refetch } = useFetch<Ward[]>("/wards");

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Wards"
        intro="Sisi County has four wards. Choose one to see its projects and how its money is being spent."
      />

      {error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : !wards ? (
        <Loader label="Loading wards" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {wards.map((ward) => (
            <WardDisplayCard key={ward.id} ward={ward} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wards;
