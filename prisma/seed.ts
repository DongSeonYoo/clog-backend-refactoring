import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const majorSeed = [
  { idx: 0, name: '기계공학과' },
  { idx: 1, name: '항공우주공학과' },
  { idx: 2, name: '조선해양공학과' },
  { idx: 3, name: '산업경영공학과' },
  { idx: 4, name: '화학공학과' },
  { idx: 5, name: '고분자공학과' },
  { idx: 6, name: '신소재공학과' },
  { idx: 7, name: '사회인프라공학과' },
  { idx: 8, name: '환경공학과' },
  { idx: 9, name: '공간정보공학과' },
  { idx: 10, name: '건축공학과' },
  { idx: 11, name: '건축학과' },
  { idx: 12, name: '에너지자원공학과' },
  { idx: 13, name: '전기공학과' },
  { idx: 14, name: '전자공학과' },
  { idx: 15, name: '정보통신공학과' },
  { idx: 16, name: '반도체시스템공학과' },
  { idx: 17, name: '수학과' },
  { idx: 18, name: '통계학과' },
  { idx: 19, name: '물리학과' },
  { idx: 20, name: '화학과' },
  { idx: 21, name: '해양과학과' },
  { idx: 22, name: '식품영양학과' },
  { idx: 23, name: '경영학과' },
  { idx: 24, name: '글로벌금융학과' },
  { idx: 25, name: '아태물류학부' },
  { idx: 26, name: '국제통상학과' },
  { idx: 27, name: '국어교육과' },
  { idx: 28, name: '영어교육과' },
  { idx: 29, name: '사회교육과' },
  { idx: 30, name: '체육교육과' },
  { idx: 31, name: '교육학과' },
  { idx: 32, name: '수학교육과' },
  { idx: 33, name: '행정학과' },
  { idx: 34, name: '정치외교학과' },
  { idx: 35, name: '미디어커뮤니케이션학과' },
  { idx: 36, name: '경제학과' },
  { idx: 37, name: '소비자학과' },
  { idx: 38, name: '아동심리학과' },
  { idx: 39, name: '사회복지학과' },
  { idx: 40, name: '한국어문학과' },
  { idx: 41, name: '사학과' },
  { idx: 42, name: '철학과' },
  { idx: 43, name: '중국학과' },
  { idx: 44, name: '일본언어문화학과' },
  { idx: 45, name: '영어영문학과' },
  { idx: 46, name: '프랑스언어문화학과' },
  { idx: 47, name: '문화콘텐츠문화경영학과' },
  { idx: 48, name: '의예과' },
  { idx: 49, name: '간호학과' },
  { idx: 50, name: '메카트로닉스공학과' },
  { idx: 51, name: '소프트웨어융합공학과' },
  { idx: 52, name: '산업경영학과' },
  { idx: 53, name: '금융투자학과' },
  { idx: 54, name: '조형예술학과' },
  { idx: 55, name: '디자인융합학과' },
  { idx: 56, name: '스포츠과학과' },
  { idx: 57, name: '연극영화학과' },
  { idx: 58, name: '의류디자인학과' },
  { idx: 59, name: '반도체산업융합학과' },
  { idx: 60, name: '인공지능공학과' },
  { idx: 61, name: '데이터사이언스학과' },
  { idx: 62, name: '스마트모빌리티공학과' },
  { idx: 63, name: '디자인테크놀로지학과' },
  { idx: 64, name: '컴퓨터공학과' },
  { idx: 65, name: '생명공학과' },
  { idx: 66, name: '생명과학과' },
];

async function main() {
  await prisma.$transaction(async (tx) => {
    await Promise.all(
      majorSeed.map(async (major) => {
        await tx.major.upsert({
          where: {
            idx: major.idx,
          },
          update: {},
          create: {
            ...major,
          },
        });
      }),
    );
  });
}

main()
  .then(() => {
    console.log('Seed complete');
  })
  .catch((e) => {
    console.error(e);
  });
