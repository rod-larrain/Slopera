import { useEffect } from 'react';
import horizontalLogo from './assets/logo-horizontal.png';
import dogWalkPhoto from './assets/dog-walk.jpg';
import { InstagramFeed } from './components/InstagramFeed';
import { TragedyForm } from './components/EmailForms';
import { FittedHeadline } from './components/FittedHeadline';

const products = [
  {
    id: 'vinyl', name: 'My iPhone Sucks (Vinyl LP)', price: '$38', image: 'product-vinyl.webp',
    imageAlt: 'My iPhone Sucks vinyl LP by Leonardo Modena',
    copy: 'Aria in B-flat Major, Op. 1. The battery is flat. So is the Maestro.',
  },
  {
    id: 'cd', name: 'Patch My Burrito With Another Tortilla (CD)', price: '$18', image: 'product-cd.webp',
    imageAlt: 'Patch My Burrito With Another Tortilla CD by Leonardo Modena',
    copy: 'Double meat. Guac. The queso. If it breaks, that means we did it right.',
  },
  {
    id: 'cassette', name: 'Wherever (Cassette)', price: '$14', image: 'product-cassette.webp',
    imageAlt: 'Wherever cassette mixtape by Leonardo Modena',
    copy: 'A mixtape for my wife. Side A: Wherever. Side B: Not there.',
  },
  {
    id: 'box-set', name: 'The Complete Small Tragedies (26 CD Box Set)', price: '$260', image: 'product-box-set.webp',
    imageAlt: 'The Complete Small Tragedies twenty-six CD box set',
    copy: 'Every tragedy, remastered. Twenty-six discs. Not one of them deserved an aria.',
  },
  {
    id: 'poster', name: "I Don't Like Your New Haircut, Live at the Acropolis (Poster)", price: '$40', image: 'product-poster.webp',
    imageAlt: "I Don't Like Your New Haircut concert poster, live at the Acropolis",
    copy: "18 x 24 in. One night only. He still doesn't like it.",
  },
  {
    id: 'tee', name: 'I Sneezed and I Shook Your Hand Tee', price: '$45', image: 'product-tee.webp',
    imageAlt: 'I Sneezed and I Shook Your Hand black T-shirt',
    copy: 'Heavyweight black cotton. Firm handshake. Four seconds after the sneeze.',
  },
] as const;

function App() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content" data-testid="link-skip-main">Skip to content</a>
      <nav className="site-nav" aria-label="Main navigation">
        <div className="wrap nav-inner">
          <a className="brand" href="#top" aria-label="Slopera House home" data-testid="link-brand-home">
            <img className="brand-logo" src={horizontalLogo} width="1024" height="320" alt="Slopera House" data-testid="img-brand-logo" />
          </a>
          <ul className="nav-links">
            <li><a href="#tenore" data-testid="link-nav-tenore">Il Tenore</a></li>
            <li><a href="#repertorio" data-testid="link-nav-repertoire">Repertoire</a></li>
            <li><a href="#bottega" data-testid="link-nav-bottega">Bottega</a></li>
            <li><a href="#submissions" data-testid="link-nav-submit">Submit</a></li>
          </ul>
          <a className="nav-ig" href="https://www.instagram.com/sloperahouse" target="_blank" rel="noopener noreferrer" data-testid="link-nav-instagram">Instagram ↗</a>
        </div>
      </nav>

      <main id="main-content">
        <header className="hero" id="top">
          <div className="wrap hero-grid">
            <div className="hero-copy reveal">
              <span className="eyebrow">Slopera House by tenor Leonardo Modena.</span>
              <FittedHeadline />
              <hr className="rule" />
              <p className="hero-lede" data-testid="text-hero-biography">Leonardo Modena has sung for kings, cardinals and, once, a man on the F train who pooped in the train.</p>
              <p className="hero-lede" data-testid="text-hero-ai-disclosure">Full disclosure, Leonardo is AI. The orchestra is AI. (bravo sherlock,) But the suffering is real. Sit back, smile, listen, share and enjoy our operatic experiment.</p>
              <div className="actions">
                <a className="button" href="#repertorio" data-testid="link-watch-tragedies">Watch the tragedies <span aria-hidden="true">↘</span></a>
                <a className="button button-outline" href="https://www.instagram.com/sloperahouse" target="_blank" rel="noopener noreferrer" data-testid="link-hero-instagram">@sloperahouse <span aria-hidden="true">↗</span></a>
              </div>
            </div>
            <figure className="hero-art reveal reveal-delay-1">
              <img src={`${import.meta.env.BASE_URL}media/hero-bow.jpg`} width="1024" height="768" alt="Leonardo Modena bows with one hand over his heart in the rehearsal studio" fetchPriority="high" data-testid="img-leonardo-bowing" />
              <figcaption><span>The maestro at rehearsal. Milano 2017</span><small>Archivio Slopera</small></figcaption>
            </figure>
            <span className="curtain-note" aria-hidden="true">At 6:30 · New York time</span>
          </div>
        </header>

        <section className="walk-section" id="tenore" aria-label="Leonardo out walking his dog">
          <div className="wrap">
            <figure className="walk-photo">
              <img src={dogWalkPhoto} width="1024" height="579" alt="Leonardo Modena smiles while walking a dachshund along a sunlit cobblestone street, wearing a blue shirt and pink trousers" loading="lazy" data-testid="img-leonardo-dog-walk" />
            </figure>
          </div>
        </section>

        <section className="repertory" id="repertorio">
          <div className="wrap">
            <div className="repertory-head">
              <div className="section-head reveal">
                <span className="eyebrow">Il Repertorio · Stagione MMXXVI</span>
                <h2>The tragedies</h2>
                <p>Follow us for a daily tragedy.</p>
              </div>
            </div>
            <InstagramFeed />
            <div className="reel-footer">
              <div className="actions">
                <a className="button" href="https://www.instagram.com/sloperahouse" target="_blank" rel="noopener noreferrer" data-testid="link-repertoire-instagram">Instagram <span aria-hidden="true">↗</span></a>
                <a className="button button-outline" href="https://www.tiktok.com/@sloperahouse" target="_blank" rel="noopener noreferrer" data-testid="link-repertoire-tiktok">TikTok <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
        </section>

        <aside className="interlude" aria-label="A note from the house">
          <img className="interlude-backdrop" src={`${import.meta.env.BASE_URL}media/maestro-quote-background.webp`} width="1600" height="686" alt="" aria-hidden="true" loading="lazy" />
          <div className="wrap">
            <div className="reveal"><span className="eyebrow">A word from the maestro</span></div>
            <blockquote className="reveal reveal-delay-1">“We do not choose the tragedy. The tragedy chooses us.”<cite>Leonardo, between arias</cite></blockquote>
          </div>
        </aside>

        <section className="shop-section" id="bottega">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">La Bottega</span>
              <h2>Official goods of the Slopera House.</h2>
            </div>
            <div className="shop-grid" data-testid="grid-merchandise">
              {products.map((product) => (
                <article className="product reveal" key={product.id} data-testid={`card-product-${product.id}`}>
                  <div className="product-art product-photograph">
                    <img src={`${import.meta.env.BASE_URL}media/${product.image}`} width="1200" height="1500" alt={product.imageAlt} loading="lazy" data-testid={`img-product-${product.id}`} />
                  </div>
                  <div className="product-meta">
                    <h3>{product.name}</h3>
                  </div>
                  <span className="product-sold-out" data-testid={`status-product-${product.id}`}>Sold out</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="submission-section" id="submissions">
          <div className="wrap submission-grid">
            <figure className="submission-art reveal">
              <img src={`${import.meta.env.BASE_URL}media/fonografo-cover.webp`} width="1200" height="896" alt="Fonografo magazine cover featuring Leonardo Modena, Opera for everyday stuff" loading="lazy" />
            </figure>
            <div className="submission-content">
              <div className="section-head reveal">
                <span className="eyebrow">Submissions to the Artistic Committee</span>
                <h2>Submit your tragedy</h2>
              </div>
              <TragedyForm />
            </div>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <p className="footer-title">Slopera House</p>
            <p>Opera for small problems. Est. MMXXVI.</p>
          </div>
          <p>The tenor is AI. The suffering is real.</p>
          <div className="footer-social" aria-label="Social media">
            <a href="https://www.instagram.com/sloperahouse" target="_blank" rel="noopener noreferrer" data-testid="link-footer-instagram">Instagram ↗</a>
            <a href="https://www.tiktok.com/@sloperahouse" target="_blank" rel="noopener noreferrer" data-testid="link-footer-tiktok">TikTok ↗</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;