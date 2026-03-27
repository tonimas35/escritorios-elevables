"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { FadeIn } from "@/components/FadeIn";
import { getAvailableProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

const QUESTIONS = [
  { id: "presupuesto", text: "Presupuesto", options: [
    { label: "Menos de 200 €", value: "bajo" },
    { label: "200 – 400 €", value: "medio" },
    { label: "Mas de 400 €", value: "alto" },
  ]},
  { id: "uso", text: "Uso principal", options: [
    { label: "Teletrabajo / oficina", value: "oficina" },
    { label: "Gaming", value: "gaming" },
    { label: "Un poco de todo", value: "mixto" },
  ]},
  { id: "motor", text: "Motor", options: [
    { label: "Simple — lo mas barato", value: "simple" },
    { label: "Doble — rapido y potente", value: "doble" },
  ]},
  { id: "carga", text: "Peso del setup", options: [
    { label: "Ligero: portatil (<30 kg)", value: "ligero" },
    { label: "Medio: un monitor (30–60 kg)", value: "medio" },
    { label: "Pesado: dual monitor (>60 kg)", value: "pesado" },
  ]},
  { id: "silencio", text: "Ruido", options: [
    { label: "Necesito silencio", value: "si" },
    { label: "No me importa", value: "no" },
  ]},
];

function scoreProduct(answers: Record<string, string>, product: Product): number {
  let s = 0;
  if (answers.presupuesto === "bajo" && product.precio <= 200) s += 3;
  else if (answers.presupuesto === "medio" && product.precio > 200 && product.precio <= 400) s += 3;
  else if (answers.presupuesto === "alto" && product.precio > 400) s += 3;
  if (answers.uso === "gaming" && product.categorias.includes("gaming")) s += 2;
  else if (answers.uso === "oficina" && product.categorias.includes("oficina")) s += 2;
  else if (answers.uso === "mixto") s += 1;
  if (answers.motor === "doble" && product.specs.tipo_motor === "doble") s += 2;
  else if (answers.motor === "simple" && product.specs.tipo_motor === "simple") s += 2;
  if (answers.carga === "pesado" && product.specs.peso_max_carga_kg >= 100) s += 2;
  else if (answers.carga === "medio" && product.specs.peso_max_carga_kg >= 70) s += 2;
  else if (answers.carga === "ligero") s += 1;
  if (answers.silencio === "si" && product.specs.ruido_db && product.specs.ruido_db <= 46) s += 2;
  else if (answers.silencio === "no") s += 1;
  s += product.puntuacion.total / 5;
  return s;
}

export default function TestPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const isComplete = step >= QUESTIONS.length;

  const results = useMemo(() => {
    if (!isComplete) return [];
    return getAvailableProducts()
      .map(([asin, product]) => ({ asin, product, score: scoreProduct(answers, product) }))
      .sort((a, b) => b.score - a.score).slice(0, 3);
  }, [isComplete, answers]);

  function handleAnswer(value: string) {
    if (step >= QUESTIONS.length) return;
    setAnswers((prev) => ({ ...prev, [QUESTIONS[step].id]: value }));
    setStep((prev) => prev + 1);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <FadeIn>
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>Herramienta</p>
          <h1 className="text-3xl md:text-5xl mt-1 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>Tu escritorio ideal</h1>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>5 preguntas. Recomendacion personalizada.</p>
        </div>
      </FadeIn>

      {!isComplete ? (
        <FadeIn>
          <div>
            <div className="flex gap-1.5 mb-8">
              {QUESTIONS.map((_, i) => (
                <div key={i} className="h-0.5 flex-1 rounded-full transition-all duration-300" style={{ background: i <= step ? 'var(--accent)' : 'var(--border)' }} />
              ))}
            </div>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="mono text-3xl font-bold" style={{ color: 'var(--accent)' }}>{String(step + 1).padStart(2, '0')}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ {String(QUESTIONS.length).padStart(2, '0')}</span>
            </div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>{QUESTIONS[step].text}</h2>
            <div className="space-y-3">
              {QUESTIONS[step].options.map((opt) => (
                <button key={opt.value} onClick={() => handleAnswer(opt.value)}
                  className="w-full text-left p-4 rounded-lg text-sm font-medium transition-all product-card-hover"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                >{opt.label}</button>
              ))}
            </div>
          </div>
        </FadeIn>
      ) : (
        <FadeIn>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-1" style={{ color: 'var(--accent)' }}>Resultado</p>
            <h2 className="text-2xl mb-6 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>Nuestras recomendaciones</h2>
            <div className="space-y-6">
              {results.map(({ asin, product }, i) => (
                <FadeIn key={asin} delay={i * 120}>
                  <ProductCard asin={asin} product={product} badge={i === 0 ? "Tu mejor opcion" : undefined} rank={i + 1} />
                </FadeIn>
              ))}
            </div>
            <button onClick={() => { setStep(0); setAnswers({}); }} className="mt-8 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
              ← Repetir test
            </button>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
