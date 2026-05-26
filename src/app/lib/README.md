# lib/

Camada de infraestrutura — conexão com serviços externos e queries ao banco de dados.

## Arquivos

```
lib/
├── supabase.ts   → instância do cliente Supabase
├── queries.ts    → queries ao banco (leitura)
└── utils.ts      → utilitários gerais (gerado pelo shadcn)
```

## supabase.ts

Exporta uma única instância do cliente Supabase configurada com as variáveis de ambiente.

```typescript
import { supabase } from "@/app/lib/supabase";
```

Nunca instancie o cliente Supabase fora deste arquivo.

## queries.ts

Contém todas as queries de leitura do banco. Cada função retorna dados já formatados no formato esperado pelos tipos definidos em `themes/types.ts`.

```typescript
// busca todos os dados de uma barbearia pelo slug
const data = await getBarbershopBySlug("barbearia-do-joao");
```

### Regras

- Queries nunca são chamadas diretamente nos componentes
- Componentes usam os hooks em `hooks/` que chamam as queries
- Filtros de negócio (serviços ativos, barbeiros ativos) são aplicados aqui, não nos componentes
- Uma única query busca todos os dados da barbearia (sem N+1)

## Variáveis de ambiente necessárias

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
