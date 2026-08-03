import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const linksMap: Record<string, string> = {
  "with-love-sir": "https://www.amazon.in/Love-Sir-Sanjay-Mohan-Johri/dp/9357041184",
  "with-ove-sir": "https://www.amazon.in/Love-Sir-Sanjay-Mohan-Johri/dp/9357041184",
  "turning-point": "https://www.amazon.in/Turning-Point-Hindi-Sanjay-Mohan-ebook/dp/B09FL761GF/ref=sr_1_4?dib=eyJ2IjoiMSJ9.e6KLW9ix_PpDggN9_rEo3yKRMr3-uua3H2nw2bQKaGs.P0SZPHqENUDxkzxiC1L5JbRVValeVrfi8b41Wn6_bgw&dib_tag=se&qid=1783918966&refinements=p_27%3ADr.+Sanjay+Mohan+Johri&s=books&sr=1-4",
  "corona-bhaiya-mere-sapne-mein": "https://www.amazon.com/Corona-Bhaiya-Mere-Sapne-Hindi-ebook/dp/B0B4W98J7C",
  "corona-bhaiya": "https://www.amazon.com/Corona-Bhaiya-Mere-Sapne-Hindi-ebook/dp/B0B4W98J7C",
};

async function main() {
  const books = await prisma.book.findMany();
  console.log("Current books:", books.map(b => ({ id: b.id, title: b.title, slug: b.slug, purchaseLinks: b.purchaseLinks })));

  for (const book of books) {
    let matchedLink: string | null = null;
    const titleLower = book.title.toLowerCase();
    const slugLower = book.slug.toLowerCase();

    if (titleLower.includes("love") || slugLower.includes("love")) {
      matchedLink = linksMap["with-love-sir"];
    } else if (titleLower.includes("turning") || slugLower.includes("turning")) {
      matchedLink = linksMap["turning-point"];
    } else if (titleLower.includes("corona") || slugLower.includes("corona")) {
      matchedLink = linksMap["corona-bhaiya"];
    }

    if (matchedLink) {
      await prisma.book.update({
        where: { id: book.id },
        data: {
          purchaseLinks: {
            amazon: matchedLink,
          },
        },
      });
      console.log(`Updated book "${book.title}" with Amazon link: ${matchedLink}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
