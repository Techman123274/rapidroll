/**
 * Maps engine symbol IDs to real asset paths under public/games/cyber-crime/
 */

const BASE = "/games/cyber-crime";

export const SYMBOL_IMAGE: Record<string, string> = {
  symbol_1: `${BASE}/symbol/Azure_Data_Jewel_symbol_0_1.png`,
  symbol_2: `${BASE}/symbol/Silver_Lock_Glyph_symbol_0_1.png`,
  symbol_3: `${BASE}/symbol/Neon_Firewall_Shield_symbol_0_1.png`,
  symbol_4: `${BASE}/symbol/Crystalline_Red_Siren_symbol_1_1.png`,
  symbol_5: `${BASE}/symbol/Holo_Credit_Card_symbol_1_1.png`,
  wild: `${BASE}/character_symbol/Code_Queen_symbol_0_1.png`,
  scatter: `${BASE}/character_symbol/Masked_Cyber_Thief_symbol_1_1.png`,
  multiplier: `${BASE}/symbol/Emerald_Digital_Key_symbol_2_1.png`,
};

export const BACKGROUND_IMAGE = `${BASE}/background/Neon_City_Data_Vault_background_1771854579496_1.png`;

export const SPIN_BUTTON_IMAGE = `${BASE}/button/SPIN_button_button_SPIN_1.png`;
export const SPIN_BUTTON_HOVER_IMAGE = `${BASE}/button/SPIN_button_button_SPIN_hover.png`;

export const GAME_TITLE_IMAGE = `${BASE}/game_title/Game_Title_title_1771854534046_1.png`;

export function getSymbolImageUrl(symbolId: string): string {
  return SYMBOL_IMAGE[symbolId] ?? "";
}
