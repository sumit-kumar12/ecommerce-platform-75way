"use client";
import React from 'react';
import styles from './article.module.css';

export default function ArticlePage() {
  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <div className={styles.articleHeader}>
          <span className={styles.categoryBadge}>Technology</span>
          <h1 className={styles.title}>The Future of E-commerce in 2026 and Beyond</h1>
          
          <div className={styles.metaInfo}>
            <div className={styles.author}>
              <div className={styles.avatar}>JD</div>
              <div>
                <p className={styles.authorName}>Jane Doe</p>
                <p className={styles.authorTitle}>Tech Editor</p>
              </div>
            </div>
            
            <div className={styles.metaData}>
              <span>June 12, 2026</span>
              <span className={styles.dot}>•</span>
              <span>8 min read</span>
            </div>
            
            <div className={styles.socialShare}>
              <button className={styles.shareBtn}>🔗 Share</button>
            </div>
          </div>
        </div>

        <div className={styles.heroImage}></div>

        <div className={styles.content}>
          <p className={styles.lead}>
            The landscape of online shopping is evolving faster than ever. As we move deeper into 2026, several key technologies are transitioning from experimental features to industry standards.
          </p>
          
          <h2>1. AI-Driven Personalization at Scale</h2>
          <p>
            Gone are the days of basic product recommendations. Today's e-commerce platforms utilize advanced neural networks to understand not just what you bought, but why you bought it, how you use it, and when you'll likely need a replacement.
          </p>
          
          <blockquote>
            "Personalization is no longer about suggesting a matching tie for a shirt; it's about curating an entire lifestyle experience based on individual micro-behaviors."
          </blockquote>
          
          <h2>2. Immersive AR Experiences</h2>
          <p>
            Augmented Reality (AR) has solved the persistent "try before you buy" problem. With sophisticated spatial computing capabilities now standard on most mobile devices, shoppers can project furniture into their living rooms with millimeter accuracy or try on virtual apparel that drapes realistically based on body mapping.
          </p>
          
          <div className={styles.inlineImage}></div>
          <span className={styles.imageCaption}>Example of AR product visualization in a modern home context.</span>
          
          <h2>3. Hyper-Local Fulfillment</h2>
          <p>
            The definition of "fast shipping" has changed drastically. Micro-fulfillment centers powered by automated sorting robots are placing inventory closer to the consumer than ever before, making sub-2-hour delivery a standard expectation in urban areas.
          </p>

          <h2>Conclusion</h2>
          <p>
            For merchants, adapting to these trends isn't optional; it's the baseline for survival. Platforms like KataBazaar are integrating these capabilities natively, democratizing access to advanced tech for sellers of all sizes.
          </p>
        </div>

        <div className={styles.tags}>
          <span className={styles.tag}>E-commerce</span>
          <span className={styles.tag}>AI</span>
          <span className={styles.tag}>Future Trends</span>
        </div>
      </article>

      <div className={styles.relatedSection}>
        <h3 className={styles.sectionTitle}>Related Articles</h3>
        <div className={styles.postGrid}>
          {[1, 2, 3].map((item) => (
            <div key={item} className={styles.postCard}>
              <div className={styles.cardImage}></div>
              <div className={styles.cardContent}>
                <span className={styles.categoryBadgeSmall}>Business</span>
                <h4 className={styles.cardTitle}>Optimizing Your Store for Gen Z Shoppers</h4>
                <p className={styles.cardExcerpt}>Learn what the newest generation of consumers values most in an online shopping experience.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
