import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request) {
    try {
        const body = await request.json();

        if (body.adminKey !== process.env.ADMIN_SECRET_KEY) {
            return Response.json({ error: "Acesso negado: Chave inválida." }, { status: 401 });
        }
  
        const { bookTitle, rating, review, photo } = body;
        console.log(body)

        const newReview = await prisma.resenha.create({
            data: {
                bookTitle: String(bookTitle).trim(),
                rating: rating,
                review: review ? String(review).trim() : null,
                photo: photo ? String(photo).trim(): null
            }
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        console.error('Erro ao salvar resenha:', error);
        return NextResponse.json({ error: "Internal Server Error"},
            { status: 500 }
        );
    }
}
