'use client';

import { useState, useEffect } from 'react';

export default function PaginaAdmin() {
  const [bookTitle, setBookTitle] = useState('');
  const [rating, setRating] = useState('');
  const [photo, setPhoto] = useState('');
  const [review, setReview] = useState('');

  // Garante que a lógica do localStorage rode apenas no navegador após a montagem (evita erros de hidratação)
  useEffect(() => {
    let chaveSalva = localStorage.getItem('admin_secret');
    if (!chaveSalva) {
      chaveSalva = prompt('Digite a sua Chave de Administrador:');
      if (chaveSalva) {
        localStorage.setItem('admin_secret', chaveSalva);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const chaveSalva = localStorage.getItem('admin_secret');

    if (!chaveSalva) {
      alert('Erro: Chave de administrador não configurada.');
      return;
    }

    const dadosResenha = {
      bookTitle,
      rating,
      photo,
      review,
      adminKey: chaveSalva,
    };

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosResenha),
    });

    if (res.ok) {
      alert('Resenha salva com sucesso!');
      setBookTitle('');
      setRating('');
      setPhoto('');
      setReview('');
    } else {
      alert('Erro ao salvar resenha. Verifique a chave de admin.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Criar Resenha</h1>

        <input
          type="text"
          placeholder="Título do Livro"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Nota do livro"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Caminho da foto"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Escreva sua resenha em Markdown..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="border p-2 rounded h-40"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Salvar Resenha
        </button>
      </form>
    </div>
  );
}