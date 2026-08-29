import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getReviewById, putReview } from "../../../../lib/reviews";

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const review = await getReviewById();
        
        if (!review) {
            return NextResponse.json({error: "Nenhuma resenha encontrada."}, { status: 404})
        }

        return NextResponse.json(review, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar resenha:', error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
};

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const numId = parseInt(id, 10);

        if (isNaN(numId)) {
           return NextResponse.json({ error: "ID inválido." }, { status: 400 });
        }

        const { searchParams } = new URL(request.url);
        const adminKey = searchParams.get('adminKey')

        if (adminKey !== process.env.ADMIN_SECRET_KEY) {
            return NextResponse.json(
                { error: "Acesso negado: Chave inválida." },
                { status: 401 }
            );
        }

        await prisma.resenha.delete({
            where: { id: numId },
        });

        return NextResponse.json({ message: "Resenha deletada com sucesso." }, { status: 200 });
    } catch (error) {
        console.error('Erro ao deletar a resenha:', error)
        return NextResponse.json({error: "Erro ao apagar a resenha"}, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;

        const numId = parseInt(id, 10);

        if (isNaN(numId)) {
            return NextResponse.json({ error: "ID inválido"}, { status: 400 });
        }

        const body = await request.json();

        if (body.adminKey !== process.env.ADMIN_SECRET_KEY) {
            return NextResponse.json(
                {error: "Acesso negado: Chave inválida." },
                { status: 401 }
            )
        }

        const resenhaAtt = await putReview(id, body);

        return NextResponse.json(resenhaAtt, { status: 200 });
    } catch (error) {
        console.error("Erro ao editar resenha:", error);
        return NextResponse.json({ message: "Erro ao editar resenha" }, { status: 200 });
    }
}