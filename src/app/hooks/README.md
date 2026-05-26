# hooks/

Ponte entre a camada de dados/estado e os componentes React.

## Arquivos

```
hooks/
├── useBarbershop.ts  → busca e cacheia dados da barbearia
├── useAuth.ts        → expõe estado de autenticação e signOut
└── useBooking.ts     → expõe estado do agendamento e confirmação
```

## useBarbershop

Busca os dados de uma barbearia pelo slug. Usa o `barbershopStore` como cache — só vai ao banco se os dados ainda não estiverem em memória.

```typescript
const { data, isLoading, error } = useBarbershop("barbearia-do-joao");
```

| Retorno   | Tipo                           | Descrição                    |
| --------- | ------------------------------ | ---------------------------- |
| data      | BarbershopPageProps & { plan } | dados completos da barbearia |
| isLoading | boolean                        | true enquanto busca          |
| error     | string ou null                 | mensagem de erro se falhar   |

## useAuth

Expõe o estado de autenticação do cliente e a função de logout.

```typescript
const { customer, isAuthenticated, isLoading, signOut } = useAuth();
```

Para login e OTP, use os componentes em `components/auth/` que encapsulam esse fluxo.

## useBooking

Expõe o estado completo do agendamento e a função de confirmação que grava no banco.

```typescript
const {
  selection,
  step,
  setService,
  setDate,
  setBarberAndTime,
  confirmBooking,
} = useBooking();
```

A função `confirmBooking` valida todos os dados antes de inserir no banco e reseta o store após sucesso.

```typescript
const { success, error } = await confirmBooking();
```

## Regra geral

- Componentes nunca importam de `lib/` ou `store/` diretamente
- Toda lógica de negócio que envolve múltiplos stores fica nos hooks
- Hooks nunca renderizam JSX — só lógica e estado
