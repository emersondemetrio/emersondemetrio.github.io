import { Page } from "@/components/page/page";
import "react";

export const Resume = () => {
  return (
    <Page name="About Me">
      <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: 480, margin: '0 auto' }}>
        <p style={{ fontFamily: 'Spectral, Georgia, serif', fontStyle: 'italic', fontSize: 18, color: 'var(--mx-muted)', lineHeight: 1.7 }}>
          This page is under construction. Check back soon.
        </p>
        <a href="https://linkedin.com/in/emersondemetrio/" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', marginTop: 24, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--mx-accent)', textDecoration: 'none' }}>
          LinkedIn ↗
        </a>
      </div>
    </Page>
  );
};
