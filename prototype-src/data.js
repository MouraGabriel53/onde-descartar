/* =========================================================
   DADOS DEMONSTRATIVOS
   Todos os pontos, nomes, endereços, telefones e sites abaixo são
   FICTÍCIOS. As coordenadas ficam dentro de distritos reais de São Paulo
   apenas para dar coerência geográfica à demonstração.

   Formato pensado para espelhar uma futura API REST / tabela no banco:
   GET /api/ecopontos  ->  Ecoponto[]
   ========================================================= */

/** Catálogo de materiais (chave estável -> rótulo/ícone) */
window.MATERIAIS = {
  papel:       { label: 'Papel e papelão' },
  plastico:    { label: 'Plásticos' },
  vidro:       { label: 'Vidros' },
  metal:       { label: 'Metais' },
  eletronicos: { label: 'Eletrônicos' },
  pilhas:      { label: 'Pilhas e baterias' },
  oleo:        { label: 'Óleo de cozinha' },
  moveis:      { label: 'Móveis' },
  entulho:     { label: 'Entulho' },
  especiais:   { label: 'Resíduos especiais' },
};

/* Horários: índice 0 = domingo ... 6 = sábado; null = fechado */
const H_ECO  = [['06:00','18:00'],['06:00','22:00'],['06:00','22:00'],['06:00','22:00'],['06:00','22:00'],['06:00','22:00'],['06:00','22:00']];
const H_PEV  = [null,['08:00','18:00'],['08:00','18:00'],['08:00','18:00'],['08:00','18:00'],['08:00','18:00'],['08:00','13:00']];
const H_COOP = [null,['07:30','16:30'],['07:30','16:30'],['07:30','16:30'],['07:30','16:30'],['07:30','16:30'],null];
const H_LOJA = [['14:00','20:00'],['10:00','22:00'],['10:00','22:00'],['10:00','22:00'],['10:00','22:00'],['10:00','22:00'],['10:00','22:00']];

/* Posição = ponto interno do distrito + pequeno deslocamento (graus) */
const _at = (distrito, dLat = 0, dLng = 0) => {
  const p = window.GEO.dpts[distrito];
  return { lat: +(p[0] + 0.0045 + dLat).toFixed(5), lng: +(p[1] + dLng).toFixed(5) };
};

window.ECOPONTOS_SEED = [
  { id:'eco-001', nome:'Ecoponto Bem-te-vi', tipo:'Ecoponto municipal', distrito:'Vila Mariana', ..._at('Vila Mariana', .002, -.003),
    descricao:'Recebe pequenos volumes de entulho, móveis e recicláveis. Limite de 1 m³ de entulho por dia, por pessoa.',
    endereco:'Rua das Embaúbas', numero:'480', bairro:'Vila Mariana', cidade:'São Paulo', estado:'SP', cep:'04101-000',
    materiais:['entulho','moveis','papel','plastico','vidro','metal'], horarios:H_ECO, telefone:'(11) 0000-0101', whatsapp:null, site:null },

  { id:'eco-002', nome:'Ponto Verde Ipê', tipo:'Ponto de entrega voluntária', distrito:'Pinheiros', ..._at('Pinheiros', .003, .004),
    descricao:'Contêineres de recicláveis secos e coletor de pilhas na entrada.',
    endereco:'Rua Ipê-Amarelo', numero:'1.120', bairro:'Pinheiros', cidade:'São Paulo', estado:'SP', cep:'05422-000',
    materiais:['papel','plastico','vidro','metal','pilhas'], horarios:H_PEV, telefone:'(11) 0000-0102', whatsapp:'(11) 0000-0102', site:'https://example.com/ondedescartar/ponto-verde-ipe' },

  { id:'eco-003', nome:'Cooperativa Recicla Norte', tipo:'Cooperativa de reciclagem', distrito:'Santana', ..._at('Santana', -.002, .002),
    descricao:'Cooperativa que faz triagem de recicláveis e recebe eletrônicos de pequeno porte.',
    endereco:'Avenida dos Sabiás', numero:'2.305', bairro:'Santana', cidade:'São Paulo', estado:'SP', cep:'02012-000',
    materiais:['papel','plastico','vidro','metal','eletronicos'], horarios:H_COOP, telefone:'(11) 0000-0103', whatsapp:'(11) 0000-0103', site:'https://example.com/ondedescartar/recicla-norte' },

  { id:'eco-004', nome:'Ecoponto Sabiá', tipo:'Ecoponto municipal', distrito:'Tatuapé', ..._at('Tatuapé', .001, -.002),
    descricao:'Aceita entulho, móveis e óleo de cozinha usado (entregue em garrafa PET fechada).',
    endereco:'Rua Flor-de-Maio', numero:'77', bairro:'Tatuapé', cidade:'São Paulo', estado:'SP', cep:'03310-000',
    materiais:['entulho','moveis','papel','plastico','metal','oleo'], horarios:H_ECO, telefone:'(11) 0000-0104', whatsapp:null, site:null },

  { id:'eco-005', nome:'Coleta Solidária Mooca', tipo:'Ponto de coleta em comércio', distrito:'Mooca', ..._at('Mooca', -.001, .003),
    descricao:'Coletores de óleo e pilhas dentro de um mercado parceiro (fictício).',
    endereco:'Rua Tico-Tico', numero:'356', bairro:'Mooca', cidade:'São Paulo', estado:'SP', cep:'03104-000',
    materiais:['oleo','pilhas'], horarios:H_LOJA, telefone:null, whatsapp:null, site:'https://example.com/ondedescartar/coleta-mooca' },

  { id:'eco-006', nome:'Ecoponto Jatobá', tipo:'Ecoponto municipal', distrito:'Butantã', ..._at('Butantã', .002, .002),
    descricao:'Um dos maiores pontos da zona oeste. Recebe também eletrônicos de pequeno porte.',
    endereco:'Avenida das Paineiras', numero:'3.900', bairro:'Butantã', cidade:'São Paulo', estado:'SP', cep:'05508-000',
    materiais:['entulho','moveis','papel','plastico','vidro','metal','eletronicos'], horarios:H_ECO, telefone:'(11) 0000-0106', whatsapp:null, site:null },

  { id:'eco-007', nome:'Estação Recicla Lapa', tipo:'Ponto de entrega voluntária', distrito:'Lapa', ..._at('Lapa', .002, .003),
    descricao:'Especializado em resíduos que não podem ir para o lixo comum: eletrônicos, pilhas, lâmpadas e similares.',
    endereco:'Rua dos Colibris', numero:'210', bairro:'Lapa', cidade:'São Paulo', estado:'SP', cep:'05074-000',
    materiais:['eletronicos','pilhas','especiais'], horarios:H_PEV, telefone:'(11) 0000-0107', whatsapp:'(11) 0000-0107', site:'https://example.com/ondedescartar/recicla-lapa' },

  { id:'eco-008', nome:'Ecoponto Quaresmeira', tipo:'Ecoponto municipal', distrito:'Itaquera', ..._at('Itaquera', 0, .002),
    descricao:'Recebe entulho, móveis velhos e recicláveis secos.',
    endereco:'Rua Quaresmeira-Roxa', numero:'1.004', bairro:'Itaquera', cidade:'São Paulo', estado:'SP', cep:'08210-000',
    materiais:['entulho','moveis','papel','plastico'], horarios:H_ECO, telefone:'(11) 0000-0108', whatsapp:null, site:null },

  { id:'eco-009', nome:'Ponto Limpo Santo Amaro', tipo:'Ponto de entrega voluntária', distrito:'Santo Amaro', ..._at('Santo Amaro', .002, .001),
    descricao:'Contêineres de recicláveis secos separados por tipo.',
    endereco:'Praça das Bromélias', numero:'s/n', bairro:'Santo Amaro', cidade:'São Paulo', estado:'SP', cep:'04745-000',
    materiais:['papel','plastico','vidro','metal'], horarios:H_PEV, telefone:null, whatsapp:null, site:null },

  { id:'eco-010', nome:'Cooperativa Mãos que Reciclam', tipo:'Cooperativa de reciclagem', distrito:'Campo Limpo', ..._at('Campo Limpo', .002, .002),
    descricao:'Recebe recicláveis limpos e secos. Entregas grandes devem ser combinadas pelo WhatsApp.',
    endereco:'Rua Maria-Preta', numero:'95', bairro:'Campo Limpo', cidade:'São Paulo', estado:'SP', cep:'05765-000',
    materiais:['papel','plastico','metal'], horarios:H_COOP, telefone:'(11) 0000-0110', whatsapp:'(11) 0000-0110', site:null },

  { id:'eco-011', nome:'Ecoponto Tiê', tipo:'Ecoponto municipal', distrito:'Ipiranga', ..._at('Ipiranga', .001, -.002),
    descricao:'Recebe entulho, móveis, vidro e óleo de cozinha usado.',
    endereco:'Rua Tiê-Sangue', numero:'640', bairro:'Ipiranga', cidade:'São Paulo', estado:'SP', cep:'04213-000',
    materiais:['entulho','moveis','oleo','papel','vidro'], horarios:H_ECO, telefone:'(11) 0000-0111', whatsapp:null, site:null },

  { id:'eco-012', nome:'Ponto Eletro Penha', tipo:'Ponto de coleta em comércio', distrito:'Penha', ..._at('Penha', -.001, .002),
    descricao:'Coletor de eletrônicos e pilhas em loja parceira (fictícia). Itens grandes não são aceitos.',
    endereco:'Rua Andorinha', numero:'1.580', bairro:'Penha', cidade:'São Paulo', estado:'SP', cep:'03634-000',
    materiais:['eletronicos','pilhas'], horarios:H_LOJA, telefone:'(11) 0000-0112', whatsapp:null, site:'https://example.com/ondedescartar/eletro-penha' },

  { id:'eco-013', nome:'Ecoponto Canela', tipo:'Ecoponto municipal', distrito:'Freguesia do Ó', ..._at('Freguesia do Ó', .001, .002),
    descricao:'Recebe entulho, móveis e recicláveis secos.',
    endereco:'Rua Canela-Sassafrás', numero:'312', bairro:'Freguesia do Ó', cidade:'São Paulo', estado:'SP', cep:'02910-000',
    materiais:['entulho','moveis','papel','plastico','metal'], horarios:H_ECO, telefone:'(11) 0000-0113', whatsapp:null, site:null },

  { id:'eco-014', nome:'Ponto de Coleta Bela Vista', tipo:'Ponto de coleta em comércio', distrito:'Bela Vista', ..._at('Bela Vista', .001, 0),
    descricao:'Coletores de pilhas, óleo e embalagens plásticas no hall de entrada de um centro comercial (fictício).',
    endereco:'Rua Jabuticabeira', numero:'88', bairro:'Bela Vista', cidade:'São Paulo', estado:'SP', cep:'01310-000',
    materiais:['pilhas','oleo','plastico'], horarios:H_LOJA, telefone:null, whatsapp:'(11) 0000-0114', site:null },

  { id:'eco-015', nome:'Ecoponto Araucária', tipo:'Ecoponto municipal', distrito:'Jabaquara', ..._at('Jabaquara', 0, .002),
    descricao:'Recebe entulho, móveis, vidro e metal.',
    endereco:'Avenida das Araucárias', numero:'2.010', bairro:'Jabaquara', cidade:'São Paulo', estado:'SP', cep:'04330-000',
    materiais:['entulho','moveis','vidro','metal'], horarios:H_ECO, telefone:'(11) 0000-0115', whatsapp:null, site:null },

  { id:'eco-016', nome:'Cooperativa Leste Viva', tipo:'Cooperativa de reciclagem', distrito:'São Mateus', ..._at('São Mateus', .002, .001),
    descricao:'Cooperativa de catadores com triagem de recicláveis e coleta de óleo usado.',
    endereco:'Rua Pau-Brasil', numero:'455', bairro:'São Mateus', cidade:'São Paulo', estado:'SP', cep:'03950-000',
    materiais:['papel','plastico','metal','vidro','oleo'], horarios:H_COOP, telefone:'(11) 0000-0116', whatsapp:'(11) 0000-0116', site:'https://example.com/ondedescartar/leste-viva' },

  { id:'eco-017', nome:'Ponto Verde Perdizes', tipo:'Ponto de entrega voluntária', distrito:'Perdizes', ..._at('Perdizes', .001, .002),
    descricao:'Contêineres de recicláveis e coletor de pilhas.',
    endereco:'Rua Sanhaço', numero:'730', bairro:'Perdizes', cidade:'São Paulo', estado:'SP', cep:'05014-000',
    materiais:['papel','plastico','vidro','metal','pilhas'], horarios:H_PEV, telefone:null, whatsapp:null, site:'https://example.com/ondedescartar/verde-perdizes' },

  { id:'eco-018', nome:'Ecoponto Manacá', tipo:'Ecoponto municipal', distrito:'Casa Verde', ..._at('Casa Verde', .001, 0),
    descricao:'Recebe entulho, móveis e resíduos especiais como pneus e lâmpadas.',
    endereco:'Rua Manacá-da-Serra', numero:'1.230', bairro:'Casa Verde', cidade:'São Paulo', estado:'SP', cep:'02512-000',
    materiais:['entulho','moveis','especiais'], horarios:H_ECO, telefone:'(11) 0000-0118', whatsapp:null, site:null },
];
