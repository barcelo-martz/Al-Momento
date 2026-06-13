export interface ItemMenuProps {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  onAgregar: () => void;
}

export default function ItemMenu({
  nombre,
  descripcion,
  precio,
  imagen,
  onAgregar,
}: ItemMenuProps) {
  return (
    <div className="space-y-4">
      {/* <!-- Product 1 --> */}
      <div className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(192,86,33,0.08)] flex h-32 group relative">
        <div className="w-1/3 h-full overflow-hidden">
          <img
            alt="Ceviche Clásico"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            data-alt="A close-up high-angle shot of a fresh Peruvian ceviche served in a white ceramic bowl. The dish features white fish, red onions, and fresh cilantro, bathed in a bright tiger's milk sauce. The lighting is warm and natural, suggesting a sun-drenched bistro environment. The color palette is dominated by fresh whites and vibrant citrus colors, maintaining a high-key modern culinary aesthetic."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGD8XUYtyf_WjGqTYKxtC9D7-rxwgv0mEDPHpE6fcIWE8ClIAepmPDWssNefad3qrifwXyhwRkDUXfIzUzed4hJ7Vy1F0gHxCSMbafX8QEP0aYF_-KONr9VU-UTpBJ92j7gfbvq8ustwgx1KwEs34KrCzy-0-9m8dPBMiXUcV77JAccjUTtBBqzg4sd5G8gt8kZq9ZPORArM7V8aiM4SAT9SMVlYEYGIU7eag5tK-p0zjol0Ld6kNDsvUo3K7IwE4rlhgATb7PONEg"
          />
        </div>
        <div className="w-2/3 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-label-bold text-label-bold text-on-surface">
              Ceviche Clásico
            </h3>
            <p className="text-[12px] leading-tight text-on-surface-variant line-clamp-2 mt-1">
              Pescado fresco marinado en limón sutil, cebolla roja y cilantro.
            </p>
          </div>
          <div className="flex justify-between items-end">
            <span className="font-price-display text-price-display text-primary">
              $12.50
            </span>
            <button
              className="bg-primary-container text-on-primary-container w-10 h-10 rounded-lg flex items-center justify-center active:scale-90 transition-transform"
              onClick={onAgregar}
            >
              <span className="material-symbols-outlined" data-icon="add">
                add
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Product 2 --> */}
      <div className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(192,86,33,0.08)] flex h-32 group">
        <div className="w-1/3 h-full overflow-hidden">
          <img
            alt="Tacos al Pastor"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            data-alt="Three vibrant tacos al pastor arranged artistically on a textured plate. The pork is thinly sliced with charred edges, topped with bright pineapple chunks, chopped onions, and cilantro. The lighting is soft and golden, accentuating the warm terracotta tones of the meat. The style is modern minimalist food photography with a focus on appetite appeal and tactile texture."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTr3kAe_ZzXZWdccEhm3xpiacZP6bKVefQEpLs8nwr96gALzE1vKo2FQPo7SdvprkHQSookcZ_0xYDgxfw7F_MLTXNCZCBEi9Q6kHzLx_GEiZD983b_v-fZet_3bkmMtnOQNxqi13RDFrGf1Lo-WJEOvECpfYEdDaW9rObzh0L5MXAZHL6TxK45bgIba5-QR-L36uQoFkb2UNVYlhWz-DBE2TjKO7C7z68906lQw193Dm0RxhGxEEEWHgGhUias0_sHv-zkTUYtBkM"
          />
        </div>
        <div className="w-2/3 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-label-bold text-label-bold text-on-surface">
              Tacos al Pastor
            </h3>
            <p className="text-[12px] leading-tight text-on-surface-variant line-clamp-2 mt-1">
              Cerdo marinado con piña, cebolla y cilantro en tortilla de maíz.
            </p>
          </div>
          <div className="flex justify-between items-end">
            <span className="font-price-display text-price-display text-primary">
              $12.00
            </span>
            <button
              className="bg-primary-container text-on-primary-container w-10 h-10 rounded-lg flex items-center justify-center active:scale-90 transition-transform"
              onClick={onAgregar}
            >
              <span className="material-symbols-outlined" data-icon="add">
                add
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Product 3 --> */}
      <div className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(192,86,33,0.08)] flex h-32 group">
        <div className="w-1/3 h-full overflow-hidden">
          <img
            alt="Ensalada Zen"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            data-alt="A large, shallow white bowl filled with a colorful Mediterranean salad. Bright green kale, roasted sweet potatoes, avocado slices, and cherry tomatoes are beautifully arranged. The lighting is bright and airy, emphasizing the freshness of the ingredients. The aesthetic is clean, modern, and health-focused, using a palette of natural greens and earthy orange tones."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq_Wszouf9A_CiwRfnLQLpLHTdujwtMUcIeH-mnZX412oOmmry-2Aw59kNuk2oIxG03Eqxh32AiT4oTHi-ZHw6tb2a4uAepv-O3gplom9rURYQuBM_jBgUHjhiHrkvGo1cVctIoHZLjvgIERfMOOj_34GpPCMJKr-hechdZ0zqbbv9NbmN1sXCNnGI1OdBPAP5sGoeCXVEQnHg5vTW9UdoJOdtzESqVmQ7kfVe64EGXmf2bTL2LM7JW749mkh99cvVGNFb2SzDT_Vq"
          />
        </div>
        <div className="w-2/3 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-label-bold text-label-bold text-on-surface">
              Ensalada Zen
            </h3>
            <p className="text-[12px] leading-tight text-on-surface-variant line-clamp-2 mt-1">
              Mix de verdes, palta, quinoa y vinagreta de la casa.
            </p>
          </div>
          <div className="flex justify-between items-end">
            <span className="font-price-display text-price-display text-primary">
              $10.50
            </span>
            <button className="bg-primary-container text-on-primary-container w-10 h-10 rounded-lg flex items-center justify-center active:scale-90 transition-transform">
              <span className="material-symbols-outlined" data-icon="add">
                add
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
