import type { Course, Group, Role, StudyState } from './model.ts'
const core=`B0B01LAGA|Lineární algebra|7|winter|4|2|0
B0B01MA1A|Matematická analýza 1|6|winter|4|2|0
BAB31AF1|Základy anatomie a fyziologie I.|4|winter|2|0|2
B0B01DRN|Diferenciální rovnice a numerika|4|summer|2|2|0
B0B01MA2|Matematická analýza 2|7|both|4|2|0
B3B02FY1A|Fyzika 1|7|summer|4|2|1
BAB31AF2|Základy anatomie a fyziologie II.|4|summer|2|0|2
B2B31ZEOA|Základy elektrických obvodů|5|summer|2|0|2
BAB36PRGA|Programování v C|6|summer|2|2|0
B0B01KAN|Komplexní analýza|5|winter|2|2|0
B3B02FY2|Fyzika 2|6|winter|3|2|1
BAB02CHE|Chemie pro bioinženýrství|3|winter|2|0|1
BAB17EMP|Elektromagnetické pole|5|winter|2|2|0
BAB31ZZS|Základy zpracování signálů|4|winter|2|2|0
B2B38EMBA|Elektrická měření|5|winter|2|0|2
B0B01STP|Statistika a pravděpodobnost|5|summer|2|2|0
BAB02BFY|Biofyzika|4|summer|2|0|2
B2B31EO1|Elektronické obvody 1|4|summer|2|0|2
B4M33DZO|Digitální obraz|6|both|2|2|0
B2B37SAS|Signály a soustavy|5|summer|2|2|0
BBPROJ4|Projekt bakalářský|4|both|0|0|0
BAB31GEN|Genetika|3|winter|2|0|0
B0B33OPT|Optimalizace|7|both|4|2|0
B4B33RPZ|Rozpoznávání a strojové učení|6|winter|2|2|0
BAB34BMS|Biomedicínské senzory|4|winter|2|0|2`
const elective=`2241050|Biomechanika pro bakaláře|4|unknown|0|0|0
B3B33KUI|Kybernetika a umělá inteligence|6|summer|2|2|0
B3B33LAR|Laboratoře robotiky|4|summer|0|0|4
B3B33ROB|Robotika|5|winter|2|2|0
BAB34BSP|Biomedicínské sensory prakticky|4|winter|0|0|4
BAB34MNS|Mikro a nanosystémy pro biomedicínu|4|winter|2|0|2
B4B36ZUI|Základy umělé inteligence|6|summer|2|2|0
B4B01NUM|Numerické metody|6|winter|2|2|0
B2B34MIK|Mikrokontroléry|4|winter|2|0|2
B0B36DBS|Databázové systémy|6|summer|2|2|0
BAB37APO|Aplikovaná optika|4|summer|2|0|2
B3B38LPE|Laboratoře průmyslové elektroniky a senzorů|4|summer|0|0|4
B4B38NVS|Návrh vestavných systémů|6|winter|2|0|2
B0B01LGR|Logika a grafy|5|both|2|2|0
B0B02UAK|Úvod do akustiky|4|summer|2|2|0
B2B17TBK|Technika bezdrátové komunikace|4|summer|2|2|0
B2B31EO2|Elektronické obvody 2|4|winter|2|0|2
B4B33ALG|Algoritmizace|6|winter|2|2|0`
function rows(text:string,role:Role,group:Group):Course[]{return text.split('\n').map(line=>{const [code,name,credits,season,l,p,b]=line.split('|');return {code,name,credits:Number(credits),role,group,season:season as Course['season'],lectures:Number(l),practices:Number(p),labs:Number(b),selfStudy:null,hoursKnown:true,kosLink:`https://kos.cvut.cz/course-syllabus/${code}`,surveyLink:''}})}
export const CATALOGUE:Course[]=[...rows(core,'P','core'),...rows(elective,'PV','electiveCore'),...rows('BBAP20|Bakalářská práce|20|both|0|0|0','P','thesis'),...rows('B0B04B1K|Anglický jazyk B1 - klasifikovaný zápočet|0|both|0|0|0\nB0B04B2Z|Anglický jazyk B2 - zkouška|0|both|0|0|0','P','english'),...rows('BAB37ZPR|Základy programování|6|winter|2|2|0\nB3B33ALP|Algoritmy a programování|6|winter|2|2|0','PV','programming'),...rows('BAB31UBI|Úvod do bioinženýrství|4|winter|2|0|2\nB2B15UELA|Úvod do elektrotechniky|4|winter|2|0|1','PV','introduction')]
for(const c of CATALOGUE){if(c.group==='electiveCore'){c.lectures=0;c.practices=0;c.labs=0;c.hoursKnown=false}if(c.code==='BBPROJ4')c.hoursKnown=false}
export function initialState():StudyState{return {schemaVersion:2,courses:structuredClone(CATALOGUE),enrollments:[],plans:[{id:'main',name:'Můj plán',placements:{}}],activePlanId:'main',settings:{name:'Moje studium',workHours:20,weekBudget:60,lessonMinutes:45,targetCredits:180,confirmedProgramme:false},official:{credits:null,average:null,weightedAverage:null,importedAt:null,source:''},updatedAt:new Date().toISOString()}}
