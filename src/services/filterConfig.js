// src/services/filterConfig.js

// 아이콘 경로를 동적으로 가져오기 위해 import.meta.glob 사용
// Vite의 기능으로, assets 폴더 내의 모든 png 파일을 가져옵니다.
const icons = import.meta.glob('../assets/*.png', { eager: true, query: '?url', import: 'default' });

const getIcon = (name) => {
  // 아이콘 파일 이름 형식: /src/assets/atmosphere.png
  return icons[`../assets/${name}.png`];
};


export const filterConfig = [
  {
    id: 'purpose',
    label: '목적',
    dbField: '목적',
    icon: getIcon('purpose'),
    options: ['조용히 쉬기', '대화', '카공/작업', '정보없음'],
  },
  {
    id: 'atmosphere',
    label: '분위기',
    dbField: '분위기',
    icon: getIcon('atmosphere'),
    options: ['감성적', '모던', '빈티지', '특별함/개성있음', '정보없음'],
  },
  {
    id: 'waiting',
    label: '웨이팅',
    dbField: '웨이팅',
    icon: getIcon('waiting'),
    options: ['가끔있음', '긴 웨이팅', '정보부족'],
  },
  {
    id: 'plug',
    label: '콘센트',
    dbField: '콘센트',
    icon: getIcon('plug'),
    options: ['있음', '많음', '정보부족'],
  },
  {
    id: 'chair',
    label: '의자',
    dbField: '의자',
    icon: getIcon('chair'),
    options: ['편함', '정보부족'],
  },
  {
    id: 'table',
    label: '테이블',
    dbField: '테이블',
    icon: getIcon('table'),
    options: ['넓고 낮지않음', '좁거나 낮음', '정보부족'],
  },
  {
    id: 'noise',
    label: '소음',
    dbField: '소음',
    icon: getIcon('noise'),
    options: ['조용함', '정보부족'],
  },
  {
    id: 'light',
    label: '조명',
    dbField: '조명',
    icon: getIcon('light'),
    options: ['밝음', '어두움', '정보부족'],
  },
  {
    id: 'distance',
    label: '좌석 간격',
    dbField: '좌석 간격',
    icon: getIcon('distance'),
    options: ['넓음', '좁음', '정보부족'],
  },
  {
    id: 'size',
    label: '규모',
    dbField: '규모',
    icon: getIcon('size'),
    options: ['적당함', '작은 편', '큰 편/대형카페', '정보부족'],
  },
  {
    id: 'beverage',
    label: '음료',
    dbField: '음료',
    icon: getIcon('beverage'),
    options: ['맛있거나 평범', '월등히 맛있음', '정보부족'],
  },
  {
    id: 'dessert',
    label: '디저트',
    dbField: '디저트',
    icon: getIcon('dessert'),
    options: ['맛있거나 평범', '월등히 맛있음', '정보부족'],
  },
  {
    id: 'time',
    label: '영업마감',
    dbField: '영업마감',
    icon: getIcon('time'),
    options: ['8시 전', '11시 전', '24시간 영업', '정보부족'],
  },
  {
    id: 'other',
    label: '기타',
    dbField: '기타',
    icon: getIcon('other'),
    type: 'chips', // 팝업 렌더링 타입을 지정
    options: [
      { label: '깨끗한 화장실', dbField: '화장실' },
      { label: '주차', dbField: '주차' },
      { label: '단체석', dbField: '단체석' },
      { label: '뷰', dbField: '뷰' },
      { label: '반려동물', dbField: '반려동물' },
    ]
  }
];

// '기타' 항목들은 filterConfig로 통합되었으므로 이 설정은 더 이상 필요 없습니다.
export const otherFiltersConfig = [];
