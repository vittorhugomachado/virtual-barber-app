# themes/

Responsável por tudo relacionado à apresentação visual das páginas públicas das barbearias.

## Estrutura

```
themes/
├── types.ts        → contrato de dados (BarbershopPageProps)
├── resolver.tsx    → decide qual template renderizar
├── default/        → template padrão (plano iniciante)
├── premium-a/      → template modern (plano profissional+)
├── premium-b/      → template minimalist (plano profissional+)
└── premium-c/      → template dark (plano master)
```

## Como funciona

O `ThemeResolver` recebe os dados da barbearia + o plano e decide qual template carregar. Cada template é carregado com `lazy()` — só baixa o código quando necessário.

```tsx
<ThemeResolver {...barbershopData} plan={plan} />
```

## Regras importantes

- Todo template recebe exatamente `BarbershopPageProps` — nunca acessa o banco diretamente
- Templates são componentes "burros": só recebem props e renderizam
- A prop `isPreview` desabilita ações reais (agendamento, links) no modo de edição
- Adicionar um novo template = criar a pasta + registrar no `resolver.tsx`

## Acesso por plano

| Template   | Iniciante | Profissional | Master |
|------------|-----------|--------------|--------|
| vintage    | ✅        | ✅           | ✅     |
| modern     | ❌        | ✅           | ✅     |
| minimalist | ❌        | ✅           | ✅     |
| dark       | ❌        | ❌           | ✅     |