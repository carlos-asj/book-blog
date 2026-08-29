import { prisma } from "../lib/prisma";

export async function getReviews() {
    try {
        const reviews = await prisma.resenha.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return reviews;
    } catch (error) {
        console.error('Erro ao buscar resenhas:', error);
    }
}

export async function getReviewById(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
        throw new Error("O ID fornecido é inválido. Esperava-se um número inteiro.");
    }

    const review = await prisma.resenha.findUnique({
        where: {
            id: numId,
        },
    });

    return review;
}

export async function postReview(cleanTitle, numericRating, cleanReview, StrPhoto){
    const newReview = await prisma.resenha.create({
        data: {
            bookTitle: cleanTitle,
            rating: numericRating,
            review: cleanReview,
            photo: StrPhoto
        }
    });

    return newReview;
}

export async function putReview(id, body) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
        throw new Error("O ID fornecido é inválido. Esperava-se um número inteiro.");
    }

    const { bookTitle, review, photo } = body;
    const rating = parseFloat(body.rating);

    if (isNaN(rating)) {
        throw new Error("A nota fornecida é inválida.");
    }

    const reviewAtt = await prisma.resenha.update({
        where: { id: numId },
        data: {bookTitle, rating, review, photo}
    });

    return reviewAtt;
}