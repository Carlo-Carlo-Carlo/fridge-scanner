// Base de données de recettes simplifiée
const recipes = {
  "tomate,mozzarella": {
    title: "Salade Caprese",
    description: "Une salade italienne fraîche avec des tomates, mozzarella et basilic. Arrosez d'huile d'olive et de vinaigre balsamique.",
    time: "10 minutes"
  },
  "œuf,fromage": {
    title: "Omelette au Fromage",
    description: "Une omelette moelleuse garnie de fromage fondu. Parfaite pour un repas rapide et nourrissant.",
    time: "8 minutes"
  },
  "pomme de terre,oignon": {
    title: "Pommes de Terre Sautées",
    description: "Des pommes de terre dorées avec des oignons caramélisés. Un accompagnement délicieux et réconfortant.",
    time: "25 minutes"
  },
  "pâtes,tomate": {
    title: "Pâtes à la Tomate",
    description: "Un classique italien simple : pâtes avec une sauce tomate maison, basilic et parmesan.",
    time: "15 minutes"
  },
  "riz,légumes": {
    title: "Riz Sauté aux Légumes",
    description: "Un plat coloré et sain avec du riz sauté et des légumes de saison. Rapide et nutritif.",
    time: "12 minutes"
  },
  "poulet,légumes": {
    title: "Poulet aux Légumes",
    description: "Morceaux de poulet tendres mijotés avec des légumes frais dans une sauce savoureuse.",
    time: "35 minutes"
  },
  "lait,œuf,farine": {
    title: "Crêpes Maison",
    description: "Des crêpes moelleuses parfaites pour le petit-déjeuner ou le dessert. À garnir selon vos envies.",
    time: "20 minutes"
  },
  "pain,fromage": {
    title: "Croque-Monsieur",
    description: "Le sandwich français par excellence avec jambon, fromage et béchamel, gratiné au four.",
    time: "15 minutes"
  }
};

let ingredients = [];
let video, stream;

// Éléments DOM
const startCameraBtn = document.getElementById('startCamera');
const scanFridgeBtn = document.getElementById('scanFridge');
const simulateScanBtn = document.getElementById('simulateScan');
const videoElement = document.getElementById('video');
const cameraPlaceholder = document.getElementById('camera-placeholder');
const ingredientInput = document.getElementById('ingredientInput');
const addIngredientBtn = document.getElementById('addIngredient');
const ingredientsList = document.getElementById('ingredientsList');
const recipesList = document.getElementById('recipesList');
const loading = document.getElementById('loading');

// Activation de la caméra
startCameraBtn.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.style.display = 'block';
    cameraPlaceholder.style.display = 'none';
    startCameraBtn.classList.add('hidden');
    scanFridgeBtn.classList.remove('hidden');
  } catch (error) {
    alert("Impossible d'accéder à la caméra. Utilisez la simulation à la place.");
  }
});

// Scan du frigo (simulation)
scanFridgeBtn.addEventListener('click', () => {
  simulateIngredientDetection();
});

// Simulation de scan
simulateScanBtn.addEventListener('click', () => {
  simulateIngredientDetection();
});

// Ajout manuel d'ingrédients
addIngredientBtn.addEventListener('click', () => {
  const ingredient = ingredientInput.value.trim().toLowerCase();
  if (ingredient && !ingredients.includes(ingredient)) {
    ingredients.push(ingredient);
    updateIngredientsDisplay();
    findRecipes();
    ingredientInput.value = '';
  }
});

ingredientInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addIngredientBtn.click();
  }
});

// Simulation de détection d'ingrédients
function simulateIngredientDetection() {
  const commonIngredients = [
    'tomate', 'mozzarella', 'basilic', 'œuf', 'fromage', 'pomme de terre',
    'oignon', 'pâtes', 'riz', 'légumes', 'poulet', 'lait', 'farine', 'pain'
  ];

  loading.classList.remove('hidden');

  setTimeout(() => {
    const numIngredients = Math.floor(Math.random() * 3) + 3;
    ingredients = [];

    for (let i = 0; i < numIngredients; i++) {
      const randomIngredient = commonIngredients[Math.floor(Math.random() * commonIngredients.length)];
      if (!ingredients.includes(randomIngredient)) {
        ingredients.push(randomIngredient);
      }
    }

    loading.classList.add('hidden');
    updateIngredientsDisplay();
    findRecipes();
  }, 2000);
}

// Mise à jour de l'affichage des ingrédients
function updateIngredientsDisplay() {
  ingredientsList.innerHTML = '';
  ingredients.forEach((ingredient, index) => {
    const tag = document.createElement('div');
    tag.className = 'ingredient-tag';
    tag.textContent = ingredient;
    tag.style.animationDelay = `${index * 0.1}s`;
    ingredientsList.appendChild(tag);
  });
}

// Recherche de recettes
function findRecipes() {
  recipesList.innerHTML = '';
  const foundRecipes = [];

  for (const [key, recipe] of Object.entries(recipes)) {
    const recipeIngredients = key.split(',');
    const hasIngredients = recipeIngredients.every(ing =>
      ingredients.some(userIng => userIng.includes(ing) || ing.includes(userIng))
    );

    if (hasIngredients) {
      foundRecipes.push(recipe);
    }
  }

  if (foundRecipes.length === 0) {
    ingredients.forEach(ingredient => {
      if (ingredient.includes('tomate')) {
        foundRecipes.push({
          title: "Sauce Tomate Simple",
          description: "Une sauce tomate de base parfaite pour accompagner vos plats.",
          time: "20 minutes"
        });
      }
      if (ingredient.includes('œuf')) {
        foundRecipes.push({
          title: "Œuf au Plat",
          description: "Un classique simple et rapide pour tous les repas.",
          time: "5 minutes"
        });
      }
    });
  }

  if (foundRecipes.length === 0) {
    recipesList.innerHTML = '<p style="text-align: center; color: #666;">Aucune recette trouvée avec ces ingrédients. Essayez d\'ajouter plus d\'ingrédients !</p>';
  } else {
    foundRecipes.forEach((recipe, index) => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.style.animationDelay = `${index * 0.2}s`;
      card.innerHTML = `
        <div class="recipe-title">${recipe.title}</div>
        <div class="recipe-description">${recipe.description}</div>
        <div class="recipe-time">⏱️ ${recipe.time}</div>
      `;
      recipesList.appendChild(card);
    });
  }
}

// Nettoyage lors de la fermeture
window.addEventListener('beforeunload', () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
});
 
// ------------------ GPT RECIPE GENERATOR ------------------
// GPT API KEY : récupérée depuis localStorage si dispo

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

let apiKey = OPENAI_API_KEY;

// 🔁 Fallback si pas dispo (ex: en local)
if (!apiKey) {
  apiKey = localStorage.getItem('openai_api_key') || '';

  if (!apiKey) {
    const userKey = prompt("Entrez votre clé API OpenAI pour générer des recettes :");
    if (userKey) {
      localStorage.setItem('openai_api_key', userKey);
      apiKey = userKey;
    } else {
      alert("Clé API requise pour utiliser GPT.");
    }
  }
}


const gptRecipeBtn = document.getElementById('gptRecipeBtn');
const recipeStyleSelect = document.getElementById('recipeStyle');


gptRecipeBtn.addEventListener('click', async () => {
  if (ingredients.length === 0) {
    alert("Ajoutez d'abord des ingrédients !");
    return;
  }

  loading.classList.remove('hidden');
  recipesList.innerHTML = '';

  try {
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
            content: `Tu es un chef cuisinier étoilé et un nutritionniste expérimenté. 
            Tu proposes des recettes saines, équilibrées, créatives, et adaptées aux ingrédients disponibles. 
            Tes réponses sont structurées, précises, avec un ton chaleureux mais professionnel.`
          },
          {
            role: "user",
            content: `Voici les ingrédients que j'ai dans mon frigo : ${ingredients.join(", ")}.
            Propose-moi UNE SEULE recette de type **${recipeStyleSelect.value}** :
            - Titre de la recette
            - Description courte (1-2 phrases, inspiration d’un chef)
            - Étapes détaillées mais concises (3-5 étapes max)
            - Temps de préparation et cuisson
            - Option santé ou alternative (si possible)
            Format la réponse en HTML, avec <h3> pour le titre, <p> pour la description et <ul> pour les étapes.
            Ajoute une petite ligne à la fin : "Style : ${recipeStyleSelect.value}".`

          }
        ],
        temperature: 0.85
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      recipesList.innerHTML = "<p>❌ Aucune réponse reçue de GPT.</p>";
    } else {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = content;
      recipesList.appendChild(card);
    }
  } catch (error) {
    console.error(error);
    recipesList.innerHTML = "<p>❌ Erreur lors de l'appel à GPT.</p>";
  } finally {
    loading.classList.add('hidden');
  }
});
