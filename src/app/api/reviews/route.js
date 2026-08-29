import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getReviews, postReview } from "../../../lib/reviews";

export async function POST(request) {
    try {
        const body = await request.json();

        if (body.adminKey !== process.env.ADMIN_SECRET_KEY) {
            return Response.json({ error: "Acesso negado: Chave inválida." }, { status: 401 });
        }
  
        const { bookTitle, rating, review, photo } = body;

        const numericRating = parseFloat(rating);

        if (isNaN(numericRating)) {
            return Response.json({ error: "A nota informada precisa ser um número válido." }, { status: 400 });
        }
        
        const cleanTitle = String(bookTitle).normalize('NFC').trim();
        const cleanReview = review ? String(review).normalize('NFC').trim() : null;
        const StrPhoto = photo ? String(photo).trim(): null;

        const newReview = await postReview(cleanTitle, numericRating, cleanReview, StrPhoto);

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        console.error('Erro ao salvar resenha:', error);
        return NextResponse.json({ error: "Internal Server Error"},
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const reviews = await getReviews();
        return Response.json(reviews, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar resenhas:', error);
        return NextResponse.json({ error: "Internal Server Error"},
            { status: 500 }
        );
    }
}
