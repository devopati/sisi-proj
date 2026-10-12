import { Link } from "react-router";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import { useFetch } from "../hooks/useFetch";
import { type County, type Ward } from "../types";
import { formatNumber } from "../utils/format";

const AboutUs = () => {
  const { data: county, error, refetch } = useFetch<County>("/county");
  const { data: wards } = useFetch<Ward[]>("/wards");

  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!county) return <Loader label="Loading" />;

  const facts = [
    { label: "Headquarters", value: county.headquarters },
    { label: "Residents", value: formatNumber(county.population) },
    { label: "Area", value: `${formatNumber(county.areaKm2)} km²` },
    { label: "Wards", value: String(wards?.length ?? "") },
  ];

  return (
    <div className="flex flex-col gap-16">
      <header className="max-w-3xl">
        <h1 className="type-display text-5xl md:text-6xl">{county.name}</h1>
        <p className="mt-4 text-2xl text-muted">{county.tagline}</p>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
        <div className="flex max-w-prose flex-col gap-10 text-lg leading-relaxed">
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">The county</h2>
            <p>{county.about}</p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Why SISI exists</h2>
            <p>
              Public money belongs to the public. SISI puts every county project in one place: who asked for it, what
              it costs, how much has been spent and how far the work has got.
            </p>
            <p>
              Residents don't have to wait for a public meeting to be heard. You can propose a project for your ward,
              vote on other people's proposals, and report what you see on site, from your phone.
            </p>
          </section>

          <div className="flex flex-wrap gap-3">
            <LinkButton to="/projects" title="Browse projects" />
            <LinkButton to="/contact" title="Contact the county" variant="outline" />
          </div>
        </div>

        <aside className="flex flex-col gap-8 self-start">
          <dl className="grid grid-cols-2 gap-5 rounded-xl border border-line bg-white p-6">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-sm text-muted">{fact.label}</dt>
                <dd className="text-lg font-semibold tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {wards && (
            <section>
              <h2 className="text-lg font-bold">Our wards</h2>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {wards.map((ward) => (
                  <li key={ward.id}>
                    <Link
                      to={`/wards/${ward.id}`}
                      className="flex justify-between gap-4 py-3 font-semibold hover:text-tea"
                    >
                      {ward.name}
                      <span className="font-normal text-muted tabular-nums">
                        {formatNumber(ward.population)} residents
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default AboutUs;
