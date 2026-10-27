/* Robertsons Team: product catalog
   lb = pounds per gallon @ 20°C, sg = specific gravity 20°/20°C
   Edit this one file to update the catalog everywhere on the site. */
window.RT_CATALOG = [
  { id: "alcohols", name: "Alcohols", blurb: "Solvents and intermediates for production, treating and blending.", items: [
    ["Amyl Alcohol", 6.55, 0.786],
    ["Cyclohexanol", 6.58, 0.79],
    ["Ethanol, Anhydrous", 6.6, 0.791],
    ["Ethylhexanol (2EH)", 6.72, 0.808],
    ["Isopropyl Alcohol 99% (IPA)", 6.79, 0.815],
    ["Methanol", 6.94, 0.834],
    ["Methyl Amyl Alcohol", 7.91, 0.946]
  ]},
  { id: "aliphatics", name: "Aliphatics", blurb: "Light, fast-evaporating hydrocarbon solvents.", items: [
    ["Heptane", 5.79, 0.695],
    ["Hexane", 5.61, 0.675],
    ["Pentane", 5.26, 0.631],
    ["Solvent 142", 6.54, 0.784]
  ]},
  { id: "aromatics", name: "Aromatics", blurb: "High-solvency aromatic hydrocarbons.", items: [
    ["Toluene", 7.25, 0.869],
    ["Xylene", 7.26, 0.87]
  ]},
  { id: "glycols", name: "Glycols", blurb: "Dehydration, freeze protection and hydrate inhibition.", items: [
    ["Diethylene Glycol", 8.52, 1.023],
    ["Dipropylene Glycol", 9.36, 1.125],
    ["Ethylene Glycol", 8.64, 1.038],
    ["Hexylene Glycol", 7.69, 0.923],
    ["Propylene Glycol", 9.28, 1.115],
    ["Triethylene Glycol", 8.51, 1.023],
    ["Tripropylene Glycol", 9.31, 1.119]
  ]},
  { id: "glycol-ethers", name: "Glycol Ethers", blurb: "Coupling solvents for formulations and cleaners.", items: [
    ["Glycol Ether DB", 7.94, 0.954],
    ["Glycol Ether DE", 8.25, 0.991],
    ["Glycol Ether DM", 8.51, 1.023],
    ["Glycol Ether DP", 8.04, 0.969],
    ["Glycol Ether DPP", 7.67, 0.922],
    ["Glycol Ether EB", 7.51, 0.903],
    ["Glycol Ether EP", 7.59, 0.91],
    ["Glycol Ether PB", 7.32, 0.88],
    ["Glycol Ether PM", 7.65, 0.918],
    ["Glycol Ether PP", 7.36, 0.882]
  ]},
  { id: "ketones", name: "Ketones", blurb: "Strong, versatile industrial solvents.", items: [
    ["Acetone", 6.59, 0.79],
    ["Diisobutyl Ketone", 6.75, 0.809],
    ["Methyl Amyl Ketone", 6.8, 0.818],
    ["Methyl Ethyl Ketone (MEK)", 6.71, 0.806],
    ["Methyl Isobutyl Ketone (MIBK)", 6.78, 0.813],
    ["Methyl Isoamyl Ketone", 6.67, 0.802],
    ["Methyl Propyl Ketone", 6.72, 0.807]
  ]},
  { id: "acids", name: "Acids", blurb: "Mineral and organic acids for stimulation and processing.", items: [
    ["Acetic Acid Glacial 99.8%", 8.79, 1.053],
    ["Boric Acid 99.8%", 9.09, 1.089],
    ["Formic Acid 90%", 10.1, 1.211],
    ["Glycolic Acid 70%", 10.6, 1.27],
    ["Hydrochloric Acid 31.5%", 9.67, 1.159],
    ["Lactic Acid 88%", 10, 1.199],
    ["Phosphoric Acid 75%", 13.1, 1.57],
    ["Phosphoric Acid 85%", 14.1, 1.69]
  ]},
  { id: "amines", name: "Amines", blurb: "Corrosion inhibition, gas treating and neutralizing.", items: [
    ["Butyl Amine", 6.2, 0.745],
    ["Cyclohexylamine", 7.24, 0.868],
    ["Dibutyl Amine", 5.87, 0.703],
    ["Diethanolamine", 9.14, 1.095],
    ["Diethyl Amine", 5.87, 0.703],
    ["Diethylethanolamine", 7.39, 0.885],
    ["Diethylene Triamine", 7.98, 0.955],
    ["Diisopropyl Amine", 5.97, 0.718],
    ["Diisopropanolamine", 8.12, null, "@ 45°C"],
    ["Dimethylethanolamine", 7.39, 0.888],
    ["Ethyl Amine (70%)", 6.69, 0.8],
    ["Isopropyl Amine", 5.73, 0.633],
    ["Monoethanolamine", 8.48, 1.016],
    ["Monoisopropanolamine", 8.01, 0.962],
    ["Morpholine", 8.36, 1.004],
    ["Tetraethylene Pentamine", 8.33, 0.998],
    ["Triethanolamine, 99%", 9.37, 1.126],
    ["Triethyl Amine", 6.06, 0.728],
    ["Triethylene Tetramine", 8.17, 0.982]
  ]},
  { id: "other", name: "Other Products", blurb: "Caustics, oils and supporting products.", items: [
    ["Caustic Potash Liquid", 12.2, 1.462],
    ["Caustic Soda Liquid", 12.8, 1.534],
    ["Mineral Oil", 6.75, 0.809],
    ["Water", 8.34, 1]
  ]}
];

/* Packaging for the weight calculator
   gal = nominal volume per container, tare = empty container weight in lb
   Typical industry values; edit to match the containers you ship. */
window.RT_PACKAGING = [
  { id: "bulk", name: "Bulk", qty: 4000, note: "Tanker load. Product weight only, no container.", sizes: [
    { label: "Gallons", gal: 1, tare: 0 },
    { label: "Liters", gal: 0.264172, tare: 0 }
  ]},
  { id: "tote", name: "Totes", qty: 6, pick: 1, sizes: [
    { label: "275 gal tote", gal: 275, tare: 135 },
    { label: "330 gal tote", gal: 330, tare: 155 }
  ]},
  { id: "drum", name: "Poly Drums", qty: 10, sizes: [
    { label: "55 gal drum", gal: 55, tare: 22 }
  ]},
  { id: "pail", name: "Pails", qty: 20, sizes: [
    { label: "5 gal pail", gal: 5, tare: 2 }
  ]}
];
