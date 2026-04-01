# Booking Flow

## Objetivo
Este documento descreve como o fluxo de agendamento consome dados, como eles circulam entre os componentes e qual e a responsabilidade de cada hook, funcao e componente principal.

## Visao geral do fluxo
O fluxo de booking do tema `default` e dividido em 4 passos:

1. Selecionar servicos
2. Selecionar data
3. Selecionar barbeiro e horario para cada servico
4. Confirmar e gravar os agendamentos

Arquivo raiz do fluxo:

- [booking.tsx](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\themes\default\booking.tsx)

## Fontes de dados

### 1. Dados da barbearia
Origem:

- [queries.ts](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\lib\queries.ts)
- [barbershop-data-context.ts](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\contexts\barbershop-data\barbershop-data-context.ts)

Responsabilidade:

- carregar dados estruturais da barbearia
- expor `services`, `barbers` e `openingHours`
- incluir `barber.availability` ja ordenado

Principais dados consumidos no booking:

- `services`
- `barbers`
- `openingHours`
- `barber.availability`

### 2. Dados do carrinho
Origem:

- [use-cart.ts](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\hooks\use-cart.ts)

Responsabilidade:

- guardar os servicos escolhidos
- expor `items`, `total`, `totalDuration`
- permitir adicionar e remover servicos

### 3. Dados do cliente autenticado
Origem:

- `useAuthStore()` usado no fluxo de booking

Responsabilidade:

- fornecer `customer.id`
- fornecer nome atual do cliente para confirmacao

### 4. Agenda do barbeiro e agenda do cliente
Origem:

- [booking-queries.ts](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\lib\booking-queries.ts)

Funcoes principais:

- `getAppointmentsForBarberOnDate`
- `getAppointmentsForCustomerOnDate`
- `createAppointments`

Responsabilidade:

- consultar agendamentos ja existentes no banco
- bloquear conflitos reais da agenda
- gravar os agendamentos finais

## Orquestracao principal

### `DefaultBookingPage`
Arquivo:

- [booking.tsx](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\themes\default\booking.tsx)

Responsabilidade:

- controlar em qual passo o usuario esta
- armazenar `date`
- armazenar `serviceSelections`
- decidir quando renderizar cada etapa

Estados controlados aqui:

- `step`
- `date`
- `serviceSelections`
- `done`

Formato de `serviceSelections`:

```ts
Record<
  string,
  {
    barber: Barber;
    time: string;
  }
>
```

Chave:

- `service.id`

## Componentes por etapa

### Etapa 1: `StepServices`
Arquivo:

- [step-services.tsx](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\themes\default\components\booking\step-1\step-services.tsx)

Consome:

- `services` do contexto da barbearia
- `items`, `addService`, `removeService`, `hasService`, `total`, `totalDuration` do carrinho

Responsabilidade:

- listar servicos disponiveis
- adicionar/remover servicos do carrinho
- mostrar resumo de quantidade, duracao e valor

Nao faz:

- nao escolhe data
- nao calcula horarios
- nao acessa agenda

### Etapa 2: `StepDate`
Arquivo:

- [step-date.tsx](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\themes\default\components\booking\step-2\step-date.tsx)

Consome:

- `openingHours` do contexto da barbearia

Responsabilidade:

- permitir escolher uma data valida
- bloquear dias fechados
- limitar a janela de navegacao do calendario

Nao faz:

- nao valida agenda do barbeiro
- nao calcula slots

### Etapa 3: `StepBarberTime`
Arquivo:

- [step-barber-time.tsx](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\themes\default\components\booking\step-3\step-barber-time.tsx)

Consome:

- `items` do carrinho
- `barbers` e `openingHours` da barbearia
- `serviceSelections` vindas da pagina de booking
- `useAggregatedBookingData`

Responsabilidade:

- montar um card para cada servico escolhido
- pedir os slots agregados por servico/barbeiro
- passar para cada card os conflitos com os outros servicos selecionados

Importante:

- `otherSelections` e calculado a partir dos servicos atualmente no carrinho
- isso evita que servicos removidos continuem bloqueando horarios

### Etapa 3.1: `ServiceSlotCard`
Arquivo:

- [service-slot-card.tsx](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\themes\default\components\booking\step-3\components\service-slot-card.tsx)

Consome:

- `selection` do servico atual
- `otherSelections`
- `preloadedSlotsByBarber`
- `preloadedLoading`

Responsabilidade:

- controlar a abertura/fechamento do card
- controlar o barbeiro atualmente em visualizacao
- aplicar o filtro final de conflito entre os servicos do mesmo carrinho
- renderizar `BarberGrid` ou `TimeSlots`

Detalhe importante:

- `allSlotsForDay` mostra todos os slots do dia da barbearia
- `availableSet` marca quais estao realmente disponiveis
- por isso um horario pode aparecer na grade e ainda assim estar indisponivel

### Etapa 3.2: `BarberGrid`
Arquivo:

- [barber-grid.tsx](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\themes\default\components\booking\step-3\components\barber-grid.tsx)

Responsabilidade:

- listar apenas os barbeiros elegiveis para o servico atual
- retornar o barbeiro escolhido ao card

Nao faz:

- nao calcula horario
- nao consulta agenda

### Etapa 3.3: `TimeSlots`
Arquivo:

- [time-slots.tsx](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\themes\default\components\booking\step-3\components\time-slots.tsx)

Responsabilidade:

- receber a lista de slots do dia
- receber o conjunto de slots disponiveis
- marcar cada horario como disponivel ou indisponivel
- organizar a exibicao por periodo: manha, tarde e noite

Nao decide disponibilidade:

- ele apenas exibe o resultado recebido

### Etapa 4: `StepConfirm`
Arquivo:

- [step-confirm.tsx](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\themes\default\components\booking\step-4\step-confirm.tsx)

Consome:

- `services`
- `serviceSelections`
- `customerId`
- `barbershopId`

Responsabilidade:

- mostrar o resumo final do agendamento
- validar nome do cliente quando necessario
- validar conflitos finais entre os servicos selecionados
- montar payload de `appointments`
- chamar `createAppointments`

Protecoes importantes:

- impede sobreposicao entre servicos do mesmo carrinho antes de salvar
- trata erros inesperados no fluxo de confirmacao

## Hooks principais

### `useAggregatedBookingData`
Arquivo:

- [use-aggregated-booking-data.ts](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\hooks\use-aggregated-booking-data.ts)

Responsabilidade:

- centralizar a carga de agenda do passo 3
- buscar agendamentos de todos os barbeiros elegiveis em paralelo
- buscar agendamentos do cliente uma unica vez
- calcular um mapa pronto de slots por servico e barbeiro

Entrada:

- `barbershopId`
- `customerId`
- `date`
- `services`
- `barbers`
- `openingHours`

Saida:

```ts
{
  slotsByService: Record<string, Record<string, string[]>>;
  loading: boolean;
}
```

Motivacao:

- evitar refetch por troca de barbeiro
- reduzir chamadas repetidas ao banco

### `useAvailableSlots`
Arquivo:

- [use-available-slots.ts](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\hooks\use-available-slots.ts)

Responsabilidade:

- calcular slots disponiveis para um barbeiro especifico
- servir como fallback e como base da logica pura compartilhada

Dados usados no calculo:

- horarios da barbearia
- disponibilidade do barbeiro
- agendamentos existentes do barbeiro
- agendamentos existentes do cliente
- duracao do servico
- regra de horarios passados no dia atual

Saida:

- `slots`
- `loading`

### `calculateAvailableSlots`
Arquivo:

- [use-available-slots.ts](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\hooks\use-available-slots.ts)

Responsabilidade:

- implementar a regra central de disponibilidade
- ser usada tanto no hook individual quanto no agregado

Bloqueios aplicados:

- horario fora da disponibilidade do barbeiro
- conflito com agenda do barbeiro
- conflito com agenda do cliente
- horario passado no dia atual

## Funcoes utilitarias importantes

### `getEffectivePeriodsForDay`
Arquivo:

- [format-time.ts](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\utils\format-time.ts)

Responsabilidade:

- definir qual janela de atendimento vale para o barbeiro em um dia

Prioridade da regra:

1. se nao houver `barberAvailability`, usa `openingHours`
2. se houver `is_day_off`, retorna vazio
3. se houver horarios explicitos em `barberAvailability`, usa esses horarios
4. caso contrario, volta para `openingHours`

### `getAllSlotsForDay`
Arquivo:

- [format-time.ts](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\utils\format-time.ts)

Responsabilidade:

- gerar a grade de slots exibida no dia
- usada para mostrar horarios visiveis no `TimeSlots`

Observacao:

- no fluxo atual do passo 3, essa funcao esta sendo usada com `openingHours`
- isso faz os horarios aparecerem mesmo quando o barbeiro nao esta disponivel
- a indisponibilidade fica por conta de `availableSet`

### `timeToMinutes`
Arquivo:

- [format-time.ts](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\utils\format-time.ts)

Responsabilidade:

- converter `HH:mm` para minutos
- base de comparacao de intervalos

### `addMinutes`
Arquivo:

- [format-time.ts](C:\Users\Vitor Hugo\OneDrive\Desktop\virtual-barber-front-end\virtual-barber-app\src\utils\format-time.ts)

Responsabilidade:

- calcular hora final a partir da duracao do servico

## Como a disponibilidade e decidida

Para um slot ser considerado disponivel, ele precisa passar por todas estas regras:

1. caber integralmente dentro da janela valida do barbeiro
2. nao colidir com nenhum agendamento existente do barbeiro
3. nao colidir com nenhum agendamento existente do cliente
4. nao estar no passado, se a data for hoje
5. no card do servico, nao colidir com os outros servicos do mesmo carrinho

## Camadas de protecao contra conflito

### Camada 1: agenda real
Feita em:

- `getAppointmentsForBarberOnDate`
- `getAppointmentsForCustomerOnDate`
- `calculateAvailableSlots`

Protege contra:

- conflito com outros clientes
- conflito com agenda ja gravada

### Camada 2: carrinho atual
Feita em:

- `ServiceSlotCard`

Protege contra:

- sobreposicao entre os servicos escolhidos no fluxo atual

### Camada 3: validacao final antes de salvar
Feita em:

- `StepConfirm`

Protege contra:

- qualquer sobreposicao residual entre os servicos do carrinho, mesmo que a UI tenha deixado passar algum caso

## Resumo de responsabilidades

`booking.tsx`

- orquestra o fluxo

`StepServices`

- escolhe servicos

`StepDate`

- escolhe data

`StepBarberTime`

- coordena a escolha de barbeiro e horario

`ServiceSlotCard`

- aplica conflitos entre servicos e mostra o detalhe do servico

`BarberGrid`

- escolhe barbeiro

`TimeSlots`

- exibe slots disponiveis e indisponiveis

`StepConfirm`

- revisa e confirma

`useAggregatedBookingData`

- agrega agenda para o passo 3

`useAvailableSlots`

- calcula disponibilidade de um barbeiro

`calculateAvailableSlots`

- regra central de bloqueio

`booking-queries.ts`

- conversa com o banco para ler e gravar agendamentos

`format-time.ts`

- concentra regras utilitarias de tempo e janelas
