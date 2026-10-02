// Heirloom Voice Memos & Pre-structured Culinary Presets
export const SAMPLE_MEMOS = [
  {
    id: 'grandpa-ragu',
    title: 'Nonno Giuseppe’s 3-Hour Slow Ragu',
    friendName: 'Marco’s Nonno Giuseppe',
    tag: 'Family Secret Recipe',
    duration: '1:42',
    dateRecorded: 'Recorded Oct 1, 2026',
    audioFile: null,
    rawTranscript: `Hey kiddo, listen closely... don't let anyone tell you canned tomato puree is fine on its own. First, brown your beef chuck and bone-in pork ribs slow in olive oil until a deep caramel crust forms, then lift them out. In that exact same pan with the rendered fat, drop finely minced celery, one big carrot, and two yellow onions. Sauté until completely soft and sweet, about ten minutes. Now here is the family secret that no restaurant does: grate about a quarter teaspoon of fresh nutmeg right into the vegetables and add a half cup of whole milk before pouring in the dry red wine. Let the wine simmer away completely, then stir in crushed San Marzano tomatoes and drop the meat back in. Keep your flame down to a gentle whisper for three full hours. Stir every twenty minutes with your wooden spoon. Serve it piping hot over fresh wide tagliatelle with aged Parmigiano. That's love in a bowl.`,
    structured: {
      id: 'grandpa-ragu',
      title: "Nonno Giuseppe’s 3-Hour Slow Braised Ragu",
      originStory: "Recorded by Nonno Giuseppe for Marco. A three-generation family recipe passed down by ear, never written in a cookbook until now.",
      prepTime: "25 mins",
      cookTime: "3 hrs",
      servings: 6,
      difficulty: "Intermediate",
      tags: ["Italian", "Slow Cook", "Comfort Food", "Dairy-Infused"],
      secretTip: {
        title: "Nonno's Secret Spice & Milk Technique",
        body: "Grate fresh nutmeg and reduce a half cup of milk into the sautéed soffritto before the red wine. This tenderizes the meat fibers and rounds out tomato acidity."
      },
      heritagePairing: {
        beverage: "Chianti Classico Riserva DOCG (or aged Nebbiolo)",
        alcoholFree: "Sparkling Blackberry & Rosemary Shrub with crushed ice",
        notes: "Firm sangiovese tannins and bright cherry acidity effortlessly slice through the rich, slow-rendered marrow and sweet soffritto."
      },
      ingredients: [
        { name: "Beef chuck roast (cut into pieces)", amount: "1.5 lbs / 700g", category: "Meats", imperial: "1.5 lbs", metric: "700 g" },
        { name: "Bone-in pork ribs", amount: "1 lb / 450g", category: "Meats", imperial: "1 lb", metric: "450 g" },
        { name: "Extra virgin olive oil", amount: "3 tbsp / 45ml", category: "Pantry", imperial: "3 tbsp", metric: "45 ml" },
        { name: "Yellow onions (finely diced)", amount: "2 medium", category: "Produce", imperial: "2 medium", metric: "2 medium" },
        { name: "Carrot (finely diced)", amount: "1 large", category: "Produce", imperial: "1 large", metric: "1 large" },
        { name: "Celery stalks (finely diced)", amount: "2 stalks", category: "Produce", imperial: "2 stalks", metric: "2 stalks" },
        { name: "Freshly grated nutmeg", amount: "1/4 tsp", category: "Spices", imperial: "1/4 tsp", metric: "1/4 tsp" },
        { name: "Whole milk", amount: "1/2 cup / 120ml", category: "Dairy", imperial: "1/2 cup", metric: "120 ml" },
        { name: "Dry Italian red wine (Chianti)", amount: "1 cup / 240ml", category: "Pantry", imperial: "1 cup", metric: "240 ml" },
        { name: "San Marzano whole peeled tomatoes", amount: "2 cans (28 oz each)", category: "Pantry", imperial: "2 cans (28 oz)", metric: "2 cans (800 g)" },
        { name: "Fresh tagliatelle or pappardelle", amount: "1 lb / 450g", category: "Pasta", imperial: "1 lb", metric: "450 g" },
        { name: "Parmigiano-Reggiano (for grating)", amount: "To taste", category: "Dairy", imperial: "To taste", metric: "To taste" }
      ],
      steps: [
        {
          step: 1,
          title: "Caramelize & Brown Meats",
          instruction: "Heat olive oil in a heavy Dutch oven over medium-high heat. Season beef and ribs with salt. Sear all sides until deep golden brown (about 8-10 minutes). Remove meat and set aside on a plate.",
          timerSeconds: 600,
          timerLabel: "10 mins"
        },
        {
          step: 2,
          title: "Sauté the Soffritto",
          instruction: "Turn heat to medium. In the rendered fat, add diced onions, carrots, and celery. Cook stirring frequently until translucent and sweet (around 8-10 mins).",
          timerSeconds: 540,
          timerLabel: "9 mins"
        },
        {
          step: 3,
          title: "Nonno's Secret Milk & Wine Reduction",
          instruction: "Grate fresh nutmeg into the vegetables. Pour in the milk and let it simmer until evaporated. Pour in dry red wine and scrape up all the flavorful browned bits from the pan bottom until wine reduces by half.",
          timerSeconds: 420,
          timerLabel: "7 mins"
        },
        {
          step: 4,
          title: "Crush Tomatoes & Return Meat",
          instruction: "Crush San Marzano tomatoes with your hands into the pot. Return browned beef and pork ribs with any resting juices. Bring to a gentle boil.",
          timerSeconds: 180,
          timerLabel: "3 mins"
        },
        {
          step: 5,
          title: "Low & Slow 3-Hour Simmer",
          instruction: "Lower flame to absolute minimum, cover partially with lid. Let it simmer gently for 3 hours, stirring every 20 minutes with a wooden spoon until meat shreds with a fork.",
          timerSeconds: 10800,
          timerLabel: "3 hours"
        },
        {
          step: 6,
          title: "Toss with Tagliatelle & Serve",
          instruction: "Cook fresh tagliatelle in salted boiling water until al dente. Toss pasta directly into a couple ladles of ragu, finish with grated Parmigiano-Reggiano and cracked black pepper.",
          timerSeconds: 240,
          timerLabel: "4 mins"
        }
      ]
    }
  },
  {
    id: 'elena-focaccia',
    title: 'Elena’s 48-Hour Honey Herb Focaccia',
    friendName: 'Elena V.',
    tag: 'Artisan Baking Note',
    duration: '1:15',
    dateRecorded: 'Recorded Sep 29, 2026',
    audioFile: null,
    rawTranscript: `Elena here! Okay quick voice note for our Friday dinner party: 500 grams of strong bread flour, 420 milliliters of lukewarm water, 4 grams of instant yeast, and 12 grams of fine sea salt. Whisk the dry ingredients, pour water, mix with a spatula until just a shaggy wet dough. Cover it with a damp towel. Do three coil folds spaced 30 minutes apart with wet olive oil fingers—don't knead it! Pop it in the fridge overnight for cold fermentation. In the morning, grease a metal sheet pan generously with high-grade extra virgin olive oil. Tip the bubbly dough in, dimple it deeply with all ten fingers like playing piano keys. Top with fresh rosemary sprigs, flaky Maldon salt, and here is my trademark touch: drizzle a tablespoon of raw wildflower honey straight out of the 220°C oven while the crust is crackling.`,
    structured: {
      id: 'elena-focaccia',
      title: "Elena’s 48-Hour Cold Ferment Honey-Herb Focaccia",
      originStory: "Spoken voice memo from Elena for her weekend dinner host. Replaces messy handwritten dough notes with foolproof hydration timing.",
      prepTime: "25 mins (+ 12h chill)",
      cookTime: "22 mins",
      servings: 8,
      difficulty: "Easy / Patience",
      tags: ["Baking", "Vegan Adaptable", "No-Knead", "Bread"],
      secretTip: {
        title: "Elena's Post-Bake Honey Glaze",
        body: "Drizzling wildflower honey over boiling-hot crust immediately upon leaving the oven crystallizes with flaky salt, creating an irresistible savory-sweet bite."
      },
      heritagePairing: {
        beverage: "Chilled Vermentino di Sardegna (or Prosecco Superiore)",
        alcoholFree: "Sparkling Elderflower Spritz with crushed mint and fresh lemon peel",
        notes: "Crisp salinity and green apple notes echo the herbal rosemary aroma while balancing rich olive oil pockets."
      },
      ingredients: [
        { name: "Strong bread flour (12-14% protein)", amount: "500g / 4 cups", category: "Dry", imperial: "4 cups", metric: "500 g" },
        { name: "Lukewarm water (approx 84% hydration)", amount: "420ml / 1.75 cups", category: "Liquids", imperial: "1.75 cups", metric: "420 ml" },
        { name: "Instant dry yeast", amount: "4g / 1 tsp", category: "Dry", imperial: "1 tsp", metric: "4 g" },
        { name: "Fine sea salt", amount: "12g / 2 tsp", category: "Dry", imperial: "2 tsp", metric: "12 g" },
        { name: "Extra virgin olive oil", amount: "5 tbsp / 75ml", category: "Oils", imperial: "5 tbsp", metric: "75 ml" },
        { name: "Fresh rosemary needles", amount: "3 sprigs", category: "Produce", imperial: "3 sprigs", metric: "3 sprigs" },
        { name: "Flaky Maldon sea salt", amount: "1 tbsp", category: "Garnish", imperial: "1 tbsp", metric: "1 tbsp" },
        { name: "Wildflower or clover honey", amount: "1.5 tbsp / 22ml", category: "Garnish", imperial: "1.5 tbsp", metric: "22 ml" }
      ],
      steps: [
        {
          step: 1,
          title: "Mix Shaggy Dough",
          instruction: "In a large bowl, whisk flour, yeast, and salt. Pour in lukewarm water and stir with a spatula until no dry flour remains. Cover with a damp cloth for 30 minutes.",
          timerSeconds: 1800,
          timerLabel: "30 mins"
        },
        {
          step: 2,
          title: "Three Coil Folds",
          instruction: "Dip fingers in olive oil. Lift dough from center, fold under itself. Repeat 4 times around the bowl. Perform 3 total rounds of folds, 30 minutes apart.",
          timerSeconds: 3600,
          timerLabel: "1 hr total"
        },
        {
          step: 3,
          title: "Overnight Cold Ferment",
          instruction: "Cover bowl tightly and place in refrigerator for 12 to 24 hours to develop bubbly gluten structure and deep sourdough-like aroma.",
          timerSeconds: 43200,
          timerLabel: "12 hours"
        },
        {
          step: 4,
          title: "Pan Proofing & Finger Dimpling",
          instruction: "Oil a 9x13 metal baking pan with 3 tbsp olive oil. Transfer relaxed dough. Let rise at room temp for 2 hours until ultra puffy. Dimple firmly with oiled fingertips.",
          timerSeconds: 7200,
          timerLabel: "2 hours"
        },
        {
          step: 5,
          title: "Bake at 220°C (425°F)",
          instruction: "Scatter fresh rosemary needles and flaky salt over top. Bake for 20-22 minutes until golden amber and crusty on bottom.",
          timerSeconds: 1320,
          timerLabel: "22 mins"
        },
        {
          step: 6,
          title: "Elena's Hot Honey Finish",
          instruction: "Remove piping hot focaccia. Immediately drizzle warm honey over the bubbly surface. Let rest 15 minutes on a wire rack before slicing.",
          timerSeconds: 900,
          timerLabel: "15 mins"
        }
      ]
    }
  },
  {
    id: 'rohan-dal',
    title: 'Auntie Priya’s Golden Dal Tadka',
    friendName: 'Rohan’s Mom (Auntie Priya)',
    tag: 'Hometown Comfort',
    duration: '0:58',
    dateRecorded: 'Recorded Oct 2, 2026',
    audioFile: null,
    rawTranscript: `Beta Rohan, listen to your mummy and stop ordering takeaway. Wash one cup of yellow toor dal three times until the water runs clear. In a pressure cooker or heavy pot, add two cups of fresh water, half a teaspoon of golden turmeric, one chopped ripe tomato, and one teaspoon salt. Boil for 15 minutes until creamy and mushy. Now for the tadka—this is where the whole soul of the dish is! Take two tablespoons of pure desi ghee in your small tadka pan. When it is smoking hot, toss in mustard seeds, cumin seeds, two broken dry Kashmiri red chilies, four crushed garlic cloves, and a sprig of fresh curry leaves. When the seeds crackle and the garlic turns nutty brown, pour the sizzling ghee directly into the dal and slam the lid closed for two minutes so the smoke stays inside. Eat with steamed basmati rice and lemon!`,
    structured: {
      id: 'rohan-dal',
      title: "Auntie Priya’s Sizzling Garlic & Ghee Dal Tadka",
      originStory: "Spoken WhatsApp memo sent by Auntie Priya to Rohan when he moved to his first student apartment. Turns unwritten instinct into a nourishing weeknight ritual.",
      prepTime: "10 mins",
      cookTime: "20 mins",
      servings: 4,
      difficulty: "Beginner Friendly",
      tags: ["Indian", "Vegetarian", "High Protein", "Gluten-Free"],
      secretTip: {
        title: "Auntie Priya's Aroma Trap Technique",
        body: "Immediately slam the pot lid shut for 2 minutes after pouring the sizzling ghee tadka. This infuses the entire lentil broth with toasted garlic and curry leaf essential oils."
      },
      heritagePairing: {
        beverage: "Masala Chaas (Spiced Churned Buttermilk with Roasted Cumin)",
        alcoholFree: "Sweet Alphonso Mango Lassi or Chilled Cardamom Darjeeling Tea",
        notes: "Cool probiotic yogurt and toasted jeera immediately soothe the fragrant garlic heat and smoky Kashmiri red chilies."
      },
      ingredients: [
        { name: "Yellow toor dal (pigeon peas)", amount: "1 cup / 200g", category: "Lentils", imperial: "1 cup", metric: "200 g" },
        { name: "Water (for boiling)", amount: "2.5 cups / 600ml", category: "Liquids", imperial: "2.5 cups", metric: "600 ml" },
        { name: "Ground turmeric", amount: "1/2 tsp", category: "Spices", imperial: "1/2 tsp", metric: "1/2 tsp" },
        { name: "Ripe tomato (chopped)", amount: "1 medium", category: "Produce", imperial: "1 medium", metric: "1 medium" },
        { name: "Salt", amount: "1 tsp (to taste)", category: "Pantry", imperial: "1 tsp", metric: "1 tsp" },
        { name: "Pure desi ghee (or coconut oil)", amount: "2 tbsp / 30g", category: "Fats", imperial: "2 tbsp", metric: "30 g" },
        { name: "Black mustard seeds", amount: "1 tsp", category: "Spices", imperial: "1 tsp", metric: "1 tsp" },
        { name: "Cumin seeds (jeera)", amount: "1 tsp", category: "Spices", imperial: "1 tsp", metric: "1 tsp" },
        { name: "Dried Kashmiri red chilies", amount: "2 whole", category: "Spices", imperial: "2 whole", metric: "2 whole" },
        { name: "Fresh garlic cloves (crushed)", amount: "4 cloves", category: "Produce", imperial: "4 cloves", metric: "4 cloves" },
        { name: "Fresh curry leaves", amount: "1 sprig (8-10 leaves)", category: "Produce", imperial: "1 sprig", metric: "1 sprig" },
        { name: "Fresh cilantro & lemon wedges", amount: "For garnish", category: "Garnish", imperial: "To taste", metric: "To taste" }
      ],
      steps: [
        {
          step: 1,
          title: "Rinse & Cook Lentils",
          instruction: "Wash toor dal 3 times in cold water. Add to pot with 2.5 cups water, turmeric, chopped tomato, and salt. Simmer 20 minutes (or pressure cook 3 whistles) until dal breaks down smoothly.",
          timerSeconds: 1200,
          timerLabel: "20 mins"
        },
        {
          step: 2,
          title: "Whisk to Creamy Consistency",
          instruction: "Using a whisk or wooden masher (mathani), vigorously swirl the cooked dal until it turns into a velvety, golden broth. Adjust water if too thick.",
          timerSeconds: 120,
          timerLabel: "2 mins"
        },
        {
          step: 3,
          title: "Heat Ghee for the Tadka",
          instruction: "In a small skillet or tadka pan, heat 2 tablespoons of desi ghee over medium-high heat until it ripples and faintly smokes.",
          timerSeconds: 120,
          timerLabel: "2 mins"
        },
        {
          step: 4,
          title: "Temper Spices & Garlic",
          instruction: "Add mustard seeds and cumin seeds; let them crackle. Immediately add broken dry red chilies, crushed garlic, and curry leaves. Sauté until garlic turns nutty golden.",
          timerSeconds: 60,
          timerLabel: "1 min"
        },
        {
          step: 5,
          title: "The Sizzle & Aroma Trap",
          instruction: "Pour the sizzling hot ghee directly over the hot dal. Immediately clamp the pot lid shut for 2 full minutes to trap the fragrant steam.",
          timerSeconds: 120,
          timerLabel: "2 mins"
        },
        {
          step: 6,
          title: "Garnish & Enjoy",
          instruction: "Open lid, stir in chopped fresh cilantro and a squeeze of fresh lime juice. Serve with steaming basmati rice or warm rotis.",
          timerSeconds: 60,
          timerLabel: "1 min"
        }
      ]
    }
  },
  {
    id: 'abuela-birria',
    title: 'Abuela Carmen’s Jalisco Beef Birria',
    friendName: 'Sofia’s Abuela Carmen',
    tag: 'Generational Keepsake',
    duration: '1:35',
    dateRecorded: 'Recorded Oct 2, 2026',
    audioFile: null,
    rawTranscript: `Mija Sofia, put down your phone and pay attention because this is how my mother made birria in Guadalajara. Take four dried Guajillo chilies and two Ancho chilies, deseed them, and toast them dry in the comal for just thirty seconds. Boil them in a cup of water until soft. In your blender, blend the chilies with four cloves of garlic, half an onion, a teaspoon of Mexican oregano, a pinch of cumin, two cloves, and a stick of Mexican canela cinnamon with three tablespoons of apple cider vinegar. Strain this red adobo directly over three pounds of bone-in beef shank and chuck roast. Salt it well and let it marinate for two hours. Brown the meat first, then cover with rich beef broth and braise gently on low for three hours until the meat surrenders and shreds with just two forks. Skim the ruby red chili oil from the top of the consomé to dip your corn tortillas before crisping them on the skillet with Oaxaca cheese. That consomé is life!`,
    structured: {
      id: 'abuela-birria',
      title: "Abuela Carmen’s Slow-Braised Jalisco Beef Birria & Consomé",
      originStory: "Spoken Guadalajara kitchen memo preserved by Sofia. A masterclass in Mexican chile toasting, fragrant canela braising, and heirloom consomé dipping.",
      prepTime: "30 mins",
      cookTime: "3 hrs",
      servings: 6,
      difficulty: "Intermediate",
      tags: ["Mexican", "Slow Braise", "Heirloom Chiles", "Consomé"],
      secretTip: {
        title: "Abuela Carmen's Red Fat Tortilla Dip",
        body: "Skim the fragrant ruby chili oil floating on top of the braising consomé into a small bowl. Dip corn tortillas in this spiced fat before griddling with Oaxaca cheese for restaurant-level quesabirria crust."
      },
      heritagePairing: {
        beverage: "Chilled Mexican Negra Modelo (or smoky Mezcal Paloma)",
        alcoholFree: "Iced Agua de Horchata with roasted cinnamon & toasted rice milk",
        notes: "Creamy, vanilla-scented horchata extinguishes toasted Guajillo heat while highlighting warm canela spices."
      },
      ingredients: [
        { name: "Bone-in beef shank & chuck roast", amount: "3 lbs / 1.4kg", category: "Meats", imperial: "3 lbs", metric: "1.4 kg" },
        { name: "Dried Guajillo chiles (stemmed & seeded)", amount: "4 whole", category: "Produce", imperial: "4 whole", metric: "4 whole" },
        { name: "Dried Ancho chiles (stemmed & seeded)", amount: "2 whole", category: "Produce", imperial: "2 whole", metric: "2 whole" },
        { name: "Fresh garlic cloves", amount: "4 cloves", category: "Produce", imperial: "4 cloves", metric: "4 cloves" },
        { name: "White onion (chopped)", amount: "1/2 medium", category: "Produce", imperial: "1/2 medium", metric: "1/2 medium" },
        { name: "Mexican dried oregano", amount: "1 tsp", category: "Spices", imperial: "1 tsp", metric: "1 tsp" },
        { name: "Mexican canela (cinnamon stick)", amount: "1 stick (2 inch)", category: "Spices", imperial: "1 stick", metric: "1 stick" },
        { name: "Apple cider vinegar", amount: "3 tbsp / 45ml", category: "Pantry", imperial: "3 tbsp", metric: "45 ml" },
        { name: "Rich beef bone broth", amount: "4 cups / 950ml", category: "Pantry", imperial: "4 cups", metric: "950 ml" },
        { name: "Corn tortillas & Oaxaca cheese", amount: "12 tortillas / 250g cheese", category: "Pantry", imperial: "12 tortillas", metric: "12 tortillas" },
        { name: "Diced white onion & fresh cilantro & lime", amount: "For serving", category: "Garnish", imperial: "To taste", metric: "To taste" }
      ],
      steps: [
        {
          step: 1,
          title: "Toast & Rehydrate Dried Chiles",
          instruction: "Gently press stemmed chiles on a hot dry skillet for 20-30 seconds until fragrant (do not burn). Transfer to a bowl with 1 cup boiling water for 10 minutes until supple.",
          timerSeconds: 600,
          timerLabel: "10 mins"
        },
        {
          step: 2,
          title: "Blend the Heirloom Adobo",
          instruction: "In a blender, puree softened chiles with soaking liquid, garlic, onion, Mexican oregano, cumin, cinnamon piece, and apple cider vinegar until completely smooth.",
          timerSeconds: 180,
          timerLabel: "3 mins"
        },
        {
          step: 3,
          title: "Marinate the Beef",
          instruction: "Pour the strained chili adobo all over beef chuck and shank pieces with 2 teaspoons coarse salt. Marinate at room temperature for 30-45 minutes.",
          timerSeconds: 1800,
          timerLabel: "30 mins"
        },
        {
          step: 4,
          title: "Low & Slow Consomé Braise",
          instruction: "Sear meat lightly in a Dutch oven, add remaining adobo and beef bone broth. Cover tightly, bring to simmer, and cook on low heat for 3 hours until fork tender.",
          timerSeconds: 10800,
          timerLabel: "3 hours"
        },
        {
          step: 5,
          title: "Shred Meat & Skim Consomé Fat",
          instruction: "Transfer beef to cutting board and shred with two forks. Skim the rich ruby spiced fat from the top of the consomé into a dish.",
          timerSeconds: 300,
          timerLabel: "5 mins"
        },
        {
          step: 6,
          title: "Crisp Quesabirria Tacos & Serve",
          instruction: "Dip tortillas into reserved spiced fat, lay on hot comal, fill with shredded birria and Oaxaca cheese. Fold and crisp both sides. Serve with piping hot consomé bowls for dipping!",
          timerSeconds: 360,
          timerLabel: "6 mins"
        }
      ]
    }
  }
];
