# store/

Gerenciamento de estado global com Zustand.

## Arquivos

```
store/
├── authStore.ts        → estado do cliente autenticado
├── bookingStore.ts     → estado do fluxo de agendamento
└── barbershopStore.ts  → cache dos dados da barbearia
```

## authStore

Armazena os dados do cliente logado. **Persiste no localStorage** — sobrevive ao refresh da página.

```typescript
const { customer, isAuthenticated } = useAuthStore()
```

| Campo           | Tipo      | Descrição                        |
|-----------------|-----------|----------------------------------|
| customer        | Customer  | dados do cliente logado          |
| isAuthenticated | boolean   | true se há cliente logado        |
| isLoading       | boolean   | true durante chamadas de auth    |

## bookingStore

Armazena o estado do fluxo de agendamento em andamento. **Não persiste** — reseta se fechar o browser.

```typescript
const { selection, step, setService, setDate, setBarberAndTime } = useBookingStore()
```

| Campo        | Tipo    | Descrição                          |
|--------------|---------|------------------------------------|
| step         | number  | etapa atual (0-3)                  |
| selection    | object  | serviço, data, barbeiro e hora     |
| barbershopId | string  | ID da barbearia do agendamento     |

### Fluxo dos steps

```
0 → escolha do serviço
1 → escolha da data
2 → escolha do barbeiro e hora
3 → confirmação
```

Cada setter avança o step e reseta as seleções posteriores para evitar estados inconsistentes.

## barbershopStore

Cache em memória dos dados da barbearia atual. **Não persiste** — rebusca a cada visita.

```typescript
const { data, isLoading, error } = useBarbershopStore()
```

Nunca use este store diretamente nos componentes — use o hook `useBarbershop(slug)` que gerencia o cache automaticamente.

## Regra geral

Stores nunca fazem chamadas ao Supabase. Essa responsabilidade é dos hooks em `hooks/`.