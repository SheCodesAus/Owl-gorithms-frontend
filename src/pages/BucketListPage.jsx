import { useParams, Link } from "react-router-dom";
import { useBucketList } from "../hooks/useBucketList";

function BucketListPage() {
  const { id } = useParams();
  const { bucketList, isLoading, error } = useBucketList(id);

  if (isLoading)
    return <p className="text-gray-300 text-center mt-12">Loading bucket list...</p>;
  if (error)
    return <p className="text-red-400 text-center mt-12">Error loading bucket list.</p>;
  if (!bucketList)
    return <p className="text-gray-300 text-center mt-12">Bucket list not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link to="/dashboard" className="text-indigo-400 mb-4 block hover:underline">
        ← Back to Dashboard
      </Link>

      <div className="section-card p-6 flex flex-col gap-6">
        <h1 className="text-heading-text text-2xl font-bold leading-snug">
          {bucketList.title}
        </h1>

        {bucketList.items?.length === 0 && (
          <p className="text-body-text text-sm">No items in this list yet.</p>
        )}

        <ul className="flex flex-col gap-4">
          {bucketList.items?.map((item) => (
            <li key={item.id}>
              <Link
                to={`/bucketlists/${bucketList.id}/items/${item.id}`}
              >
                <div className="dashboard-gradient-card p-4 hover:translate-y-[-2px] transition transform">
                  <h3 className="text-white text-lg font-semibold mb-1 leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-white text-sm leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BucketListPage;