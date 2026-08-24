'use client'

import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Erro ao carregar resenhas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  if (loading) return <p className="p-6">Carregando resenhas...</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resenhas de Livros</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow-sm">
            {item.photo && (
              <img 
                src={item.photo} 
                alt={item.bookTitle} 
                className="w-full h-48 object-cover rounded mb-4" 
              />
            )}
            <h2 className="text-xl font-semibold">{item.bookTitle}</h2>
            <p className="text-amber-500 font-bold">Nota: {item.rating}/5</p>
            {item.review && (
              <div className="prose prose-slate max-w-none text-gray-600 line-clamp-4 text-sm">
                <ReactMarkdown>{item.review}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
