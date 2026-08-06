import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";

export function Biography({ tagline }: { tagline?: string | null }) {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <Reveal>
          <span className="text-primary mb-3 block text-xs font-semibold tracking-[0.2em] uppercase">
            About
          </span>
          <h1 className="font-display text-balance text-4xl sm:text-5xl">Dr. Sanjay M. Johri</h1>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
            {"Senior Media Consultant | Former Professor-Director, Amity School of Communication, Amity University | Ex-PTI Journalist | Development Communication Specialist"}
          </p>
          <div className="prose-neutral mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
            <p>
              <strong>ReportersMind</strong> is a website run by Prof (Dr) Sanjay M. Johri, a field journalist with over 20 years and an academician of 26 years, who has always enjoyed writing on current issues from social to politics. Dr. Johri possesses a rich experience of nearly 46 years in active journalism and academics.
            </p>
            <p>
              A dedicated reporter and a strict disciplinarian, he served India’s premier news-agencies — PTI & UNI — for 20 years. The rest 26 years of his professional life have been completely dedicated to media academics. Dr. Johri is an Independent Journalist, Consultant to different organizations, and a YouTuber. His last assignment before his retirement was Professor Emeritus, Amity School of Communication, Amity University (Uttar Pradesh), Lucknow Campus.
            </p>
            <p>
              He can be described as a widely popular figure and an inspiring leader who fills everyone’s heart with respect and admiration. Extremely talented and the owner of a disciplined, creative, and down-to-earth persona, Dr. Johri is a role model for many. An expert at managing events and handling tough situations with ease and composure, he is a patient listener, a guiding force and mentor for his students, and a friend to colleagues.
            </p>
            <p>
              Perfection is the mantra of his life. Dr. Johri always strives to achieve the best for the institution, staff, and students. The <em>SMJ Rule Book</em> is a guide and a ready reference to help students get prepared and oriented for future challenges and sustain with grit and determination.
            </p>
            <p>
              Dr. Johri has a keen interest in climate and environment issues and likes to create videos on climate change besides general issues confronting the society.
            </p>
            <p>
              Reportersmind.com has segments of his writings, books, and work which he has been doing all these years. As a professor, he likes to connect with his mentees on their professional journey.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
