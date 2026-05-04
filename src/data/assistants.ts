import type { Assistant } from '../types';

export const ALL_ASSISTANTS: Omit<Assistant, 'isHired'>[] = [
  { id: 'a1', name: 'エルザ', role: '受付嬢', desc: '毎ターン、街の好感度を3上昇させる。', cost: 100, buff: 'town_favor_up' },
  { id: 'a2', name: 'バルド', role: '教官', desc: '任務成功時の冒険者の成長率を1.5倍にする。', cost: 200, buff: 'training_up' },
  { id: 'a3', name: 'シオン', role: '裏の顔役', desc: '毎ターン、悪名を2減少させる。', cost: 300, buff: 'notoriety_down' },
  { id: 'a4', name: 'クライン', role: '会計士', desc: '全施設の維持費を15%削減する。', cost: 150, buff: 'upkeep_down' },
  { id: 'a5', name: 'ルリ', role: '広報官', desc: '依頼成功時の獲得名声を1.2倍にする。', cost: 250, buff: 'fame_up' },
  { id: 'a6', name: 'ガストン', role: '料理長', desc: '冒険者の最大戦力が5%底上げされる。', cost: 200, buff: 'power_up_passive' },
  { id: 'a7', name: 'ミレイ', role: '占い師', desc: '稀に高難易度のレア依頼を発見する。', cost: 180, buff: 'rare_quest_discovery' },
  { id: 'a8', name: 'ヴォルフ', role: 'スカウト', desc: '毎ターンの冒険者出現率が上昇する。', cost: 120, buff: 'recruitment_up' },
  { id: 'a9', name: 'セリカ', role: '司書', desc: 'マスタースキルの習得コストを10%軽減する。', cost: 220, buff: 'skill_cost_down' },
  { id: 'a10', name: 'ドラン', role: '資材商', desc: '施設拡張のコストを10%軽減する。', cost: 280, buff: 'facility_cost_down' },
  { id: 'a11', name: 'テッサ', role: '調合師', desc: '負傷した冒険者の復帰が早まる（未実装効果だが枠として）。', cost: 160, buff: 'healing_up' },
  { id: 'a12', name: 'ジル', role: '隠密', desc: '工作の成功率が向上し、悪名上昇を抑える。', cost: 350, buff: 'intrigue_master' },
];
