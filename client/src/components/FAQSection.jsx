export default function FAQSection({ openIndex, onToggle }) {
  const faqs = [
    {
      question: "How does group shopping work?",
      answer:
        "You join a live deal with other shoppers interested in the same product. As the group grows, the discount increases and your expected savings update instantly."
    },
    {
      question: "Can I use this site on mobile?",
      answer:
        "Yes. The page is fully responsive, with a mobile menu, tap-friendly controls, and layouts optimized for smaller screens."
    },
    {
      question: "Do favorites stay saved?",
      answer: "They do. Wishlist items are stored in your browser so returning visitors can keep their saved picks."
    },
    {
      question: "Can I adapt this into a real backend later?",
      answer:
        "Yes. The frontend already reads its content from the Express API, so you can extend the same backend for auth, payments, and a CMS."
    }
  ];

  return (
    <section className="section faq-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Need help?</p>
          <h2>Frequently asked questions</h2>
        </div>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <article className={`faq-item ${openIndex === index ? "is-open" : ""}`} key={faq.question}>
            <button type="button" onClick={() => onToggle(index)}>
              {faq.question}
            </button>
            <div>
              <p>{faq.answer}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
