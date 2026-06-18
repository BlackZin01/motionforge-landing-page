# LovPilot — Setup

## 1. Supabase

1. Crie um projeto em https://supabase.com
2. Abra **SQL Editor** e execute o conteúdo de `supabase-setup.sql`
3. Copie **Project URL** e **anon key** em **Settings → API**
4. Cole em `config.js`:

```js
const CONFIG = {
  supabaseUrl: 'https://SEU-PROJETO.supabase.co',
  supabaseAnonKey: 'eyJ...',
  licensePrefix: 'LP-',
};
```

## 2. Ícones

Coloque ícones PNG nas dimensões:
- `icons/icon16.png`  (16×16)
- `icons/icon48.png`  (48×48)
- `icons/icon128.png` (128×128)

## 3. Instalar no Chrome

1. Abra `chrome://extensions`
2. Ative **Modo do desenvolvedor**
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `extension/`

## 4. Usar

1. Abra `https://lovable.dev`
2. Clique no ícone do LovPilot na barra de extensões
3. Insira a chave de licença (ex: `LP-TEST-0000-0000` para testes)
4. O painel lateral abrirá automaticamente

## 5. Gerar licenças

Execute no SQL Editor do Supabase:

```sql
INSERT INTO licenses (key, active, max_devices, expires_at)
VALUES ('LP-NOME-XXXX-YYYY', true, 1, null);
```

## 6. Obfuscar para distribuição (opcional)

```bash
npm install -g javascript-obfuscator

javascript-obfuscator config.js   --output config.min.js
javascript-obfuscator background.js --output background.min.js
javascript-obfuscator content.js   --output content.min.js
javascript-obfuscator pageHook.js  --output pageHook.min.js
javascript-obfuscator popup.js     --output popup.min.js
```

Depois troque os `<script src="">` no `popup.html` para apontar para os arquivos `.min.js`.
