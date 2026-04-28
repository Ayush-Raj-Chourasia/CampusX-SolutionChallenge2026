/**
 * Minimal Vertex AI wrapper for text generation.
 * Falls back to a simulated response when no Google API key is set.
 */
async function suggestPrice(item) {
  const title = item.title || 'item';
  const model = process.env.GOOGLE_AI_MODEL || 'text-bison@001';

  // If user has provided GOOGLE_API_KEY, call Vertex AI REST endpoint
  if (process.env.GOOGLE_API_KEY) {
    const url = `https://generativelanguage.googleapis.com/v1alpha/models/${model}:generate?key=${process.env.GOOGLE_API_KEY}`;
    const prompt = `Suggest a fair price for the following listing and a short rationale:\nTitle: ${title}\nPrice: ${item.price || 'unknown'}\nCondition: ${item.condition || 'not specified'}`;

    const body = {
      prompt: {
        text: prompt
      },
      temperature: 0.3,
      maxOutputTokens: 200
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Vertex AI error: ${res.status} ${txt}`);
    }

    const data = await res.json();
    // Response parsing may vary by API version — return raw text when available
    const output = data.candidates && data.candidates[0] && data.candidates[0].output || JSON.stringify(data);
    return { suggestion: output };
  }

  // Fallback simulated response for prototype/demo
  const basePrice = item.price || 1000;
  const suggestion = Math.round(basePrice * 0.9);
  const rationale = `Estimated fair price is ₹${suggestion} based on condition '${item.condition || 'unknown'}'.`;
  return { suggestion: `${suggestion}`, rationale };
}

module.exports = { suggestPrice };
