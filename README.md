# Little Beast — protótipo 0.1

Primeiro protótipo PWA do mascote virtual. Feito para começar leve e funcionar offline depois do primeiro carregamento.

## O que já funciona
- Interface responsiva para tablet/celular.
- Personagem marrom desenhado em pixel art via Canvas (sprite procedural inicial).
- Ações: alimentar, brincar, carinho, conversar e descansar.
- Barras de fome, energia, alegria e afinidade.
- Relógio, dia/noite visual e pequenas falas.
- Salvamento local via `localStorage`.
- Service worker para cache offline.

## Como executar no Ubuntu
Entre na pasta do projeto e execute:

```bash
python3 -m http.server 8000
```

No computador, abra `http://localhost:8000`.

Para abrir no tablet na mesma rede Wi-Fi:
1. Descubra o IP do computador com `hostname -I`.
2. No tablet, abra `http://IP_DO_COMPUTADOR:8000`.
3. Depois do carregamento, use o menu do navegador para **Adicionar à tela inicial**.

O modo offline do PWA exige que o app seja servido por `localhost` ou HTTPS. Acessar pelo IP local pode não permitir instalação/cache PWA em alguns navegadores; nesse caso, teste primeiro a interface pelo endereço local e depois publique em hospedagem HTTPS ou configure HTTPS na rede.

## Próximas etapas
1. Refinar o sprite e criar spritesheet real com animações.
2. Ajustar o ritmo das necessidades com testes no tablet.
3. Adicionar inventário, itens e cenário interativo.
4. Integrar IA por API, mantendo necessidades e memória local.
5. Empacotar como APK se a experiência PWA não for suficiente.

## Observação
Este protótipo não contém IA generativa ainda. O botão Conversar usa falas locais de demonstração. A integração com IA será uma etapa posterior para não depender da internet para as mecânicas básicas.
