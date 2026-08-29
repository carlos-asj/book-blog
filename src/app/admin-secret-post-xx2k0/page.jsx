'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function PaginaAdmin() {
  const [bookTitle, setBookTitle] = useState('');
  const [rating, setRating] = useState('');
  const [photo, setPhoto] = useState('');
  const [review, setReview] = useState('');

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function fetchReviews() {
    try {
      const res = await fetch('api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Erro ao carregar resenhas:', error)
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {

    let chaveSalva = localStorage.getItem('admin_secret');
    if (!chaveSalva) {
      chaveSalva = prompt('Digite a sua Chave de Administrador:');
      if (chaveSalva) {
        localStorage.setItem('admin_secret', chaveSalva);
      }
    }

    fetchReviews();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setBookTitle(item.bookTitle);
    setRating(item.rating?.toString() ?? '');
    setPhoto(item.photo || '');
    setReview(item.review || '');

    window.scrollTo({ top: 0, behavior: 'smooth' })
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setBookTitle('');
    setRating('');
    setPhoto('');
    setReview('');
  }

  async function handleDelete(id) {
      const confirmou = window.confirm("Tem certeza que deseja remover esta resenha?");
      
      if (!confirmou) return;
      const chaveSalva = localStorage.getItem('admin_secret');

      const res = await fetch(`/api/reviews/${id}?adminKey=${chaveSalva}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert("Resenha removida com sucesso!");
        setReviews((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Erro ao remover a resenha.");
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const chaveSalva = localStorage.getItem('admin_secret');

    if (!chaveSalva) {
      alert('Erro: Chave de administrador não configurada.');
      return;
    }

    let photoUrl = photo;

    if (photoFile) {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', photoFile);

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    setUploading(false);

    if (!uploadRes.ok) {
      alert('Erro ao enviar a imagem.');
      return;
    }

    const uploadData = await uploadRes.json();
    photoUrl = uploadData.url;
  }

    const dadosResenha = {
      bookTitle,
      rating,
      photo: photoUrl,
      review,
      adminKey: chaveSalva,
    };

    const url = editingId ? `/api/reviews/${editingId}` : `/api/reviews`;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosResenha),
    });

    if (res.ok) {
      alert(editingId ? 'Resenha atualizada com sucesso!' : 'Resenha salva com sucesso!');
      handleCancelEdit();
      fetchReviews();
    } else {
      alert('Erro ao salvar resenha. Verifique a chave de admin.');
    }
  };

  if (loading) return <p className='p-6'>Carregando resenhas...</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{editingId ? 'Editar Resenha' : 'Criar Resenha'}</h1>

        <input
          type="text"
          placeholder="Título do Livro"
          value={bookTitle || ''}
          onChange={(e) => setBookTitle(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Nota do livro"
          value={rating || ''}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 rounded"
        />

        <div>
          <label>Foto da Capa</label>
          <input
            type="file"
            accept="image/*"
            value={photo || ''}
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            className="border p-2 rounded"
          />
          {photo && !photoFile && (
            <img src={photo} alt="Foto atual" className="w-32 h-32 object-cover rounded mt-1" />
          )}
        </div>

        <textarea
          placeholder="Escreva sua resenha em Markdown..."
          value={review || ''}
          onChange={(e) => setReview(e.target.value)}
          className="border p-2 rounded h-40"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-white">Preview</label>
          <div className="border p-2 rounded h-80 overflow-y-auto max-w-none prose-sm">
            {review ? (
              <ReactMarkdown>{review}</ReactMarkdown>
            ) : (
              <p className="text-white/50 italic">O preview aparecerá aqui...</p>
            )}
          </div>
        </div>

        <button
          type="submit" disabled={uploading}
          className={`py-2 rounded text-white font-semibold transition-colors ${
            uploading ? 'Enviando imagem...' : editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {editingId ? 'Atualizar Resenha' : 'Salvar Resenha'}
        </button>
      </form>
      <div>
        {reviews.map((item) => (
          <div key={item.id}>
            <h1>{item.bookTitle}</h1>

            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Excluir
            </button>
            <button
              onClick={() => handleEdit(item)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}