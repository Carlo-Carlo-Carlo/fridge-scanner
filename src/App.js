import React, { useState } from 'react';

const recipesDb = {
  "tomate,mozzarella": {
    title: "Salade Caprese",
    description: "Une salade fraîche avec tomate, mozzarella et basilic.",
    time: "10 min"
  },
  "œuf,fromage": {
    title: "Omelette au Fromage",
    description: "Omelette moelleuse avec fromage fondu.",
    time: "8 min"
  },
  "pâtes,tomate": {
    title: "Pâtes à la Tomate",
    description: "Pâtes avec sauce tomate maison.",
    time: "15 min"
  }
};

const App = () => {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [gptRecipe, setGptRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("familiale");

  const addIngredient = () => {
    if (input.trim() && !ingredients.includes(input.trim().toLowerCase())) {
      setIngredients([...ingredients, input.trim().toLowerCase()]);
      setInput('');
    }
  };

  const simulateScan = () => {
    const all = ['tomate', 'mozzarella', 'œuf', 'fromage', 'pâtes', 'riz', 'oignon', 'lait'];
    const shuffled = all.sort(() => 0.5 - Math.random());
    setIngredients(shuffled.slice(0, 3));
  };

  const findMatchingRecipes = () => {
    const matched = [];
    for (const key in recipesDb) {
      const ingSet = key.split(',');
      if (ingSet.every(i => ingredients.includes(i))) {
        matched.push(recipesDb[key]);
      }
    }
    setRecipes(matched);
  };

  const generateGptRecipe = async () => {
    if (ingredients.length === 0) return alert("Ajoute des ingrédients !");
    setLoading(true);
    setGptRecipe('');
    try {
      const apiKey = import.meta.env.REACT_APP_OPENAI_API_KEY;
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Tu es un chef cuisinier étoilé et un nutritionniste. Tu proposes des recettes saines et créatives."
            },
            {
              role: "user",
              content: `Voici ce que j'ai : ${ingredients.join(", ")}. Propose-moi UNE recette de type ${style}, avec titre, description, étapes (3-5), temps total, et une option santé. Format en HTML.`
            }
          ],
          temperature: 0.8
        })
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      setGptRecipe(content);
    } catch (err) {
      setGptRecipe("❌ Erreur lors de l'appel à GPT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>🧊 Fridge Scanner</h2>
      <div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ajoute un ingrédient"
        />
        <button onClick={addIngredient}>Ajouter</button>
        <button onClick={simulateScan}>Scan Frigo (simulation)</button>
      </div>

      <div style={{ marginTop: 10 }}>
        {ingredients.map((ing, i) => (
          <span key={i} style={{ marginRight: 6, padding: "5px 10px", background: "#ddd", borderRadius: 5 }}>{ing}</span>
        ))}
      </div>

      <hr />

      <div>
        <button onClick={findMatchingRecipes}>🔍 Recettes locales</button>
        <button onClick={generateGptRecipe}>🤖 Recette GPT</button>
        <select value={style} onChange={e => setStyle(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="familiale">Familiale</option>
          <option value="gastro">Gastronomique</option>
          <option value="rapide">Rapide</option>
          <option value="veggie">Végétarienne</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        {recipes.map((r, i) => (
          <div key={i} className="recipe-card">
            <h4>{r.title}</h4>
            <p>{r.description}</p>
            <p>⏱ {r.time}</p>
          </div>
        ))}
      </div>

      {loading && <p>⏳ GPT réfléchit...</p>}
      {!loading && gptRecipe && (
        <div className="recipe-card" dangerouslySetInnerHTML={{ __html: gptRecipe }} />
      )}
    </div>
  );
};

export default App;
