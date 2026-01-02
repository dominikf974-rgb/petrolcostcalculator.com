/* /prices/country-prices-usd.js
   Status: 2025-01-01 (manual)
   Unit: USD per litre
   Fields:
   - unleaded91  = Petrol (≈ Regular)
   - unleaded95  = Premium
   - diesel      = Diesel
*/
(function () {
  const COUNTRY_FUEL_PRICES_USD = {

    // --- Europe ---
    DE: { unleaded91: 2.00, unleaded95: 2.10, diesel: 1.95, name: "Germany" },
    AT: { unleaded91: 1.90, unleaded95: 2.00, diesel: 1.85, name: "Austria" },
    CH: { unleaded91: 2.10, unleaded95: 2.20, diesel: 2.05, name: "Switzerland" },
    FR: { unleaded91: 2.00, unleaded95: 2.10, diesel: 1.97, name: "France" },
    IT: { unleaded91: 2.05, unleaded95: 2.15, diesel: 2.00, name: "Italy" },
    ES: { unleaded91: 1.75, unleaded95: 1.85, diesel: 1.72, name: "Spain" },
    PT: { unleaded91: 1.85, unleaded95: 1.95, diesel: 1.85, name: "Portugal" },
    NL: { unleaded91: 2.15, unleaded95: 2.25, diesel: 2.05, name: "Netherlands" },
    BE: { unleaded91: 2.00, unleaded95: 2.10, diesel: 1.95, name: "Belgium" },
    LU: { unleaded91: 1.85, unleaded95: 1.95, diesel: 1.80, name: "Luxembourg" },
    DK: { unleaded91: 2.10, unleaded95: 2.20, diesel: 2.05, name: "Denmark" },
    SE: { unleaded91: 2.10, unleaded95: 2.20, diesel: 2.05, name: "Sweden" },
    NO: { unleaded91: 2.25, unleaded95: 2.35, diesel: 2.20, name: "Norway" },
    FI: { unleaded91: 2.10, unleaded95: 2.20, diesel: 2.05, name: "Finland" },
    IS: { unleaded91: 2.35, unleaded95: 2.45, diesel: 2.25, name: "Iceland" },
    GB: { unleaded91: 2.15, unleaded95: 2.25, diesel: 2.20, name: "United Kingdom" },
    IE: { unleaded91: 2.05, unleaded95: 2.15, diesel: 2.05, name: "Ireland" },

    PL: { unleaded91: 1.70, unleaded95: 1.80, diesel: 1.70, name: "Poland" },
    CZ: { unleaded91: 1.70, unleaded95: 1.80, diesel: 1.75, name: "Czech Republic" },
    SK: { unleaded91: 1.75, unleaded95: 1.85, diesel: 1.75, name: "Slovakia" },
    HU: { unleaded91: 1.70, unleaded95: 1.80, diesel: 1.75, name: "Hungary" },
    SI: { unleaded91: 1.80, unleaded95: 1.90, diesel: 1.80, name: "Slovenia" },
    HR: { unleaded91: 1.75, unleaded95: 1.85, diesel: 1.75, name: "Croatia" },
    RO: { unleaded91: 1.60, unleaded95: 1.70, diesel: 1.65, name: "Romania" },
    BG: { unleaded91: 1.50, unleaded95: 1.60, diesel: 1.55, name: "Bulgaria" },
    GR: { unleaded91: 2.10, unleaded95: 2.20, diesel: 2.05, name: "Greece" },
    TR: { unleaded91: 1.40, unleaded95: 1.50, diesel: 1.35, name: "Turkey" },

    EE: { unleaded91: 1.80, unleaded95: 1.90, diesel: 1.75, name: "Estonia" },
    LV: { unleaded91: 1.75, unleaded95: 1.85, diesel: 1.70, name: "Latvia" },
    LT: { unleaded91: 1.70, unleaded95: 1.80, diesel: 1.65, name: "Lithuania" },

    UA: { unleaded91: 1.40, unleaded95: 1.50, diesel: 1.40, name: "Ukraine" },
    BY: { unleaded91: 1.10, unleaded95: 1.20, diesel: 1.10, name: "Belarus" },
    RU: { unleaded91: 0.80, unleaded95: 0.85, diesel: 0.83, name: "Russia" },

    // --- North America ---
    US: { unleaded91: 1.10, unleaded95: 1.20, diesel: 1.25, name: "United States" },
    CA: { unleaded91: 1.40, unleaded95: 1.50, diesel: 1.45, name: "Canada" },
    MX: { unleaded91: 1.30, unleaded95: 1.40, diesel: 1.25, name: "Mexico" },

    // --- South America ---
    BR: { unleaded91: 1.40, unleaded95: 1.50, diesel: 1.35, name: "Brazil" },
    AR: { unleaded91: 1.25, unleaded95: 1.35, diesel: 1.20, name: "Argentina" },
    CL: { unleaded91: 1.50, unleaded95: 1.60, diesel: 1.45, name: "Chile" },
    CO: { unleaded91: 1.25, unleaded95: 1.35, diesel: 1.20, name: "Colombia" },
    PE: { unleaded91: 1.35, unleaded95: 1.45, diesel: 1.30, name: "Peru" },
    UY: { unleaded91: 1.85, unleaded95: 1.95, diesel: 1.80, name: "Uruguay" },

    // --- Oceania ---
    AU: { unleaded91: 1.90, unleaded95: 2.00, diesel: 1.85, name: "Australia" },
    NZ: { unleaded91: 2.10, unleaded95: 2.20, diesel: 2.00, name: "New Zealand" },

    // --- Asia ---
    JP: { unleaded91: 1.90, unleaded95: 2.00, diesel: 1.85, name: "Japan" },
    KR: { unleaded91: 1.95, unleaded95: 2.05, diesel: 1.90, name: "South Korea" },
    CN: { unleaded91: 1.35, unleaded95: 1.45, diesel: 1.25, name: "China" },
    HK: { unleaded91: 2.75, unleaded95: 2.85, diesel: 2.55, name: "Hong Kong" },
    TW: { unleaded91: 1.30, unleaded95: 1.40, diesel: 1.20, name: "Taiwan" },
    SG: { unleaded91: 2.35, unleaded95: 2.45, diesel: 2.25, name: "Singapore" },
    MY: { unleaded91: 0.70, unleaded95: 0.80, diesel: 0.65, name: "Malaysia" },
    TH: { unleaded91: 1.35, unleaded95: 1.45, diesel: 1.30, name: "Thailand" },
    VN: { unleaded91: 1.20, unleaded95: 1.30, diesel: 1.10, name: "Vietnam" },
    ID: { unleaded91: 1.10, unleaded95: 1.20, diesel: 1.00, name: "Indonesia" },
    PH: { unleaded91: 1.20, unleaded95: 1.30, diesel: 1.10, name: "Philippines" },
    IN: { unleaded91: 1.25, unleaded95: 1.35, diesel: 1.20, name: "India" },
    PK: { unleaded91: 1.10, unleaded95: 1.20, diesel: 1.05, name: "Pakistan" },
    BD: { unleaded91: 1.15, unleaded95: 1.25, diesel: 1.10, name: "Bangladesh" },
    LK: { unleaded91: 1.35, unleaded95: 1.45, diesel: 1.25, name: "Sri Lanka" },

    // --- Middle East ---
    AE: { unleaded91: 1.00, unleaded95: 1.10, diesel: 0.95, name: "United Arab Emirates" },
    SA: { unleaded91: 0.75, unleaded95: 0.85, diesel: 0.70, name: "Saudi Arabia" },
    QA: { unleaded91: 0.85, unleaded95: 0.95, diesel: 0.80, name: "Qatar" },
    KW: { unleaded91: 0.60, unleaded95: 0.70, diesel: 0.60, name: "Kuwait" },
    OM: { unleaded91: 0.80, unleaded95: 0.90, diesel: 0.75, name: "Oman" },
    IL: { unleaded91: 2.15, unleaded95: 2.25, diesel: 2.10, name: "Israel" },
    IR: { unleaded91: 0.35, unleaded95: 0.40, diesel: 0.35, name: "Iran" },

    // --- Africa ---
    ZA: { unleaded91: 1.50, unleaded95: 1.60, diesel: 1.45, name: "South Africa" },
    EG: { unleaded91: 0.90, unleaded95: 1.00, diesel: 0.85, name: "Egypt" },
    MA: { unleaded91: 1.60, unleaded95: 1.70, diesel: 1.50, name: "Morocco" },
    TN: { unleaded91: 1.10, unleaded95: 1.20, diesel: 1.05, name: "Tunisia" },
    NG: { unleaded91: 0.75, unleaded95: 0.85, diesel: 0.70, name: "Nigeria" },
    KE: { unleaded91: 1.60, unleaded95: 1.70, diesel: 1.50, name: "Kenya" }
  };

  window.COUNTRY_FUEL_PRICES_USD = COUNTRY_FUEL_PRICES_USD;
  window.COUNTRY_FUEL_PRICES_STAND = "2025-01-01";
})();
