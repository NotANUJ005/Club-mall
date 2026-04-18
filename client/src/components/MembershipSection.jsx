function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export default function MembershipSection({ calculator, onBasketChange, onGroupChange }) {
  return (
    <section className="section membership-section" id="membership">
      <div className="membership-copy">
        <p className="eyebrow">Member club</p>
        <h2>Estimate how much your crew can save</h2>
        <p>
          Club-style social shopping works best when people move together. Use the calculator below to estimate how
          much your order can drop as your group grows.
        </p>

        <form className="calculator">
          <label>
            Basket value
            <input type="number" min="0" step="1" value={calculator.basketValue} onChange={onBasketChange} />
          </label>
          <label>
            Group size
            <input type="range" min="1" max="8" step="1" value={calculator.groupSize} onChange={onGroupChange} />
            <span>{calculator.groupSize} shoppers</span>
          </label>
          <div className="calculator-result">
            <span>Estimated checkout</span>
            <strong>{currency(calculator.checkout)}</strong>
            <small>
              Savings: {currency(calculator.savings)} ({calculator.discountPercent}% off)
            </small>
          </div>
        </form>
      </div>

      <div className="membership-card">
        <p>Tier benefits</p>
        <ul>
          <li>Priority access to creator drops and brand livestreams</li>
          <li>Early RSVP access for rooftop launches and private shopping nights</li>
          <li>Free shipping thresholds and in-mall pickup on curated bundles</li>
          <li>AI-assisted recommendations based on your favorites and saved stores</li>
        </ul>
      </div>
    </section>
  );
}
