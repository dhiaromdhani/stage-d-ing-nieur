const BASE = "https://www.stir.com.tn";
export const SITE_OFFICIEL_URL = BASE;

export const NAV_STRUCTURE = [
  { label: "Accueil", to: "/" },

  {
    label: "Présentation de la société",
    items: [
      { label: "A propos", href: `${BASE}/fr/page.php?r=1&sr=1&ssr=` },
      { label: "Historique", href: `${BASE}/fr/page.php?r=1&sr=2&ssr=` },
      { label: "Sécurité", href: `${BASE}/fr/page.php?ssr=1&r=1&sr=4` },
      { label: "Environnement", href: `${BASE}/fr/page.php?ssr=2&r=1&sr=4` },
      {
        label: "Système de management",
        items: [
          { label: "Politique générale", href: `${BASE}/fr/page.php?ssr=18&r=1&sr=9` },
          { label: "Certificat ISO 9001:2015", href: `${BASE}/fr/page.php?ssr=19&r=1&sr=9` },
          { label: "Accréditation labo 17025:2013", href: `${BASE}/fr/page.php?ssr=21&r=1&sr=9` },
          { label: "Certificat ISO 27001:2013", href: `${BASE}/fr/page.php?ssr=21&r=1&sr=9` },
        ],
      },
    ],
  },

  {
    label: "Activités et Produits",
    items: [
      {
        label: "Activités",
        items: [
          { label: "Unité de raffinage", href: `${BASE}/fr/page.php?ssr=3&r=2&sr=6` },
          { label: "Centre thermique et utilités", href: `${BASE}/fr/page.php?ssr=4&r=2&sr=6` },
          { label: "Parc de stockage", href: `${BASE}/fr/page.php?ssr=5&r=2&sr=6` },
          { label: "Port pétrolier", href: `${BASE}/fr/page.php?ssr=6&r=2&sr=6` },
        ],
      },
      {
        label: "Produits",
        items: [
          { label: "GPL", href: `${BASE}/fr/page.php?ssr=7&r=2&sr=5` },
          { label: "Essence sans plomb", href: `${BASE}/fr/page.php?ssr=8&r=2&sr=5` },
          { label: "Essence super", href: `${BASE}/fr/page.php?ssr=9&r=2&sr=5` },
          { label: "Essence normale", href: `${BASE}/fr/page.php?ssr=10&r=2&sr=5` },
          { label: "White spirit", href: `${BASE}/fr/page.php?ssr=11&r=2&sr=5` },
          { label: "Pétrole lampant", href: `${BASE}/fr/page.php?ssr=12&r=2&sr=5` },
          { label: "Gasoil", href: `${BASE}/fr/page.php?ssr=13&r=2&sr=5` },
          { label: "Virgin naphta", href: `${BASE}/fr/page.php?ssr=14&r=2&sr=5` },
          { label: "Fuel-oil N2", href: `${BASE}/fr/page.php?ssr=15&r=2&sr=5` },
          { label: "Résidu atmosphérique", href: `${BASE}/fr/page.php?ssr=16&r=2&sr=5` },
          { label: "Gasoil ordinaire", href: `${BASE}/fr/page.php?ssr=17&r=2&sr=5` },
        ],
      },
    ],
  },

  { label: "Centre de Formation et Stage", href: `${BASE}/centre/index.php` },

  {
    label: "École du Feu",
    items: [
      { label: "Présentation", href: `${BASE}/fr/Ecole.php?r=1` },
      { label: "Calendrier", href: `${BASE}/fr/programme.php` },
      { label: "Inscription en ligne", href: `${BASE}/fr/inscritecoles.php` },
    ],
  },

  {
    label: "Laboratoire",
    items: [
      { label: "Présentation", href: `${BASE}/fr/laboratoire.php?idL=1` },
      { label: "Services", href: `${BASE}/fr/laboratoire.php?idL=2` },
      { label: "Demande de devis", href: `${BASE}/fr/inscritlabo.php` },
    ],
  },

  { label: "Partenaires", href: `${BASE}/centre/index.php` },

  {
    label: "Carrière",
    items: [
      { label: "Concours", href: `${BASE}/fr/` },
    ],
  },
];