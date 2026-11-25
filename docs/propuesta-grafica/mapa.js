// Mapa de cobertura de la maqueta: grafo de barrios de Cali dibujado en SVG.
// En la plataforma el mismo grafo se dibuja sobre OpenStreetMap con Leaflet.
window.dibujarMapa = function (contenedor, { ruta = [], destino = null, compacto = false } = {}) {
  const N = {
    'chipichape': ['Chipichape', 300, 40], 'la-flora': ['La Flora', 392, 64], 'versalles': ['Versalles', 330, 112],
    'normandia': ['Normandía', 132, 108], 'granada': ['Granada', 226, 100], 'centro': ['Centro', 292, 160],
    'el-penon': ['El Peñón', 160, 166], 'san-antonio': ['San Antonio', 214, 176], 'san-fernando': ['San Fernando', 236, 236],
    'alameda': ['Alameda', 318, 222], 'tequendama': ['Tequendama', 262, 288], 'el-ingenio': ['El Ingenio', 322, 330],
    'meléndez': ['Meléndez', 392, 352], 'capri': ['Capri', 238, 346], 'ciudad-jardin': ['Ciudad Jardín', 220, 400],
    'valle-del-lili': ['Valle del Lili', 338, 410], 'pance': ['Pance', 112, 424], 'jamundi': ['Jamundí', 46, 452]
  };
  const A = [['chipichape','la-flora',1.9],['chipichape','versalles',1.6],['versalles','centro',2.2],['versalles','granada',1.4],
    ['granada','normandia',1.8],['granada','centro',1.7],['centro','san-antonio',1.2],['san-antonio','el-penon',0.9],
    ['el-penon','normandia',1.5],['san-antonio','san-fernando',1.6],['centro','alameda',2.0],['alameda','san-fernando',1.8],
    ['san-fernando','tequendama',2.1],['alameda','tequendama',2.4],['tequendama','capri',2.8],['tequendama','el-ingenio',2.5],
    ['el-ingenio','meléndez',1.9],['el-ingenio','capri',2.2],['capri','ciudad-jardin',2.6],['ciudad-jardin','valle-del-lili',3.1],
    ['meléndez','valle-del-lili',2.4],['ciudad-jardin','pance',4.2]];
  const enRuta = (a, b) => ruta.some((n, i) => i < ruta.length - 1 && ((ruta[i] === a && ruta[i + 1] === b) || (ruta[i] === b && ruta[i + 1] === a)));
  let s = `<svg viewBox="0 0 470 480" role="img" aria-label="Mapa de barrios con la ruta desde la cocina" style="width:100%;height:100%;display:block">`;
  s += `<defs><pattern id="cuad" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#E6E1D6" stroke-width="1"/></pattern></defs>`;
  s += `<rect width="470" height="480" fill="#F6F3EC"/><rect width="470" height="480" fill="url(#cuad)"/>`;
  s += `<path d="M470 120C420 150 400 190 410 240S450 330 430 380 380 470 360 480" fill="none" stroke="#BFD6DE" stroke-width="10" stroke-linecap="round"/>`;
  s += `<path d="M0 230C60 220 120 236 170 220S250 190 300 170" fill="none" stroke="#BFD6DE" stroke-width="4" stroke-linecap="round"/>`;
  A.forEach(([a, b]) => { const p = N[a], q = N[b]; s += `<line x1="${p[1]}" y1="${p[2]}" x2="${q[1]}" y2="${q[2]}" stroke="${enRuta(a, b) ? '#D8261C' : '#B9B2A6'}" stroke-width="${enRuta(a, b) ? 4 : 1.5}" ${enRuta(a, b) ? '' : 'stroke-dasharray="1 0"'} stroke-linecap="round"/>`; });
  Object.entries(N).forEach(([id, [nombre, x, y]]) => {
    const cocina = id === 'san-fernando', dest = id === destino, fuera = id === 'jamundi', r = ruta.includes(id);
    if (cocina) s += `<rect x="${x - 11}" y="${y - 11}" width="22" height="22" fill="#161412"/><path d="M${x - 5} ${y + 1}a5 5 0 0 1 10 0M${x - 6} ${y + 1}h12" stroke="#FBFAF6" stroke-width="1.6" fill="none"/>`;
    else if (dest) s += `<circle cx="${x}" cy="${y}" r="11" fill="#D8261C"/><circle cx="${x}" cy="${y}" r="4" fill="#fff"/>`;
    else s += `<circle cx="${x}" cy="${y}" r="${r ? 6 : 5}" fill="${fuera ? '#F6F3EC' : r ? '#D8261C' : '#fff'}" stroke="${fuera ? '#8A8379' : r ? '#D8261C' : '#4A4540'}" stroke-width="1.6" ${fuera ? 'stroke-dasharray="2 2"' : ''}/>`;
    if (!compacto || cocina || dest || r) {
      const w = cocina || dest ? 700 : 500, c = fuera ? '#6E675F' : '#161412';
      s += `<text x="${x + 14}" y="${y + 4}" font-family="Schibsted Grotesk, sans-serif" font-size="${cocina || dest ? 13 : 11.5}" font-weight="${w}" fill="${c}" paint-order="stroke" stroke="#F6F3EC" stroke-width="4">${nombre}${cocina ? ' · Cocina' : ''}${fuera ? ' · fuera de cobertura' : ''}</text>`;
    }
  });
  s += `</svg>`;
  contenedor.innerHTML = s;
};
