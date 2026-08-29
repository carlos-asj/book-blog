import Link from "next/link";
import { markdownToPlainText } from "../lib/markdown";
import { getReviews } from "../lib/reviews";

export default async function Home() {
  const reviews = await getReviews();

  const reviewsWithPreview = await Promise.all(
    reviews.map(async (item) => ({
      ...item,
      previewText: item.review ? await markdownToPlainText(item.review) : null,
    }))
  );

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resenhas de Livros</h1>

      {reviewsWithPreview.length === 0 ? (
        <p>Nenhuma resenha cadastrada ainda.</p>
      ): (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsWithPreview.map((item) => (
            <Link 
            key={item.id}
            href={`/reviews/${item.id}`}
            className="group block">
              <div className="border p-4 rounded-lg shadow-sm">
                {item.photo && (
                  <img 
                    src={item.photo.startsWith('/') ? item.photo : `/${item.photo}`}
                    alt={item.bookTitle} 
                    className="w-full h-48 object-cover rounded mb-4" 
                  />
                )}
                <div className="mb-1">
                  <span className="relative inline-block text-xl font-semibold">{item.bookTitle}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-slate-100 transition-all duration-300 ease-out group-hover:w-full"></span>
                  </span>
                </div>

                <p className="text-amber-500 font-bold">Nota: {item.rating}/5</p>
                {item.review && (
                  <div className="prose prose-slate max-w-none text-gray-600 line-clamp-4 text-sm">
                    {item.previewText && (
                      <p>{item.previewText}</p>
                    )}
                  </div>
                )}
              </div>
              </Link>
          ))}
        </div>
      )}
      
    </main>
  );
}
