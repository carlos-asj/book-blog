import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getReviewById } from '../../../lib/reviews';

export default async function PaginaResenhaUnica({ params }){
    const { id } = await params;
    const review = await getReviewById(id);


    return (
      <main className='relative text-center'>
        <Link href={"/"} className='absolute left-2 top-2
        transition-all ease-in-out duration-300
        hover:italic
        '>Voltar</Link>
        <article>
            {review.photo && (
                <img 
                    src={review.photo.startsWith('/') ? review.photo : `/${review.photo}`}
                    alt={review.bookTitle} 
                    className="w-full h-80 object-cover rounded-lg mb-6"
                />
            )}
            <header className='py-10'>
                <h1 className='text-4xl text-extrabold'>
                    {review.bookTitle}
                </h1>
                <p className='py-4 text-xl'>Nota: {review.rating}/5 ⭐</p>
            </header>
            <div>
                <ReactMarkdown
                >
                    {review.review}
                </ReactMarkdown>
            </div>
        </article>
      </main>  
    );
}