import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email';

type Story = {
  category: 'startup' | 'indie' | 'video' | 'podcast' | 'radar';
  title: string;
  summary: string;
  sourceUrl?: string;
  sponsored?: boolean;
};

type IssueEmailBaseProps = {
  issueNumber?: string;
  dateLabel?: string;
  intro?: string;
  stories?: Story[];
  siteUrl?: string;
  replyTo?: string;
};

type IssueEmailProps = IssueEmailBaseProps & (
  | { demo?: true; unsubscribeUrl?: string }
  | { demo: false; unsubscribeUrl: string }
);

const sampleStories: Story[] = [
  {
    category: 'startup',
    title: 'Ejemplo: una startup convierte un avance técnico en una señal concreta',
    summary: 'Este bloque resume qué cambió, por qué importa para founders y cuál es la fuente original que permite verificarlo.',
  },
  {
    category: 'indie',
    title: 'Ejemplo: un maker argentino publica la primera versión utilizable de su producto',
    summary: 'La nota evita la promoción genérica y se concentra en el lanzamiento, el aprendizaje y la conexión comprobable con Argentina.',
  },
  {
    category: 'video',
    title: 'Ejemplo: una conversación que deja una idea operativa en cinco minutos',
    summary: 'La selección explica por qué vale el tiempo del lector y señala el tramo relevante del video o podcast.',
  },
];

const categoryNames: Record<Story['category'], string> = {
  startup: 'STARTUP',
  indie: 'INDIE',
  video: 'VER / ESCUCHAR',
  podcast: 'VER / ESCUCHAR',
  radar: 'RADAR',
};

const addUtm = (url: string, issue: string, category: Story['category']) => {
  const target = new URL(url);
  target.searchParams.set('utm_source', 'qec');
  target.searchParams.set('utm_medium', 'email');
  target.searchParams.set('utm_campaign', `issue_${issue}`);
  target.searchParams.set('utm_content', category === 'video' || category === 'podcast' ? category : category);
  return target.toString();
};

export function IssueEmail({
  issueNumber = '000',
  dateLabel = 'Agosto 2026',
  intro = 'QEC reúne las señales recientes que ayudan a entender qué están construyendo startups, founders e indie hackers vinculados con Argentina.',
  stories = sampleStories,
  siteUrl = 'https://qec.example',
  replyTo = 'hola@qec.example',
  unsubscribeUrl,
  demo = true,
}: IssueEmailProps) {
  if (!demo && !unsubscribeUrl) {
    throw new Error('Las ediciones reales requieren una URL de baja.');
  }

  return (
    <Html lang="es">
      <Head>
        <style>{`
          @media only screen and (max-width: 600px) {
            .qec-shell { width: 100% !important; }
            .qec-pad { padding-left: 22px !important; padding-right: 22px !important; }
            .qec-title { font-size: 44px !important; line-height: 40px !important; }
          }
        `}</style>
      </Head>
      <Preview>Qué se construyó en Argentina durante los últimos 15 días.</Preview>
      <Body style={styles.body}>
        <Container className="qec-shell" style={styles.container}>
          <Section className="qec-pad" style={styles.header}>
            <Text style={styles.wordmark}><span style={styles.wordmarkMark}>QEC</span> QUÉ ESTÁN CONSTRUYENDO</Text>
            <Text style={styles.meta}>EDICIÓN {issueNumber} · {dateLabel.toUpperCase()} · 5 MINUTOS</Text>
          </Section>

          <Section className="qec-pad" style={styles.intro}>
            {demo && <Text style={styles.demo}>CONTENIDO DEMOSTRATIVO</Text>}
            <Heading className="qec-title" style={styles.title}>Las señales que pasaron el filtro.</Heading>
            <Text style={styles.lead}>{intro}</Text>
          </Section>

          {stories.map((story, index) => (
            <Section className="qec-pad" style={styles.story} key={`${story.title}-${index}`}>
              <Text style={styles.category}>
                {String(index + 1).padStart(2, '0')} / {categoryNames[story.category]}
                {story.sponsored ? ' / PATROCINADO' : ''}
              </Text>
              <Heading as="h2" style={styles.storyTitle}>{story.title}</Heading>
              <Text style={styles.storyText}>{story.summary}</Text>
              {story.sourceUrl && (
                <Link href={addUtm(story.sourceUrl, issueNumber, story.category)} style={styles.textLink}>Abrir fuente original</Link>
              )}
            </Section>
          ))}

          <Section className="qec-pad" style={styles.participation}>
            <Heading as="h2" style={styles.participationTitle}>¿Qué estás construyendo?</Heading>
            <Text style={styles.participationText}>Mandanos un lanzamiento, avance o aprendizaje con su fuente original. Revisaremos tu envío a la brevedad.</Text>
            <Button href={`${siteUrl}/#enviar`} style={styles.button}>ENVIAR NOVEDAD</Button>
          </Section>

          <Section className="qec-pad" style={styles.footer}>
            <Text style={styles.footerText}>Respondé directamente a este email. Tu respuesta llega a <Link href={`mailto:${replyTo}`} style={styles.footerLink}>{replyTo}</Link>.</Text>
            <Hr style={styles.hr} />
            <Text style={styles.footerText}>Recibís QEC porque te suscribiste a la curaduría quincenal.</Text>
            {unsubscribeUrl && <Link href={unsubscribeUrl} style={styles.footerLink}>Darme de baja</Link>}
            <Text style={styles.footerSmall}>Las aperturas son orientativas. QEC prioriza clics recurrentes, respuestas y contribuciones.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default IssueEmail;

const styles: Record<string, React.CSSProperties> = {
  body: { margin: 0, backgroundColor: '#faf6ef', color: '#1c1815', fontFamily: 'Arial, Helvetica, sans-serif' },
  container: { width: '600px', margin: '0 auto', backgroundColor: '#ffffff', border: '1px solid #e7dfd1' },
  header: { padding: '22px 34px', backgroundColor: '#faf6ef', color: '#1c1815', borderBottom: '1px solid #e7dfd1' },
  wordmark: { margin: '0 0 9px', fontSize: '14px', fontWeight: 700, letterSpacing: '-0.2px' },
  wordmarkMark: { display: 'inline-block', marginRight: '7px', padding: '4px 6px', borderRadius: '4px', backgroundColor: '#b23c12', color: '#ffffff', fontFamily: 'Courier New, monospace', fontSize: '10px', letterSpacing: '0.6px' },
  meta: { margin: 0, color: '#6f675e', fontFamily: 'Courier New, monospace', fontSize: '9px', fontWeight: 400, letterSpacing: '0.8px' },
  intro: { padding: '52px 34px 44px' },
  demo: { display: 'inline-block', margin: '0 0 20px', padding: '5px 8px', borderRadius: '4px', backgroundColor: '#fbece0', color: '#b23c12', fontFamily: 'Courier New, monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.7px' },
  title: { margin: '0 0 24px', fontFamily: 'Georgia, Times New Roman, serif', fontSize: '50px', fontWeight: 400, letterSpacing: '-2px', lineHeight: '50px' },
  lead: { margin: 0, color: '#5f584f', fontFamily: 'Georgia, Times New Roman, serif', fontSize: '18px', lineHeight: '29px' },
  story: { padding: '34px', borderBottom: '1px solid #e7dfd1' },
  category: { margin: '0 0 12px', color: '#d64a1e', fontFamily: 'Courier New, monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.8px' },
  storyTitle: { margin: '0 0 10px', fontFamily: 'Georgia, Times New Roman, serif', fontSize: '25px', fontWeight: 400, lineHeight: '30px', letterSpacing: '-0.4px' },
  storyText: { margin: '0 0 12px', color: '#625a52', fontFamily: 'Georgia, Times New Roman, serif', fontSize: '15px', lineHeight: '24px' },
  textLink: { color: '#b23c12', fontSize: '12px', fontWeight: 700, textDecoration: 'underline' },
  participation: { padding: '42px 34px', backgroundColor: '#15120e', color: '#f3ede3' },
  participationTitle: { margin: '0 0 12px', fontFamily: 'Georgia, Times New Roman, serif', fontSize: '34px', fontWeight: 400, lineHeight: '38px', letterSpacing: '-0.8px' },
  participationText: { margin: '0 0 22px', color: '#c9bfb2', fontFamily: 'Georgia, Times New Roman, serif', fontSize: '15px', lineHeight: '24px' },
  button: { padding: '13px 18px', borderRadius: '6px', backgroundColor: '#f2693a', color: '#15120e', fontSize: '12px', fontWeight: 700, textDecoration: 'none' },
  footer: { padding: '34px', backgroundColor: '#1e1a15', color: '#f3ede3' },
  footerText: { margin: '0 0 10px', color: '#c9bfb2', fontSize: '12px', lineHeight: '18px' },
  footerLink: { color: '#f2693a', fontSize: '12px', textDecoration: 'underline' },
  footerSmall: { margin: '22px 0 0', color: '#948b7e', fontFamily: 'Courier New, monospace', fontSize: '9px', lineHeight: '15px' },
  hr: { margin: '22px 0', borderColor: '#2d2822' },
};
