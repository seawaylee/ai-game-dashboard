import { ThemeItem, PieceTemplate } from './types';

// Helper to create simple blocks
const createBlock = (id: string, name: string, color: string, secondary?: string, top?: string): ThemeItem => ({
  id, name, template: 'block', baseColor: color, secondaryColor: secondary, topColor: top
});

// Helper to create heads
const createHead = (id: string, name: string, base: string, eyes: string, mouth?: string, hair?: string): ThemeItem => ({
  id, name, template: 'head', baseColor: base, secondaryColor: eyes, detailColor: mouth, topColor: hair
});

export const ASSETS: ThemeItem[] = [
  // --- MOBS (Heads) ---
  // Steve: Skin, Blue/Indigo Eyes, Mouth, Dark Brown Hair
  { id: 'steve', name: '史蒂夫', template: 'head', baseColor: '#F0B488', secondaryColor: '#494578', detailColor: '#77523f', topColor: '#281F17' },
  // Alex: Skin, Green Eyes, Mouth, Orange Hair
  { id: 'alex', name: '爱丽克丝', template: 'head', baseColor: '#F3C49C', secondaryColor: '#3d682e', detailColor: '#CD8E74', topColor: '#D87F33' },
  // Zombie: Green Skin, Black Eyes, Dark Green Hair
  { id: 'zombie', name: '僵尸', template: 'head', baseColor: '#629753', secondaryColor: '#000000', detailColor: '#3c6031', topColor: '#3e6333' },
  
  { id: 'skeleton', name: '骷髅', template: 'head', baseColor: '#E5E5E5', secondaryColor: '#333333', detailColor: '#999999' },
  { id: 'creeper', name: '苦力怕', template: 'creeper_head', baseColor: '#53AD48', secondaryColor: '#000000' },
  { id: 'enderman', name: '末影人', template: 'head', baseColor: '#161616', secondaryColor: '#cc00fa', detailColor: '#000000', topColor: '#000000' },
  
  // Animals
  { id: 'pig', name: '猪', template: 'head', baseColor: '#F0A6A9', secondaryColor: '#FFFFFF', detailColor: '#db6e73' },
  { id: 'cow', name: '牛', template: 'head', baseColor: '#443626', secondaryColor: '#FFFFFF', detailColor: '#A9A9A9', topColor: '#6d543b' },
  { id: 'sheep', name: '羊', template: 'head', baseColor: '#E5E5E5', secondaryColor: '#F2B997', detailColor: '#D3D3D3', topColor: '#FFFFFF' },
  { id: 'blaze', name: '烈焰人', template: 'head', baseColor: '#F6B201', secondaryColor: '#333333', detailColor: '#FFF200' },
  { id: 'slime_mob', name: '史莱姆', template: 'slime', baseColor: '#73C352', secondaryColor: '#4F8C35' },
  { id: 'spider', name: '蜘蛛', template: 'head', baseColor: '#3d3737', secondaryColor: '#aa0000', detailColor: '#2b2626' },
  { id: 'villager', name: '村民', template: 'head', baseColor: '#9e6246', secondaryColor: '#395e26', detailColor: '#bd8b72', topColor: '#5c3d2e' },
  { id: 'wither', name: '凋灵骷髅', template: 'head', baseColor: '#2b2b2b', secondaryColor: '#4d4d4d', detailColor: '#1a1a1a' },
  { id: 'ghast', name: '恶魂', template: 'head', baseColor: '#f0f0f0', secondaryColor: '#c7c7c7', detailColor: '#999999' },

  // --- ORES & BLOCKS ---
  // Grass uses topColor for the green top
  createBlock('grass', '草方块', '#6D4C34', '#593d29', '#5D9C45'),
  createBlock('dirt', '泥土', '#6D4C34', '#593d29'),
  createBlock('stone', '石头', '#7D7D7D', '#666666'),
  createBlock('cobble', '圆石', '#606060', '#333333'), // Darker contrast for cobble
  createBlock('wood', '橡木原木', '#5c4030', '#3b281e', '#855E42'), // Log style
  createBlock('planks', '橡木木板', '#A07652', '#825e3f'),
  createBlock('bedrock', '基岩', '#333333', '#888888'),
  createBlock('obsidian', '黑曜石', '#140D1D', '#3c3056'),
  createBlock('sand', '沙子', '#dccfa3', '#d6c898'),
  createBlock('gravel', '沙砾', '#878385', '#6e6b6d'),
  
  createBlock('ore_coal', '煤矿石', '#7D7D7D', '#222222'),
  createBlock('ore_iron', '铁矿石', '#7D7D7D', '#d8af93'),
  createBlock('ore_gold', '金矿石', '#7D7D7D', '#fcee4b'),
  createBlock('ore_diamond', '钻石矿', '#7D7D7D', '#4EEFDC'),
  createBlock('ore_emerald', '绿宝石矿', '#7D7D7D', '#17dd62'),
  createBlock('ore_redstone', '红石矿', '#7D7D7D', '#ff0000'),
  createBlock('ore_lapis', '青金石矿', '#7D7D7D', '#1445bc'),

  createBlock('block_gold', '金块', '#FDF55F', '#DBC51E'),
  createBlock('block_diamond', '钻石块', '#4EEFDC', '#2CBBAA'),
  createBlock('block_emerald', '绿宝石块', '#17dd62', '#0db54b'),
  createBlock('block_iron', '铁块', '#E5E5E5', '#CFCFCF'),
  createBlock('block_redstone', '红石块', '#ff1f1f', '#990000'),

  { id: 'tnt', name: 'TNT', template: 'tnt', baseColor: '#DB2E23' },

  // --- WOOL COLORS ---
  createBlock('wool_white', '白色羊毛', '#FFFFFF', '#DDDDDD'),
  createBlock('wool_orange', '橙色羊毛', '#F9801D', '#E06D10'),
  createBlock('wool_magenta', '品红色羊毛', '#C74EBD', '#A6389D'),
  createBlock('wool_light_blue', '淡蓝色羊毛', '#3AB3DA', '#2991B3'),
  createBlock('wool_yellow', '黄色羊毛', '#FED83D', '#E3BF26'),
  createBlock('wool_lime', '黄绿色羊毛', '#80C71F', '#64A112'),
  createBlock('wool_pink', '粉红色羊毛', '#F38BAA', '#D46D8C'),
  createBlock('wool_gray', '灰色羊毛', '#474F52', '#32393B'),
  createBlock('wool_cyan', '青色羊毛', '#169C9C', '#0E7A7A'),
  createBlock('wool_purple', '紫色羊毛', '#8932B8', '#6A1E94'),
  createBlock('wool_blue', '蓝色羊毛', '#3C44AA', '#2A3082'),
  createBlock('wool_brown', '棕色羊毛', '#835432', '#613C22'),
  createBlock('wool_green', '绿色羊毛', '#5E7C16', '#475E0F'),
  createBlock('wool_red', '红色羊毛', '#B02E26', '#8E2019'),
  createBlock('wool_black', '黑色羊毛', '#1D1D21', '#141416'),

  // --- ITEMS ---
  { id: 'sword_diamond', name: '钻石剑', template: 'item_sword', baseColor: '#4EEFDC', secondaryColor: '#6e4c30' },
  { id: 'sword_gold', name: '金剑', template: 'item_sword', baseColor: '#FDF55F', secondaryColor: '#6e4c30' },
  { id: 'pickaxe_diamond', name: '钻石镐', template: 'item_pickaxe', baseColor: '#4EEFDC', secondaryColor: '#6e4c30' },
  { id: 'diamond_gem', name: '钻石', template: 'item_gem', baseColor: '#4EEFDC' },
  { id: 'emerald_gem', name: '绿宝石', template: 'item_gem', baseColor: '#17dd62' },
];

export const getAsset = (id: string): ThemeItem => ASSETS.find(a => a.id === id) || ASSETS[0];

export const BOARD_SIZE = 15;
export const WIN_COUNT = 5;
